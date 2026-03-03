import type { VercelRequest, VercelResponse } from "@vercel/node";

const PLAN_AMOUNT = 49.9;

function sendJson(res: VercelResponse, status: number, payload: unknown) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).send(payload);
}

function getPayPalBaseUrl() {
  if (process.env.PAYPAL_API_BASE) {
    return process.env.PAYPAL_API_BASE;
  }

  const envMode = (process.env.PAYPAL_ENV || "sandbox").toLowerCase();
  return envMode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseUrl = getPayPalBaseUrl();

  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET missing");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PayPal oauth failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return { accessToken: data.access_token as string, baseUrl };
}

async function resolveUserIdFromToken(accessToken: string) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase env vars missing");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const user = await response.json();
  return user?.id || null;
}

async function markPremium(perfilId: string, status: "completed" | "failed", subscriptionId: string) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase service role key missing");
  }

  await fetch(`${supabaseUrl}/rest/v1/pagamentos`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      perfil_id: perfilId,
      valor: PLAN_AMOUNT,
      status,
      metodo: `paypal_subscription:${subscriptionId}`,
    }),
  });

  if (status !== "completed") {
    return;
  }

  const updateResponse = await fetch(`${supabaseUrl}/rest/v1/perfis?id=eq.${encodeURIComponent(perfilId)}`, {
    method: "PATCH",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ is_premium: true }),
  });

  if (!updateResponse.ok) {
    const text = await updateResponse.text();
    throw new Error(`Failed to update perfil premium status: ${text}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    const userToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
    const subscriptionID = req.body?.subscriptionID as string | undefined;

    if (!userToken) {
      return sendJson(res, 401, { error: "Unauthorized" });
    }

    if (!subscriptionID) {
      return sendJson(res, 400, { error: "Missing subscriptionID" });
    }

    const userId = await resolveUserIdFromToken(userToken);
    if (!userId) {
      return sendJson(res, 401, { error: "Invalid auth token" });
    }

    const { accessToken, baseUrl } = await getPayPalAccessToken();

    const subscriptionResponse = await fetch(`${baseUrl}/v1/billing/subscriptions/${subscriptionID}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const subscriptionData = await subscriptionResponse.json();

    if (!subscriptionResponse.ok) {
      console.error("[paypal/activate-subscription] verify failed", subscriptionData);
      await markPremium(userId, "failed", subscriptionID);
      return sendJson(res, 500, { error: "Could not verify PayPal subscription" });
    }

    const status = subscriptionData?.status as string | undefined;
    if (status !== "ACTIVE" && status !== "APPROVAL_PENDING") {
      await markPremium(userId, "failed", subscriptionID);
      return sendJson(res, 400, { error: `Subscription not active (${status || "unknown"})` });
    }

    await markPremium(userId, "completed", subscriptionID);

    return sendJson(res, 200, {
      success: true,
      subscriptionID,
      status,
    });
  } catch (error) {
    console.error("[paypal/activate-subscription]", error);
    return sendJson(res, 500, { error: "Internal server error" });
  }
}

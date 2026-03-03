import type { VercelRequest, VercelResponse } from "@vercel/node";

const PLAN_AMOUNT = 49.9;
const PLAN_CURRENCY = "BRL";

function sendJson(res: VercelResponse, status: number, payload: unknown) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).send(payload);
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseUrl = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

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

async function markPremium(perfilId: string, status: string) {
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
      metodo: "paypal",
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
    const orderID = req.body?.orderID as string | undefined;

    if (!userToken) {
      return sendJson(res, 401, { error: "Unauthorized" });
    }

    if (!orderID) {
      return sendJson(res, 400, { error: "Missing orderID" });
    }

    const userId = await resolveUserIdFromToken(userToken);
    if (!userId) {
      return sendJson(res, 401, { error: "Invalid auth token" });
    }

    const { accessToken, baseUrl } = await getPayPalAccessToken();

    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      console.error("[paypal/capture-order] capture failed", captureData);
      await markPremium(userId, "failed");
      return sendJson(res, 500, { error: "Could not capture payment" });
    }

    const captureStatus = captureData?.status;

    if (captureStatus !== "COMPLETED") {
      await markPremium(userId, "failed");
      return sendJson(res, 400, { error: `Payment not completed (${captureStatus})` });
    }

    await markPremium(userId, "completed");

    return sendJson(res, 200, {
      success: true,
      orderID,
      status: captureStatus,
      currency: PLAN_CURRENCY,
      amount: PLAN_AMOUNT,
    });
  } catch (error) {
    console.error("[paypal/capture-order]", error);
    return sendJson(res, 500, { error: "Internal server error" });
  }
}

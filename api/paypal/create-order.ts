import type { VercelRequest, VercelResponse } from "@vercel/node";

const PLAN_AMOUNT = "49.90";
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    const userToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!userToken) {
      return sendJson(res, 401, { error: "Unauthorized" });
    }

    const userId = await resolveUserIdFromToken(userToken);
    if (!userId) {
      return sendJson(res, 401, { error: "Invalid auth token" });
    }

    const { accessToken, baseUrl } = await getPayPalAccessToken();

    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: userId,
            description: "Plano Premium BDSMBRAZIL - 1 mês",
            amount: {
              currency_code: PLAN_CURRENCY,
              value: PLAN_AMOUNT,
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "BDSMBRAZIL",
        },
      }),
    });

    if (!orderResponse.ok) {
      const text = await orderResponse.text();
      console.error("[paypal/create-order] error", text);
      return sendJson(res, 500, { error: "Could not create PayPal order" });
    }

    const order = await orderResponse.json();
    return sendJson(res, 200, { id: order.id });
  } catch (error) {
    console.error("[paypal/create-order]", error);
    return sendJson(res, 500, { error: "Internal server error" });
  }
}

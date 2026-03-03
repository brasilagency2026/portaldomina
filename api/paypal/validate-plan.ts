import type { VercelRequest, VercelResponse } from "@vercel/node";

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

function getPayPalBaseCandidates() {
  const preferred = getPayPalBaseUrl();
  const all = ["https://api-m.sandbox.paypal.com", "https://api-m.paypal.com"];
  return [preferred, ...all.filter((url) => url !== preferred)];
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET missing");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const candidates = getPayPalBaseCandidates();
  let lastError = "";

  for (const baseUrl of candidates) {
    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      lastError = await response.text();
      continue;
    }

    const data = await response.json();
    return { accessToken: data.access_token as string, baseUrl };
  }

  throw new Error(`PayPal oauth failed on all environments: ${lastError}`);
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const planId = process.env.VITE_PAYPAL_PREMIUM_PLAN_ID || process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID;

    if (!planId) {
      return sendJson(res, 200, {
        valid: false,
        message: "PAYPAL plan id ausente no ambiente",
      });
    }

    const { accessToken, baseUrl } = await getPayPalAccessToken();

    const response = await fetch(`${baseUrl}/v1/billing/plans/${encodeURIComponent(planId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return sendJson(res, 200, {
        valid: false,
        message: data?.message || "Plano PayPal inválido para este ambiente (sandbox/live)",
      });
    }

    return sendJson(res, 200, {
      valid: true,
      planId: data?.id || planId,
      status: data?.status || null,
      productId: data?.product_id || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return sendJson(res, 200, {
      valid: false,
      message,
    });
  }
}

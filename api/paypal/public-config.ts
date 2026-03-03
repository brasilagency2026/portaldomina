import type { VercelRequest, VercelResponse } from "@vercel/node";

function sendJson(res: VercelResponse, status: number, payload: unknown) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).send(payload);
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const clientId =
    process.env.PAYPAL_PUBLIC_CLIENT_ID ||
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    process.env.VITE_PAYPAL_CLIENT_ID ||
    process.env.PAYPAL_CLIENT_ID;
  const premiumPlanId =
    process.env.PAYPAL_PREMIUM_PLAN_ID ||
    process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID ||
    process.env.VITE_PAYPAL_PREMIUM_PLAN_ID;

  return sendJson(res, 200, {
    clientId: clientId?.trim() || null,
    premiumPlanId: premiumPlanId?.trim() || null,
  });
}

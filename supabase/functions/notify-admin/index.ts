import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_EMAIL = "portaldomina@bdsmbrazil.com.br";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { type, perfil } = body;

    console.log("[notify-admin] Received notification:", { type, perfilId: perfil?.id });

    if (!type || !perfil) {
      return new Response(JSON.stringify({ error: "Missing type or perfil" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isNew = type === "new_registration";
    const subject = isNew
      ? `🆕 Nova inscrição: ${perfil.nome}`
      : `✏️ Perfil modificado: ${perfil.nome}`;

    const htmlBody = isNew
      ? `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; padding: 32px; border-radius: 12px;">
          <h1 style="color: #ff0000; margin-bottom: 8px;">🆕 Nova Inscrição</h1>
          <p style="color: #aaa; margin-bottom: 24px;">Uma nova profissional se cadastrou e aguarda aprovação.</p>
          
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #aaa; width: 120px;">Nome:</td><td style="padding: 8px 0; font-weight: bold;">${perfil.nome || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #aaa;">Email:</td><td style="padding: 8px 0;">${perfil.email || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #aaa;">Localização:</td><td style="padding: 8px 0;">${perfil.localizacao || "Não informada"}</td></tr>
              <tr><td style="padding: 8px 0; color: #aaa;">Telefone:</td><td style="padding: 8px 0;">${perfil.telefone || "Não informado"}</td></tr>
              <tr><td style="padding: 8px 0; color: #aaa;">Status:</td><td style="padding: 8px 0;"><span style="background: #f59e0b22; color: #f59e0b; padding: 2px 8px; border-radius: 4px;">Pendente</span></td></tr>
            </table>
          </div>

          <a href="https://dominas.bdsmbrazil.com.br/admin" 
             style="display: inline-block; background: linear-gradient(135deg, #ff0000, #cc0000); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            ✅ Aprovar no Painel Admin
          </a>
          
          <p style="color: #555; font-size: 12px; margin-top: 24px;">BDSMBRAZIL — Sistema de notificações automáticas</p>
        </div>
      `
      : `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; padding: 32px; border-radius: 12px;">
          <h1 style="color: #ff0000; margin-bottom: 8px;">✏️ Perfil Modificado</h1>
          <p style="color: #aaa; margin-bottom: 24px;">Uma profissional atualizou seu perfil.</p>
          
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #aaa; width: 120px;">Nome:</td><td style="padding: 8px 0; font-weight: bold;">${perfil.nome || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #aaa;">Email:</td><td style="padding: 8px 0;">${perfil.email || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #aaa;">Localização:</td><td style="padding: 8px 0;">${perfil.localizacao || "Não informada"}</td></tr>
              <tr><td style="padding: 8px 0; color: #aaa;">Bio:</td><td style="padding: 8px 0;">${perfil.bio ? perfil.bio.slice(0, 100) + "..." : "Não informada"}</td></tr>
              <tr><td style="padding: 8px 0; color: #aaa;">Serviços:</td><td style="padding: 8px 0;">${Array.isArray(perfil.servicos) ? perfil.servicos.join(", ") : "—"}</td></tr>
            </table>
          </div>

          <a href="https://dominas.bdsmbrazil.com.br/admin" 
             style="display: inline-block; background: linear-gradient(135deg, #ff0000, #cc0000); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            👁️ Voir no Painel Admin
          </a>
          
          <p style="color: #555; font-size: 12px; margin-top: 24px;">BDSMBRAZIL — Sistema de notificações automáticas</p>
        </div>
      `;

    if (!RESEND_API_KEY) {
      console.warn("[notify-admin] RESEND_API_KEY not set. Email not sent.");
      return new Response(JSON.stringify({ success: true, warning: "RESEND_API_KEY not configured" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BDSMBRAZIL <noreply@bdsmbrazil.com.br>",
        to: [ADMIN_EMAIL],
        subject,
        html: htmlBody,
      }),
    });

    const emailData = await emailRes.json();
    console.log("[notify-admin] Email sent:", emailData);

    return new Response(JSON.stringify({ success: true, email: emailData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error("[notify-admin] Error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
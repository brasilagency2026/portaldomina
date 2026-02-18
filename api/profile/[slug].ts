import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = "https://bmivfqpopjgozwjoustr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaXZmcXBvcGpnb3p3am91c3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzIyMjgsImV4cCI6MjA4Njg0ODIyOH0.ffHzUWP7Ns85BIY8lqcWk4QaJHujVpQAz2mbXS7w_Ec";
const SITE_URL = "https://bdsmbrazil.com.br";

const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'WhatsApp',
  'TelegramBot',
  'LinkedInBot',
  'Slackbot',
  'Discord',
  'Pinterest',
  'Googlebot',
];

function isBot(userAgent: string): boolean {
  return BOT_USER_AGENTS.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
}

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

async function fetchProfile(identifier: string) {
  // Cherche par UUID ou par slug
  const field = isUUID(identifier) ? 'id' : 'slug';
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/perfis?${field}=eq.${encodeURIComponent(identifier)}&select=nome,bio,fotos,foto_url,localizacao,slug,status&limit=1`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  const data = await res.json();
  return data?.[0] || null;
}

function buildHtml(profile: any, identifier: string): string {
  const name = profile?.nome || "Profissional BDSMBRAZIL";
  const bio = profile?.bio
    ? profile.bio.slice(0, 200) + (profile.bio.length > 200 ? "..." : "")
    : "Profissional verificada no maior portal BDSM do Brasil.";

  // Pega a primeira foto válida
  let image = `${SITE_URL}/og-default.jpg`;
  if (Array.isArray(profile?.fotos) && profile.fotos.length > 0) {
    const validFoto = profile.fotos.find((f: string) => f && f.startsWith('http'));
    if (validFoto) image = validFoto;
  } else if (profile?.foto_url && profile.foto_url.startsWith('http')) {
    image = profile.foto_url;
  }

  const slug = profile?.slug || identifier;
  const url = `${SITE_URL}/profile/${slug}`;
  const title = `${name} | BDSMBRAZIL`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(bio)}" />

  <!-- Open Graph -->
  <meta property="og:type" content="profile" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(bio)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:site_name" content="BDSMBRAZIL" />
  <meta property="og:locale" content="pt_BR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(bio)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />

  <!-- Redirect humains vers la SPA -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(url)}" />
  <script>window.location.href = "${escapeHtml(url)}";</script>
</head>
<body>
  <p>Redirecionando para <a href="${escapeHtml(url)}">${escapeHtml(name)}</a>...</p>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;
  const userAgent = req.headers['user-agent'] || '';

  if (!slug || typeof slug !== 'string') {
    return res.status(400).send('Invalid slug');
  }

  // Si c'est un bot social → on sert le HTML avec les meta OG
  if (isBot(userAgent)) {
    try {
      const profile = await fetchProfile(slug);
      const html = buildHtml(profile, slug);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).send(html);
    } catch (err) {
      console.error('[og-profile] Error fetching profile:', err);
      return res.status(500).send('Error');
    }
  }

  // Si c'est un humain → redirect vers la SPA React
  res.setHeader('Location', `/profile/${slug}`);
  return res.status(302).send('Redirecting...');
}
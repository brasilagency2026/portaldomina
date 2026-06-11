import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = "https://bmivfqpopjgozwjoustr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaXZmcXBvcGpnb3p3am91c3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNzIyMjgsImV4cCI6MjA4Njg0ODIyOH0.ffHzUWP7Ns85BIY8lqcWk4QaJHujVpQAz2mbXS7w_Ec";
const SITE_URL = "https://dominas.bdsmbrazil.com.br";

const STATIC_ROUTES = [
  "",
  "/explorar",
  "/premium",
  "/sobre",
  "/contato",
  "/faq",
  "/perfis",
  "/login",
  "/register",
  "/dashboard",
  "/admin",
  "/para-profissionais",
  "/como-funciona"
];

async function fetchAllProfiles() {
  let allProfiles: any[] = [];
  let page = 0;
  const limit = 1000;
  
  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/perfis?select=slug,updated_at&limit=${limit}&offset=${page * limit}`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      allProfiles = allProfiles.concat(data);
      if (data.length < limit) break;
      page++;
    } else {
      break;
    }
  }
  return allProfiles;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const profiles = await fetchAllProfiles();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static routes
    for (const route of STATIC_ROUTES) {
      sitemap += `\n  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${route === "" ? "1.0" : "0.8"}</priority>\n  </url>`;
    }

    // Add dynamic profile routes
    for (const profile of profiles) {
      if (profile.slug) {
        const lastMod = profile.updated_at ? `\n    <lastmod>${new Date(profile.updated_at).toISOString()}</lastmod>` : '';
        sitemap += `\n  <url>\n    <loc>${SITE_URL}/profile/${encodeURIComponent(profile.slug)}</loc>${lastMod}\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`;
      }
    }

    sitemap += `\n</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(sitemap);
  } catch (err) {
    console.error('[sitemap] Error:', err);
    return res.status(500).send('Error generating sitemap');
  }
}

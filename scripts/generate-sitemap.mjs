/**
 * Regenerates public/sitemap.xml at build time so <lastmod> never goes stale.
 * Run automatically as part of `npm run build`.
 */
import { writeFileSync } from "node:fs";

const SITE_URL = process.env.SITE_URL ?? "https://melala.netlify.app";
const today = new Date().toISOString().slice(0, 10);

const pages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/cafe", changefreq: "weekly", priority: "0.9" },
  { path: "/restaurant", changefreq: "weekly", priority: "0.9" },
  { path: "/payment", changefreq: "monthly", priority: "0.7" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`sitemap.xml regenerated (lastmod ${today})`);

import fs from "fs";

async function generate() {
  const res = await fetch("https://ai-central-store.vercel.app/ai");
  const data = await res.json();

  const urls = data.map(ai => {
    const slug = ai.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    return `
  <url>
    <loc>https://www.aicentralstore.com/ai/${slug}</loc>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.aicentralstore.com/</loc>
  </url>
  ${urls.join("")}
</urlset>`;

  fs.writeFileSync("./public/sitemap.xml", sitemap);

  console.log("✅ sitemap generated");
}

generate();
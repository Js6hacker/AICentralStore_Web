import fs from "fs";

const BASE_URL = "https://www.aicentralstore.com";

function buildUrl(loc, priority = "0.8") {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generate() {
  // AI TOOLS
  const res = await fetch(
    "https://ai-central-store.vercel.app/ai"
  );

  const aiData = await res.json();

  const aiUrls = aiData.map((ai) => {
    const slug = ai.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    return buildUrl(
      `${BASE_URL}/ai/${slug}`,
      "0.8"
    );
  });

  // BLOGS
  let blogUrls = [];

  try {
    const blogs = JSON.parse(
      fs.readFileSync(
        "./public/blogs.json",
        "utf-8"
      )
    );

    blogUrls = blogs.map((blog) =>
      buildUrl(
        `${BASE_URL}/blog/${blog.slug}`,
        "0.7"
      )
    );
  } catch {
    console.log(
      "⚠️ blogs.json not found or invalid"
    );
  }

  // STATIC PAGES
  const staticUrls = [
    buildUrl(`${BASE_URL}/`, "1.0"),

    buildUrl(`${BASE_URL}/about`, "0.7"),

    buildUrl(
      `${BASE_URL}/privacy-policy`,
      "0.5"
    ),

    buildUrl(
      `${BASE_URL}/terms`,
      "0.5"
    ),

    buildUrl(
      `${BASE_URL}/contact`,
      "0.6"
    )
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${[
  ...staticUrls,
  ...aiUrls,
  ...blogUrls,
  buildUrl("https://mixifia.aicentralstore.com", "0.9")
].join("")}

</urlset>`;

  fs.writeFileSync(
    "./public/sitemap.xml",
    sitemap
  );

  console.log(
    "✅ sitemap generated (AI + Blogs + Static Pages)"
  );
}

generate();
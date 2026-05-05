import fs from "fs";

async function generate() {
  const BASE_URL = "https://www.aicentralstore.com";

  // 🔥 Fetch AI tools (existing)
  const res = await fetch("https://ai-central-store.vercel.app/ai");
  const aiData = await res.json();

  const aiUrls = aiData.map((ai) => {
    const slug = ai.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    return `
  <url>
    <loc>${BASE_URL}/ai/${slug}</loc>
  </url>`;
  });

  // 🔥 Load BLOGS (NEW)
  let blogUrls = [];
  try {
    const blogs = JSON.parse(
      fs.readFileSync("./public/blogs.json", "utf-8")
    );

    blogUrls = blogs.map((blog) => `
  <url>
    <loc>${BASE_URL}/blog/${blog.slug}</loc>
  </url>`);
  } catch (err) {
    console.log("⚠️ blogs.json not found or invalid");
  }

  // 🔥 Combine everything
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${BASE_URL}/</loc>
  </url>

  <url>
    <loc>${BASE_URL}/blog</loc>
  </url>

  ${aiUrls.join("")}
  ${blogUrls.join("")}

</urlset>`;

  // 🔥 Write file
  fs.writeFileSync("./public/sitemap.xml", sitemap);

  console.log("✅ sitemap generated (AI + Blogs)");
}

generate();

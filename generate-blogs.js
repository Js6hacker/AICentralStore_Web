import fs from "fs";
import "dotenv/config";

const API_KEY = process.env.GEMINI_API_KEY;

// ✅ Use supported model
const MODEL = "gemini-2.0-flash";

const topics = [
  "Best AI Tools for Students",
  "ChatGPT vs Gemini",
  "Free AI Tools in 2026",
  "AI Tools for Developers",
  "AI Tools for Business",
  "Best AI Tools in 2026",
  "Free AI Tools You Should Try Today",
  "Top AI Tools for Beginners",
  "AI Tools That Save You Hours Daily",
  "Must-Have AI Tools for Productivity",
  "AI Tools for Homework & Assignments",
  "How Students Use AI to Study Faster",
  "Free AI Tools for College Students",
  "AI Tools for Exam Preparation",
  "ChatGPT vs Copilot vs Gemini",
  "AI Coding Assistants Compared",
  "How AI Helps in Debugging",
  "Free AI Tools for Programmers",
  "Best AI Writing Tools",
  "ChatGPT vs Jasper vs Copy.ai",
  "AI Tools for Blogging",
  "AI Tools for SEO Content",
  "Free AI Writing Tools",
  "Best AI Image Generators",
  "Midjourney vs DALL·E vs Stable Diffusion",
  "AI Tools for Graphic Design",
  "Free AI Art Generators",
  "AI Logo Generators",
  "AI Tools for Small Businesses",
  "AI for Marketing Automation",
  "AI Tools for Startups",
  "AI Tools to Grow Your Business",
  "Best AI Tools for Entrepreneurs",
  "AI Tools for YouTube Creators",
  "AI Video Generators",
  "AI Tools for Instagram Growth",
  "AI Content Creation Tools",
  "AI Tools for TikTok",
  "ChatGPT vs Claude",
  "Jasper vs Copy.ai",
  "Notion AI vs ChatGPT",
  "Grammarly vs Quillbot",
  "ChatGPT Alternatives",
  "Best Free ChatGPT Alternatives",
  "AI Tools Everyone Is Talking About",
  "New AI Tools in 2026",
  "Top Trending AI Apps",
  "How to Make Money with AI",
  "AI Side Hustles in 2026",
  "Freelancing with AI Tools",
  "Passive Income Using AI",
  "AI Tools for Online Business"
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

async function generateBlog(topic) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Write a highly SEO-optimized blog about "${topic}".
Include:
- Click-worthy title
- Meta description
- Structured headings
- Internal linking suggestions
- FAQs with answers
`
                }
              ]
            }
          ]
        })
      }
    );

    if (!res.ok) {
      console.log("❌ API ERROR:", await res.text());
      return null;
    }

    const json = await res.json();

    const content =
      json?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.log("❌ Failed:", topic, json);
      return null;
    }

    return {
      slug: slugify(topic),
      title: `${topic} (2026 Guide)`,
      description: `Complete guide about ${topic}`,
      content
    };

  } catch (err) {
    console.log("❌ Exception:", err.message);
    return null;
  }
}

async function main() {
  if (!API_KEY) {
    console.log("❌ Missing GEMINI_API_KEY");
    return;
  }

  const blogs = [];

  for (const topic of topics) {
    console.log("Generating:", topic);

    const blog = await generateBlog(topic);

    if (blog) {
      blogs.push(blog);
      console.log("✅ Saved:", topic);
    }

    // rate limit safe
    await new Promise((r) => setTimeout(r, 1000));
  }

  fs.writeFileSync(
    "./src/data/blogs.json",
    JSON.stringify(blogs, null, 2)
  );

  console.log("🎉 Blogs generated successfully!");
}

main();
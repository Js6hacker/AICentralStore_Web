import fs from "fs";


const blogs = JSON.parse(fs.readFileSync("./public/blogs.json"));

async function generateImage(blog) {
  const prompt = encodeURIComponent(
    `${blog.title}, modern AI illustration, futuristic, dark background`
  );

  const url = `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=600`;

  const res = await fetch(url);
  const buffer = await res.arrayBuffer();

  fs.writeFileSync(
    `./public/blog-images/${blog.slug}.jpg`,
    Buffer.from(buffer)
  );

  console.log("Saved:", blog.slug);
}

async function main() {
  for (const blog of blogs) {
    await generateImage(blog);
  }
}

main();
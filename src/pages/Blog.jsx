import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent
} from "@mui/material";
import { Helmet } from "react-helmet-async";

export default function Blog() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState(undefined);
  const [visibleCount, setVisibleCount] = useState(3);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
  if (!search.trim()) {
    setResults([]);
    return;
  }

  const filtered = blogs.filter((b) =>
    (b.title + " " + b.description)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  setResults(filtered.slice(0, 6)); // limit suggestions
}, [search, blogs]);

  //  Fetch blogs
  useEffect(() => {
    fetch("/blogs.json")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        const found = data.find((b) => b.slug === slug);
        setBlog(found || false);
      })
      .catch(() => setBlog(false));
  }, [slug]);

  //  Redirect if not found
  useEffect(() => {
    if (blog === false) navigate("/", { replace: true });
  }, [blog, navigate]);

  //  Infinite scroll
  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setVisibleCount((prev) => prev + 2);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //  Extract headings
  const headings = useMemo(() => {
    if (!blog) return [];
    return blog.content
      .split("\n")
      .filter((l) => l.startsWith("## "))
      .map((l) => l.replace("## ", ""));
  }, [blog]);

  // Related blogs
  const related = useMemo(() => {
    return blogs.filter((b) => b.slug !== slug).slice(0, 3);
  }, [blogs, slug]);

  //  AI internal links
  const aiLinks = {
    ChatGPT: "/ai/chatgpt",
    Gemini: "/ai/gemini",
    Claude: "/ai/claude",
    Midjourney: "/ai/midjourney"
  };

  function linkify(text) {
    let result = text;
    Object.keys(aiLinks).forEach((tool) => {
      const regex = new RegExp(`\\b${tool}\\b`, "g");
      result = result.replace(
        regex,
        `<a href="${aiLinks[tool]}" style="color:#818cf8;text-decoration:none;font-weight:500">${tool}</a>`
      );
    });
    return result;
  }

  //  Extract FAQs
  function extractFAQs(content) {
    const lines = content.split("\n");
    const faqs = [];
    let q = null;

    lines.forEach((line) => {
      if (line.includes("?")) q = line;
      else if (q && line.trim()) {
        faqs.push({
          "@type": "Question",
          name: q,
          acceptedAnswer: {
            "@type": "Answer",
            text: line
          }
        });
        q = null;
      }
    });

    return faqs.slice(0, 5);
  }

  if (blog === undefined) return null;

  return (
    <Container maxWidth="lg" sx={{ pt: 10, pb: 6 }}>
      <Helmet>
        <title>{blog.title}</title>
        <meta name="description" content={blog.description} />
        <meta property="og:image" content={`/blog-images/${blog.slug}.jpg`} />


        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: extractFAQs(blog.content)
          })}
        </script>

        

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
              {
                "@type": "ListItem",
                position: 3,
                name: blog.title,
                item: `/blog/${slug}`
              }
            ]
          })}
        </script>
      </Helmet>

      <Grid container spacing={4} maxWidth="lg"
          sx={{
            overflowX: "hidden"   
          }}>
        {/* MAIN */}
        <Grid item xs={12} md={8}>
          {/* Breadcrumb */}
          <Box sx={{ mb: 2, color: "#aaa" }}>
            Home {" > "} Blog {" > "} {blog.title}
          </Box>

          {/* HERO IMAGE */}
          <Box sx={{ height: 280, mb: 4, borderRadius: 4, overflow: "hidden", aspectRatio: "16 / 9",background: "#111"}}>
            <img
              src={`/blog-images/${blog.slug}.jpg`}
              alt={blog.title}
              onError={(e) => {
                e.target.src = "/blog-images/default.jpg";
              }}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block"
              }}
            />
          </Box>

          {/* Title */}
          <Typography variant="h3" fontWeight="bold" mb={2}>
            {blog.title}
          </Typography>

          <Typography color="#aaa" mb={2}>
            {blog.description}
          </Typography>

          <Typography sx={{ mb: 3, color: "#777" }}>
            🕒 {Math.ceil(blog.content.split(" ").length / 200)} min read
          </Typography>

          {/* CONTENT */}
          <Box sx={{ fontSize: 18, lineHeight: 1.9 }}>
            {blog.content
              .replace(/\*\*/g, "")
              .split("\n")
              .map((line, i) => {
                const clean = line.toLowerCase();

                //  Remove bad generated text
                if (clean.includes("meta description")) return null;
                if (clean.includes("internal linking")) return null;
                if (clean.includes("link \"")) return null;

                if (line.startsWith("# ")) return null;

                if (line.startsWith("## ")) {
                  const text = line.replace("## ", "");
                  const id = text.toLowerCase().replace(/\s+/g, "-");

                  return (
                    <h2
                      key={i}
                      id={id}
                      style={{
                        marginTop: "40px",
                        borderLeft: "4px solid #6366f1",
                        paddingLeft: "10px"
                      }}
                    >
                      {text}
                    </h2>
                  );
                }

                if (line.startsWith("### "))
                  return <h3 key={i}>{line.replace("### ", "")}</h3>;

                if (line.startsWith("- "))
                  return <li key={i}>{line.replace("- ", "")}</li>;

                // FAQ styling
                if (line.startsWith("Q:")) {
                  return (
                    <Box key={i} sx={{ mt: 3 }}>
                      <Typography fontWeight="bold" color="#818cf8">
                        {line}
                      </Typography>
                    </Box>
                  );
                }

                if (line.startsWith("A:")) {
                  return (
                    <Typography key={i} sx={{ mb: 2, color: "#ccc" }}>
                      {line}
                    </Typography>
                  );
                }

                return (
                  <p
                    key={i}
                    dangerouslySetInnerHTML={{ __html: linkify(line) }}
                  />
                );
              })}
          </Box>

          {/* RELATED BLOGS */}
          <Box mt={6} sx={{ pt: 6,pb: 3, borderTop: "1px solid #333" }}>
            <Typography variant="h5" mb={4} sx={{pb:2}}>
              Related Blogs
            </Typography>

            <Grid container spacing={2}>
              {related.map((b) => (
                <Grid item xs={12} sm={4} key={b.slug}>
                  <Card
                    onClick={() => navigate(`/blog/${b.slug}`)}
                    sx={{ cursor: "pointer",borderRadius: 3, background: "rgba(255,255,255,0.05)" }}
                  >
                    <CardContent>
                      <Typography fontWeight="bold">{b.title}</Typography>
                      <Typography color="gray">{b.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* INFINITE BLOGS */}
          <Box mt={8} sx={{ pt: 5, borderTop: "1px solid #333" }}>
            <Typography variant="h5" mb={4} sx={{pb:2}}>
              More Blogs
            </Typography>

            {blogs
              .filter((b) => b.slug !== slug)
              .slice(0, visibleCount)
              .map((b) => (
                <Box
                  key={b.slug}
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.05)",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(`/blog/${b.slug}`)}
                >
                  <Typography fontWeight="bold">{b.title}</Typography>
                  <Typography color="gray">{b.description}</Typography>
                </Box>
              ))}
          </Box>
        </Grid>

        {/* TOC */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: "sticky", top: 100 }}>
            <Typography fontWeight="bold" mb={2}>
              Contents
            </Typography>

            {headings.map((h, i) => (
              <Typography
                key={i}
                sx={{ cursor: "pointer", color: "#aaa" }}
                onClick={() => {
                  const id = h.toLowerCase().replace(/\s+/g, "-");
                  document.getElementById(id)?.scrollIntoView({
                    behavior: "smooth"
                  });
                }}
              >
                {h}
              </Typography>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
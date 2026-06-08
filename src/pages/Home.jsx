import { useEffect, useState } from "react";
import { getAI } from "../services/api";
import AICard from "../components/AICard";
import SkeletonCard from "../components/SkeletonCard";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Grid
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/blogs.json")
      .then((res) => res.json())
      .then(setBlogs)
      .catch(() => setBlogs([]));
  }, []);

  useEffect(() => {
    getAI()
      .then((res) => setData(res || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(data.map((a) => a.category))];

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, pb: 8, pt: 4 }}>
      
      {/* HERO */}
      <Box
        sx={{
          borderRadius: 6,
          mb: 6,
          mt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          py: { xs: 6, md: 8 },
          px: 4,
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.06) 50%, rgba(9, 9, 14, 0) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Chip
          label="The Ultimate AI Directory of 2026"
          color="primary"
          variant="outlined"
          sx={{
            mb: 3,
            fontWeight: 600,
            letterSpacing: "0.5px",
            borderColor: "rgba(99, 102, 241, 0.3)",
            color: "primary.light",
            fontFamily: "'Outfit', sans-serif"
          }}
        />
        <Typography
          variant="h2"
          fontWeight="800"
          sx={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: { xs: "2.3rem", md: "3.8rem" },
            letterSpacing: "-1.5px",
            lineHeight: 1.15,
            mb: 2,
            background: "linear-gradient(90deg, #fff 40%, #c7d2fe 70%, #818cf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          Discover the Next Gen <br /> of AI Tools 🚀
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            maxWidth: 600,
            mb: 4,
            fontWeight: 400,
            fontSize: "1.05rem"
          }}
        >
          Explore, filter, and compare the best artificial intelligence tools to 10x your productivity.
        </Typography>

        {/* STATS BADGES */}
        <Box
          sx={{
            display: "flex",
            gap: 5,
            flexWrap: "wrap",
            justifyContent: "center",
            mt: 2
          }}
        >
          {[
            { label: "AI Tools Index", val: "500+" },
            { label: "Categories", val: "90+" },
            { label: "Updated", val: "Daily" }
          ].map((stat) => (
            <Box key={stat.label} sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight="800" color="primary.light" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {stat.val}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* SEARCH */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(12px)",
          borderRadius: 4,
          px: 3,
          height: 60,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": { borderColor: "rgba(99, 102, 241, 0.4)" },
          "&:focus-within": {
            borderColor: "#6366f1",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)"
          }
        }}
      >
        <SearchIcon sx={{ color: "text.secondary" }} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for tools by name, description or category..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            width: "100%",
            fontSize: "16px",
            fontFamily: "Inter, sans-serif"
          }}
        />

        {search && (
          <IconButton onClick={() => setSearch("")}>
            <ClearIcon sx={{ color: "text.secondary" }} />
          </IconButton>
        )}
      </Box>

      {/* CATEGORY CHIPS */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          overflowX: "auto",
          pb: 2,
          mb: 5,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" }
        }}
      >
        <Chip
          label="All Categories"
          onClick={() => setSelectedCategory("")}
          sx={{
            fontWeight: 600,
            fontSize: "13px",
            px: 1.5,
            py: 2.2,
            borderRadius: 3,
            backgroundColor: selectedCategory === "" ? "primary.main" : "rgba(255, 255, 255, 0.04)",
            border: "1px solid",
            borderColor: selectedCategory === "" ? "primary.main" : "rgba(255, 255, 255, 0.08)",
            color: selectedCategory === "" ? "#fff" : "text.secondary",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: selectedCategory === "" ? "primary.dark" : "rgba(255, 255, 255, 0.08)",
              borderColor: selectedCategory === "" ? "primary.dark" : "rgba(255, 255, 255, 0.15)"
            }
          }}
        />
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setSelectedCategory(cat)}
              sx={{
                fontWeight: 600,
                fontSize: "13px",
                px: 1.5,
                py: 2.2,
                borderRadius: 3,
                backgroundColor: isSelected ? "primary.main" : "rgba(255, 255, 255, 0.04)",
                border: "1px solid",
                borderColor: isSelected ? "primary.main" : "rgba(255, 255, 255, 0.08)",
                color: isSelected ? "#fff" : "text.secondary",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: isSelected ? "primary.dark" : "rgba(255, 255, 255, 0.08)",
                  borderColor: isSelected ? "primary.dark" : "rgba(255, 255, 255, 0.15)"
                }
              }}
            />
          );
        })}
      </Box>

      {/* LOADING */}
      {loading && (
        <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 2 }}>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Box>
      )}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <Typography color="gray" sx={{ my: 4, textAlign: "center" }}>
          No AI tools found
        </Typography>
      )}

      {/* AI TOOLS CONTAINER */}
      {!loading && (
        <Box sx={{ minHeight: "200px" }}>
          {selectedCategory === "" ? (
            // Grouped Rows View
            categories.map((cat) => {
              const items = data.filter(
                (a) =>
                  a.category === cat &&
                  (a.name.toLowerCase().includes(search.toLowerCase()) ||
                    a.description.toLowerCase().includes(search.toLowerCase()))
              );

              if (!items.length) return null;

              return (
                <Box key={cat} sx={{ mb: 6 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 2.5 }}>
                    <Typography variant="h5" fontWeight="750" sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.5px" }}>
                      {cat}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary.light"
                      sx={{ cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      View All ({items.length})
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2.5,
                      overflowX: "auto",
                      overflowY: "hidden",
                      py: 1.5,
                      px: 0.5,
                      scrollBehavior: "smooth",
                      "&::-webkit-scrollbar": { display: "none" }
                    }}
                  >
                    {items.map((ai, i) => (
                      <Box key={ai.id || i} sx={{ minWidth: { xs: 280, md: 320 } }}>
                        <AICard ai={ai} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            })
          ) : (
            // Single Category Grid View
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{ fontFamily: "Outfit, sans-serif" }}>
                  {selectedCategory}
                </Typography>
                <Chip
                  label="Clear Filter"
                  onDelete={() => setSelectedCategory("")}
                  onClick={() => setSelectedCategory("")}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Grid container spacing={3}>
                {data
                  .filter(
                    (a) =>
                      a.category === selectedCategory &&
                      (a.name.toLowerCase().includes(search.toLowerCase()) ||
                        a.description.toLowerCase().includes(search.toLowerCase()))
                  )
                  .map((ai, i) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={ai.id || i}>
                      <AICard ai={ai} />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {/* BLOG SECTION (SEO BOOST) */}
      <Box sx={{ mt: 8 }}>
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.06)", pt: 6, mb: 4 }}>
          <Typography variant="h4" fontWeight="800" sx={{ fontFamily: "'Outfit', sans-serif" }}>
            AI Guides & Blogs 📝
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Read detailed guides, walk-throughs and tutorials to master artificial intelligence.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 3
          }}
        >
          {blogs.slice(0, 8).map((blog) => (
            <Box
              key={blog.slug}
              onClick={() => navigate(`/blog/${blog.slug}`)}
              sx={{
                p: 3.5,
                borderRadius: 4,
                background: "rgba(255,255,255,0.01)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                border: "1px solid rgba(255,255,255,0.05)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: "rgba(99, 102, 241, 0.4)",
                  background: "rgba(99, 102, 241, 0.02)",
                  boxShadow: "0 10px 30px rgba(99, 102, 241, 0.05)"
                }
              }}
            >
              <Typography fontWeight="800" variant="h6" mb={1.5} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                {blog.title}
              </Typography>

              <Typography color="text.secondary" fontSize={14} sx={{ lineHeight: 1.6 }}>
                {blog.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
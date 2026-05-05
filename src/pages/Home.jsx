import { useEffect, useState } from "react";
import { getAI } from "../services/api";
import AICard from "../components/AICard";
import SkeletonCard from "../components/SkeletonCard";
import {
  Box,
  Typography,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const [blogs, setBlogs] = useState([]);

useEffect(() => {
  fetch("/blogs.json")
    .then((res) => res.json())
    .then(setBlogs)
    .catch(() => setBlogs([]));
}, []);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getAI()
      .then((res) => setData(res || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(data.map((a) => a.category))];

  return (
    <Box sx={{ px: 3, pb: 5 }}>
      
      {/* HERO */}
      <Box
        sx={{
          height: 250,
          borderRadius: 4,
          mb: 3,
          mt: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: 4,
          background: "linear-gradient(135deg, #6366f1, #0f172a)",
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Discover AI Tools 🚀
        </Typography>
        <Typography color="gray">
          Explore the best AI tools in one place
        </Typography>
      </Box>

      {/* SEARCH */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap:2,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 3,
          px: 2,
          height: 55,
          border: "1px solid rgba(255,255,255,0.15)",
          transition: "0.3s",
          "&:hover": { borderColor: "#6366f1" },
          "&:focus-within": {
            borderColor: "#6366f1",
            boxShadow: "0 0 10px rgba(99,102,241,0.5)"
          }
        }}
      >
        <SearchIcon sx={{ color: "#aaa", mr: 1 }} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search AI tools..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            width: "100%",
            fontSize: "16px"
          }}
        />

        {search && (
          <IconButton onClick={() => setSearch("")}>
            <ClearIcon sx={{ color: "#aaa" }} />
          </IconButton>
        )}
      </Box>

      {/* LOADING */}
      {loading && (
        <Box sx={{ display: "flex", gap: 2 }}>
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Box>
      )}

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <Typography color="gray">
          No AI tools found
        </Typography>
      )}

      {/* AI CATEGORIES */}
      {!loading &&
        categories.map((cat) => {
          const items = data.filter(
            (a) =>
              a.category === cat &&
              a.name.toLowerCase().includes(search.toLowerCase())
          );

          if (!items.length) return null;

          return (
            <Box key={cat} sx={{ mb: 5 }}>
              <Typography variant="h5" fontWeight="bold" mb={2}>
                {cat}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  overflowY: "hidden",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": { display: "none" }
                }}
              >
                {items.map((ai, i) => (
                  <Box key={i} sx={{ minWidth: 260 }}>
                    <AICard ai={ai} />
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}

      {/*  BLOG SECTION (SEO BOOST) */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          AI Guides & Blogs
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 2
          }}
        >
          {blogs.slice(0, 8).map((blog) => (
            <Box
              key={blog.slug}
              onClick={() => navigate(`/blog/${blog.slug}`)}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(255,255,255,0.05)",
                cursor: "pointer",
                transition: "0.3s",
                border: "1px solid rgba(255,255,255,0.08)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: "#6366f1"
                }
              }}
            >
              <Typography fontWeight="bold" mb={1}>
                {blog.title}
              </Typography>

              <Typography color="gray" fontSize={14}>
                {blog.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
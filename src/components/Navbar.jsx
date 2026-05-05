import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAI } from "../services/api";
import SearchIcon from "@mui/icons-material/Search";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [tools, setTools] = useState([]);
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();

  // 🔥 Fetch data
  useEffect(() => {
    fetch("/blogs.json")
      .then((res) => res.json())
      .then(setBlogs)
      .catch(() => setBlogs([]));

    getAI().then(setTools).catch(() => setTools([]));
  }, []);

  // 🔥 Search logic
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const query = search.toLowerCase();

    const blogResults = blogs
      .filter((b) =>
        (b.title + " " + b.description).toLowerCase().includes(query)
      )
      .map((b) => ({
        type: "blog",
        title: b.title,
        description: b.description,
        slug: b.slug
      }));

    const toolResults = tools
      .filter((t) =>
        (t.name + " " + t.category).toLowerCase().includes(query)
      )
      .map((t) => ({
        type: "tool",
        title: t.name,
        description: t.category,
        slug: t.name
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .replace(/\s+/g, "-")
      }));

    setResults([...blogResults, ...toolResults].slice(0, 8));
  }, [search, blogs, tools]);

  // 🔥 Close dropdown on outside click
  useEffect(() => {
    const handleClick = () => setResults([]);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)"
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        
        {/* LOGO */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
          <img
            src="/icon.png"
            alt="logo"
            width="28"
            style={{ borderRadius: "6px" }}
          />
          <Typography fontWeight="bold">AICentralStore</Typography>
        </Box>

        {/* DESKTOP SEARCH */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "relative",
            width: 300,
            ml: "auto",
            minWidth: 0,
            transition: "0.3s",
          "&:hover": { borderColor: "#6366f1" },
          "&:focus-within": {
            borderColor: "#6366f1",
            boxShadow: "0 0 20px rgba(99,102,241,0.5)"
          }
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              outline: "none",
              fontSize: "13px"
            }}
          />

          {/* RESULTS */}
          {results.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "110%",
                left: 0,
                right: 0,
                background: "#111",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.1)",
                zIndex: 999,
                maxHeight: 300,          
                overflowY: "auto",       

                "&::-webkit-scrollbar": {
                  width: "6px"
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#444",
                  borderRadius: "10px"
                }
              }}
            >
              {results.map((r, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    "&:hover": { background: "rgba(255,255,255,0.05)" }
                  }}
                  onClick={() => {
                    if (r.type === "blog") navigate(`/blog/${r.slug}`);
                    else navigate(`/ai/${r.slug}`);
                    setSearch("");
                  }}
                >
                  <Typography fontWeight="bold" fontSize={13}>
                    {r.title}
                  </Typography>
                  <Typography fontSize={11} color="gray">
                    {r.type === "blog" ? "📝 Blog" : "🤖 AI Tool"} •{" "}
                    {r.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* MOBILE SEARCH ICON */}
        <Box sx={{ display: { xs: "block", md: "none" }, ml: "auto", }}>
          <IconButton onClick={() => setShowSearch(!showSearch)}>
            
            <SearchIcon sx={{ color: "#aaa", "&:hover": { color: "#fff" } }} />
          </IconButton>
        </Box>

        {/* MOBILE SEARCH PANEL */}
        {showSearch && (
          <Box
            sx={{
              position: "absolute",
              top: "64px",
              left: 0,
              width: "100%",
              p: 2,
              background: "#111",
              zIndex: 999
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #333",
                background: "#000",
                color: "white"
              }}
            />

            {/* MOBILE RESULTS */}
            {results.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  maxHeight: "60vh",     
                  overflowY: "auto",

                  "&::-webkit-scrollbar": {
                    width: "6px"
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#444"
                  }
                }}
>
                {results.map((r, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(255,255,255,0.05)"
                    }}
                    onClick={() => {
                      if (r.type === "blog") navigate(`/blog/${r.slug}`);
                      else navigate(`/ai/${r.slug}`);

                      setSearch("");
                      setShowSearch(false);
                    }}
                  >
                    <Typography fontWeight="bold" fontSize={13}>
                      {r.title}
                    </Typography>
                    <Typography fontSize={11} color="gray">
                      {r.type === "blog" ? "📝 Blog" : "🤖 AI Tool"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAI } from "../services/api";
import SearchIcon from "@mui/icons-material/Search";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [tools, setTools] = useState([]);
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  //  Fetch data
  useEffect(() => {
    fetch("/blogs.json")
      .then((res) => res.json())
      .then(setBlogs)
      .catch(() => setBlogs([]));

    getAI().then(setTools).catch(() => setTools([]));
  }, []);

  //  Search logic
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

  //  Close dropdown on outside click
  useEffect(() => {
    const handleClick = () => setResults([]);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(9, 9, 14, 0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "none"
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        
        {/* LOGO */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0, cursor: "pointer" }} onClick={() => navigate("/")}>
          <img
            src="/icon.png"
            alt="logo"
            width="32"
            height="32"
            style={{ borderRadius: "8px", boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)" }}
          />
          <Typography fontWeight="800" sx={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.15rem", letterSpacing: "-0.5px", background: "linear-gradient(90deg, #fff 30%, #a5b4fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AICentralStore
          </Typography>
        </Box>

        {/* DESKTOP NAV LINKS */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 4,
            ml: 2,
            mr: "auto"
          }}
        >
          {[
            { label: "Explore", path: "/" },
            { label: "Submit Tool", path: "/submit-ai" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" }
          ].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Typography
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif",
                  color: isActive ? "primary.light" : "text.secondary",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "primary.light"
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-4px",
                    left: 0,
                    width: isActive ? "100%" : "0%",
                    height: "2px",
                    backgroundColor: "primary.main",
                    transition: "width 0.2s ease"
                  },
                  "&:hover::after": {
                    width: "100%"
                  }
                }}
              >
                {item.label}
              </Typography>
            );
          })}
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
            placeholder="Search AI tools or guides..."
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "white",
              outline: "none",
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.3s ease"
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
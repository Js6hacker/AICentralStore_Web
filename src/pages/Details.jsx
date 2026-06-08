import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  IconButton,
  Skeleton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DevicesIcon from "@mui/icons-material/Devices";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Helmet } from "react-helmet-async";

import { getAI } from "../services/api";
import AICard from "../components/AICard";

export default function Details() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [ai, setAI] = useState(undefined);
  const [similar, setSimilar] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ai || ai === false) return;
    try {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setBookmarked(bookmarks.includes(ai.name));
    } catch {}
  }, [ai]);

  const toggleBookmark = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      let nextBookmarks;
      if (bookmarks.includes(ai.name)) {
        nextBookmarks = bookmarks.filter((b) => b !== ai.name);
        setBookmarked(false);
      } else {
        nextBookmarks = [...bookmarks, ai.name];
        setBookmarked(true);
      }
      localStorage.setItem("bookmarks", JSON.stringify(nextBookmarks));
    } catch {}
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const viewCount = (() => {
    try {
      if (!ai) return 0;
      const views = JSON.parse(localStorage.getItem("views") || "{}");
      return views[ai.name] || 0;
    } catch {
      return 0;
    }
  })();

  // SAFE DOMAIN
  const getDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  };

  // FETCH AI
  useEffect(() => {
    setAI(undefined);

    getAI().then((data) => {
      const found = data.find(
        (a) =>
          a.name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-") === slug
      );

      setAI(found || false);
    });
  }, [slug]);

  // REDIRECT IF NOT FOUND
  useEffect(() => {
    if (ai === false) {
      navigate("/", { replace: true });
    }
  }, [ai, navigate]);

  // SIMILAR TOOLS
  useEffect(() => {
    if (!ai || ai === false) return;

    getAI().then((data) => {
      const filtered = data
        .filter(
          (item) =>
            item.category === ai.category &&
            item.name !== ai.name
        )
        .slice(0, 4);

      setSimilar(filtered);
    });
  }, [ai]);

  // SCROLL TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // LOADING
  if (ai === undefined) {
    return (
      <Box sx={{ p: 5 }}>
        <Skeleton width={200} height={50} />
        <Skeleton height={200} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (ai === false) return null;

  return (
    <>
      <Helmet>
        <title>
          {ai.name} - Best {ai.category} AI Tool (2026)
        </title>

        <meta
          name="description"
          content={`${ai.name} is a powerful ${ai.category} AI tool for productivity, automation, and workflow improvement.`}
        />

        <meta property="og:title" content={ai.name} />

        <meta
          property="og:description"
          content={ai.description}
        />

        <meta
          property="og:image"
          content={`https://image.pollinations.ai/prompt/${ai.name} AI tool`}
        />
      </Helmet>

      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 12, md: 15 },
          pb: 10,
        }}
      >
        {/* BACK BUTTON */}
        <Button
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate("/", { replace: true });
            }
          }}
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 4,
            color: "text.primary",
            borderColor: "rgba(255, 255, 255, 0.08)",
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            px: 3.5,
            py: 1,
            borderRadius: 3,
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.06)",
              transform: "translateX(-2px)"
            }
          }}
        >
          Back to Directory
        </Button>

        <Grid container spacing={4}>
          {/* LEFT CONTENT */}
          <Grid item xs={12} md={8}>
            {/* HERO CARD */}
            <Box
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: 5,
                background: "rgba(255, 255, 255, 0.015)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
              }}
            >
              {/* TOP */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 3.5,
                  alignItems: { xs: "flex-start", sm: "center" }
                }}
              >
                {/* LOGO */}
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 4,
                    background: "linear-gradient(135deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                  }}
                >
                  {getDomain(ai.website) ? (
                    <img
                      src={`https://www.google.com/s2/favicons?sz=128&domain=${getDomain(
                        ai.website
                      )}`}
                      alt={ai.name}
                      style={{
                        width: "60%",
                        height: "60%",
                        objectFit: "contain"
                      }}
                    />
                  ) : (
                    <Typography variant="h3" fontWeight="800" sx={{ fontFamily: "Outfit, sans-serif" }}>
                      {ai.name[0]}
                    </Typography>
                  )}
                </Box>

                {/* INFO */}
                <Box flex={1}>
                  <Chip
                    label={ai.category}
                    sx={{
                      mb: 1.5,
                      background: "rgba(99, 102, 241, 0.15)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      color: "primary.light",
                      fontWeight: 700,
                      fontFamily: "Outfit, sans-serif"
                    }}
                  />

                  <Typography
                    variant="h3"
                    fontWeight="800"
                    sx={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: { xs: "2.2rem", sm: "2.6rem", md: "3.2rem" },
                      letterSpacing: "-1.5px",
                      lineHeight: 1.2,
                      mb: 1
                    }}
                  >
                    {ai.name}
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500, fontFamily: "Outfit, sans-serif", fontSize: "1.05rem" }}
                  >
                    Best {ai.category} AI Tool for Productivity (2026)
                  </Typography>
                </Box>
              </Box>

              {/* DESCRIPTION */}
              <Box sx={{ mt: 5, mb: 4.5 }}>
                <Typography
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.8,
                    fontSize: "1.1rem"
                  }}
                >
                  {ai.description}
                  {ai.enhanced_description || ` ${ai.name} is an advanced AI platform designed to help users improve productivity, automate workflows, and simplify complex tasks using AI.`}
                </Typography>
              </Box>

              {/* RATING HIGHLIGHTS */}
              <Box sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 4, background: "rgba(255, 255, 255, 0.01)", border: "1px solid rgba(255, 255, 255, 0.04)", mb: 5 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="600" sx={{ mb: 2, fontFamily: "Outfit, sans-serif" }}>
                  COMMUNITY EVALUATION
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="h5" fontWeight="800" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      4.8 <StarIcon sx={{ color: "#f59e0b", fontSize: "20px" }} />
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Community Score
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="h5" fontWeight="800">
                      98%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Popularity Rating
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h5" fontWeight="800">
                      Fast
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Performance Speed
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* KEY FEATURES */}
              <Box sx={{ mb: 5 }}>
                <Typography
                  variant="h5"
                  fontWeight="700"
                  mb={3}
                  sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.5px" }}
                >
                  Key Features
                </Typography>

                <Grid container spacing={2}>
                  {[
                    "AI-Driven Automation",
                    "High Performance & Speed",
                    "Intuitive & Easy To Use",
                    "Cloud-Based Infrastructure",
                    "Productivity & Growth Focused",
                    "Beginner Friendly Interface"
                  ].map((feature) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      key={feature}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          background: "rgba(255,255,255,0.01)",
                          border: "1px solid rgba(255,255,255,0.04)",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5
                        }}
                      >
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "primary.light" }} />
                        <Typography fontSize="14px" fontWeight="600">
                          {feature}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* FAQs */}
              <Box sx={{ mb: 5 }}>
                <Typography
                  variant="h5"
                  fontWeight="700"
                  mb={3}
                  sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.5px" }}
                >
                  Frequently Asked Questions
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Accordion
                    sx={{
                      background: "rgba(255,255,255,0.01)",
                      "&::before": { display: "none" }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: "primary.light" }} />}
                      sx={{ px: 2 }}
                    >
                      <Typography fontWeight="700">What is {ai.name} used for?</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
                      <Typography color="text.secondary" fontSize="14px" sx={{ lineHeight: 1.6 }}>
                        {ai.name} is predominantly used in the {ai.category.toLowerCase()} domain to automate routine procedures, scale up efficiency, and enable smart optimizations using artificial intelligence models.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    sx={{
                      background: "rgba(255,255,255,0.01)",
                      "&::before": { display: "none" }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: "primary.light" }} />}
                      sx={{ px: 2 }}
                    >
                      <Typography fontWeight="700">Is {ai.name} free to use?</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
                      <Typography color="text.secondary" fontSize="14px" sx={{ lineHeight: 1.6 }}>
                        It offers hybrid accessibility containing both free-tier features/trials and premium upgrades for heavy computational requests or advanced capabilities.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Box>

              {/* INTERNAL LINKS */}
              <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.06)", pt: 4.5 }}>
                <Typography color="text.secondary" fontSize="14px">
                  Compare with other directories or explore similar platforms like{" "}
                  <span
                    style={{
                      color: "#818cf8",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                    onClick={() => navigate("/ai/chatgpt")}
                  >
                    ChatGPT
                  </span>{" "}
                  and{" "}
                  <span
                    style={{
                      color: "#818cf8",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                    onClick={() => navigate("/ai/google-gemini")}
                  >
                    Gemini
                  </span>.
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT SIDEBAR */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                position: "sticky",
                top: 120
              }}
            >
              <Box
                sx={{
                  p: 3.5,
                  borderRadius: 5,
                  background: "rgba(255, 255, 255, 0.015)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="800"
                  mb={3}
                  sx={{ fontFamily: "Outfit, sans-serif", letterSpacing: "-0.5px" }}
                >
                  Quick Overview
                </Typography>

                {/* Specs List */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
                  
                  {/* Category */}
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box sx={{ p: 1, borderRadius: 2, backgroundColor: "rgba(99, 102, 241, 0.1)", color: "primary.light", display: "flex" }}>
                      <CategoryIcon sx={{ fontSize: "20px" }} />
                    </Box>
                    <Box>
                      <Typography color="text.secondary" fontSize="12px" fontWeight="700" sx={{ letterSpacing: "0.5px" }}>
                        CATEGORY
                      </Typography>
                      <Typography fontWeight="700" color="text.primary" fontSize="15px">
                        {ai.category}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Pricing */}
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box sx={{ p: 1, borderRadius: 2, backgroundColor: "rgba(6, 182, 212, 0.1)", color: "secondary.light", display: "flex" }}>
                      <AttachMoneyIcon sx={{ fontSize: "20px" }} />
                    </Box>
                    <Box>
                      <Typography color="text.secondary" fontSize="12px" fontWeight="700" sx={{ letterSpacing: "0.5px" }}>
                        PRICING MODEL
                      </Typography>
                      <Typography fontWeight="700" color="text.primary" fontSize="15px">
                        Free Trial & Premium
                      </Typography>
                    </Box>
                  </Box>

                  {/* Platform */}
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box sx={{ p: 1, borderRadius: 2, backgroundColor: "rgba(168, 85, 247, 0.1)", color: "#d8b4fe", display: "flex" }}>
                      <DevicesIcon sx={{ fontSize: "20px" }} />
                    </Box>
                    <Box>
                      <Typography color="text.secondary" fontSize="12px" fontWeight="700" sx={{ letterSpacing: "0.5px" }}>
                        COMPATIBILITY
                      </Typography>
                      <Typography fontWeight="700" color="text.primary" fontSize="15px">
                        Web-Based App
                      </Typography>
                    </Box>
                  </Box>

                  {/* Popularity / Trending */}
                  <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                    <Box sx={{ p: 1, borderRadius: 2, backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#fcd34d", display: "flex" }}>
                      <TrendingUpIcon sx={{ fontSize: "20px" }} />
                    </Box>
                    <Box>
                      <Typography color="text.secondary" fontSize="12px" fontWeight="700" sx={{ letterSpacing: "0.5px" }}>
                        POPULARITY STATUS
                      </Typography>
                      <Typography fontWeight="700" color="text.primary" fontSize="15px">
                        {viewCount > 3 ? "Highly Trending" : "Emerging Platform"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Main Action: Visit */}
                <Button
                  variant="contained"
                  fullWidth
                  href={ai.website}
                  target="_blank"
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    mb: 2,
                    fontWeight: 700,
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "14px",
                    background: "linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #4f46e5 0%, #4338ca 100%)",
                      boxShadow: "0 6px 16px rgba(99, 102, 241, 0.3)"
                    }
                  }}
                >
                  Visit Official Website
                </Button>

                {/* Sub Actions: Bookmark & Share */}
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={toggleBookmark}
                    startIcon={bookmarked ? <BookmarkIcon sx={{ fontSize: "16px !important" }} /> : <BookmarkBorderIcon sx={{ fontSize: "16px !important" }} />}
                    sx={{
                      borderRadius: 3,
                      py: 1.2,
                      fontSize: "12px",
                      borderColor: bookmarked ? "primary.main" : "rgba(255, 255, 255, 0.08)",
                      color: bookmarked ? "primary.light" : "text.primary",
                      background: bookmarked ? "rgba(99, 102, 241, 0.05)" : "rgba(255, 255, 255, 0.01)",
                      "&:hover": {
                        borderColor: bookmarked ? "primary.light" : "rgba(255, 255, 255, 0.2)",
                        background: bookmarked ? "rgba(99, 102, 241, 0.1)" : "rgba(255, 255, 255, 0.04)"
                      }
                    }}
                  >
                    {bookmarked ? "Bookmarked" : "Bookmark"}
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleShare}
                    startIcon={<ShareIcon sx={{ fontSize: "16px !important" }} />}
                    sx={{
                      borderRadius: 3,
                      py: 1.2,
                      fontSize: "12px",
                      borderColor: copied ? "success.main" : "rgba(255, 255, 255, 0.08)",
                      color: copied ? "success.light" : "text.primary",
                      background: copied ? "rgba(46, 125, 50, 0.05)" : "rgba(255, 255, 255, 0.01)",
                      "&:hover": {
                        borderColor: copied ? "success.light" : "rgba(255, 255, 255, 0.2)",
                        background: copied ? "rgba(46, 125, 50, 0.1)" : "rgba(255, 255, 255, 0.04)"
                      }
                    }}
                  >
                    {copied ? "Copied!" : "Share Link"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* SIMILAR TOOLS */}
        {similar.length > 0 && (
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              mt: 8,
              pt: 5
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={3}
              sx={{mb: 3}}
            >
              Similar AI Tools
            </Typography>

            <Grid container spacing={3}>
              {similar.map((item, i) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={i}
                >
                  <AICard ai={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </>
  );
}
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About AI Central Store</title>
        <meta
          name="description"
          content="Learn about AI Central Store and our mission to help users discover the best AI tools."
        />
      </Helmet>

      {/* HERO */}
      <Box
        sx={{
          pt: 15,
          pb: 10,
          background:
            "linear-gradient(135deg,#0f172a,#111827,#1e1b4b)"
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            fontWeight="bold"
            mb={3}
          >
            About AI Central Store
          </Typography>

          <Typography
            sx={{
              maxWidth: 800,
              color: "#cbd5e1",
              fontSize: "1.2rem",
              lineHeight: 1.8
            }}
          >
            Discover, compare and explore the
            world's best AI tools for productivity,
            business, development, marketing,
            content creation and more.
          </Typography>

          <Button
            component={Link}
            to="/"
            variant="contained"
            sx={{
              mt: 4,
              px: 4,
              py: 1.4,
              borderRadius: 3
            }}
          >
            Explore AI Tools
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* STATS */}
        <Grid container spacing={3} sx={{ mt: -5 }}>
          {[
            {
              title: "500+",
              subtitle: "AI Tools"
            },
            {
              title: "90+",
              subtitle: "Categories"
            },
            {
              title: "50+",
              subtitle: "Blog Guides"
            }
          ].map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 4,
                  background: "#111827"
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                >
                  {item.title}
                </Typography>

                <Typography color="gray">
                  {item.subtitle}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* WHY US */}
        <Box py={10}>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={5}
          >
            Why AI Central Store?
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  height: "100%",
                  background: "#111827"
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                >
                  Curated Directory
                </Typography>

                <Typography color="gray">
                  Discover carefully selected AI
                  tools organized into categories.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  height: "100%",
                  background: "#111827"
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                >
                  Regular Updates
                </Typography>

                <Typography color="gray">
                  New AI tools and resources are
                  continuously added.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  height: "100%",
                  background: "#111827"
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                >
                  Detailed Guides
                </Typography>

                <Typography color="gray">
                  Learn about AI tools through
                  in-depth tutorials and blogs.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* MISSION */}
        <Box
          sx={{
            py: 8,
            borderTop:
              "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
          >
            Our Mission
          </Typography>

          <Typography
            sx={{
              color: "#cbd5e1",
              lineHeight: 2,
              maxWidth: 900
            }}
          >
            Our mission is to make AI discovery
            simple and accessible. We help
            individuals, creators, developers,
            students, and businesses find the
            right AI tools to improve productivity
            and unlock new possibilities.
          </Typography>
        </Box>
      </Container>
    </>
  );
}
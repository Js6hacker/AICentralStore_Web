import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import Blog from "./pages/Blog";

import Home from "./pages/Home";
import Details from "./pages/Details";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import PrivacyPolicy from "./pages/Policy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";


<HelmetProvider>
  <App />
</HelmetProvider>

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
      <BrowserRouter>

        <Navbar />

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/ai/:slug" element={<PageWrapper><Details /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/blog/:slug" element={<Blog/>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
            <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
         
          </Routes>
        </AnimatePresence>
        <Footer />

      </BrowserRouter>
  );
}
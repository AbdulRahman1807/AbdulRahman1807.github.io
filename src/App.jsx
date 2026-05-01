import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useTheme } from "./hooks/useTheme";
import Home from "./pages/Home.jsx";
import SyntaxLab from "./pages/projects/SyntaxLab.jsx";
import BuzzCode from "./pages/projects/BuzzCode.jsx";
import PlaceholderProject from "./pages/projects/PlaceholderProject.jsx";
import PageTransition from "./components/PageTransition.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import WaveSquaresGrid from "./components/WaveSquaresGrid.jsx";
import Navbar from "./components/Navbar.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/projects/syntaxlab"
          element={
            <PageTransition>
              <SyntaxLab />
            </PageTransition>
          }
        />
        <Route
          path="/projects/buzzcode"
          element={
            <PageTransition>
              <BuzzCode />
            </PageTransition>
          }
        />
        <Route
          path="/projects/placeholder"
          element={
            <PageTransition>
              <PlaceholderProject />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useTheme();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
      <WaveSquaresGrid />
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
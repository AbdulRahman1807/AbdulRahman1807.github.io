import Contact from "../components/Contact";
import CustomCursor from "../components/CustomCursor";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import WaveSquaresGrid from "../components/WaveSquaresGrid";
import { useState } from "react";

export default function Home() {
  const [showLoader, setShowLoader] = useState(sessionStorage.getItem("loaded") !== "true");

  return (
    <>
      <CustomCursor />
      <WaveSquaresGrid />
      
      {showLoader && (
        <Loader onComplete={() => setShowLoader(false)} />
      )}
      
      <main id="top">
        <Navbar animateIn={true} />
        <Hero animateIn={true} />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

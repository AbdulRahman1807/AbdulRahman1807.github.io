import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Loader from "../components/Loader";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import { useState } from "react";

export default function Home() {
  const [showLoader, setShowLoader] = useState(sessionStorage.getItem("loaded") !== "true");

  return (
    <>
      {showLoader && (
        <Loader onComplete={() => setShowLoader(false)} />
      )}
      
      <main id="top">
        <Hero animateIn={true} />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

import { ChevronDown, ArrowDown } from "lucide-react";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import WaveSquaresGrid from "./WaveSquaresGrid";
import { useSound } from "../hooks/useSound";
import VerticalMarquee from "./VerticalMarquee";

const TAGLINE = "building things that just work.";

export default function Hero({ animateIn }) {
  const { play } = useSound();
  const firstNameChars = useMemo(() => "ABDUL".split(""), []);
  const lastNameChars = useMemo(() => "RAHMAN".split(""), []);
  const heroRef = useRef(null);
  const labelRef = useRef(null);
  const marqueeContainerRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [startTypewriter, setStartTypewriter] = useState(false);

  useEffect(() => {
    if (!animateIn) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setTypedText(TAGLINE);
      setTypingDone(true);
      return;
    }

    const ctx = gsap.context(() => {
      const letters = heroRef.current?.querySelectorAll(".hero-letter-inner") ?? [];
      gsap.set(letters, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(labelRef.current, { x: -30, opacity: 0 });
      gsap.set(marqueeContainerRef.current, { x: 50, opacity: 0, rotate: 10 });

      gsap.to(letters, {
        clipPath: "inset(0% 0 0 0)",
        stagger: 0.05,
        ease: "power4.out",
        duration: 0.7,
        delay: 0.2,
        onComplete: () => setStartTypewriter(true),
      });

      gsap.to(labelRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.95,
      });

        gsap.to(marqueeContainerRef.current, {
          x: 0,
          opacity: 1,
          rotate: 2,
          duration: 1,
          ease: "elastic.out(1, 0.75)",
          delay: 1.2,
          onStart: () => play("swoosh"),
        });
    }, heroRef);

    return () => ctx.revert();
  }, [animateIn]);

  useEffect(() => {
    if (!startTypewriter) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTypedText(TAGLINE);
      setTypingDone(true);
      return;
    }

    let index = 0;
    let isDeleting = false;
    let timeoutId;

    const tick = () => {
      if (!isDeleting) {
        index += 1;
        setTypedText(TAGLINE.slice(0, index));
        if (index >= TAGLINE.length) {
          setTypingDone(true);
          isDeleting = true;
          timeoutId = setTimeout(tick, 3000); // Wait longer when done
          return;
        }
      } else {
        index -= 1;
        setTypedText(TAGLINE.slice(0, index));
        if (index <= 0) {
          setTypingDone(false);
          isDeleting = false;
          timeoutId = setTimeout(tick, 800); // Wait a bit before restarting
          return;
        }
      }
      
      const speed = isDeleting ? 30 : 50;
      timeoutId = setTimeout(tick, speed);
    };

    tick();

    return () => clearTimeout(timeoutId);
  }, [startTypewriter]);

  return (
    <section id="about" className="hero-section" ref={heroRef}>
      <div className="hero-content">
      <p className="font-mono hero-label" ref={labelRef}>
        [ Full-Stack Developer & AI/ML Builder ]
      </p>

      <h1 className="font-display hero-title">
        <span className="hero-word">
          {firstNameChars.map((char, index) => (
            <span key={`a-${char}-${index}`} className="hero-letter-wrap">
              <span className="hero-letter-inner">{char}</span>
            </span>
          ))}
        </span>
        <span className="hero-word">
          {lastNameChars.map((char, index) => (
            <span key={`r-${char}-${index}`} className="hero-letter-wrap">
              <span className="hero-letter-inner">{char}</span>
            </span>
          ))}
        </span>
      </h1>

      <p className="hero-tagline typewriter-line">
        <span>{typedText}</span>
        <span className={`type-cursor${typingDone ? " done" : ""}`} aria-hidden="true" />
      </p>

      <p className="hero-bio">
        B.Tech grad from Rathinam Technical Campus. I build full-stack systems,
        automate workflows with n8n & Docker, and explore ML. Currently looking
        for opportunities to ship meaningful products.
      </p>

      <div className="hero-actions">
        <a
          href="#projects"
          className="brutal-btn brutal-btn-primary"
          data-cursor="hover"
          onClick={() => play("thunk")}
        >
          View My Work <ArrowDown size={18} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
        </a>
        <a
          href="#contact"
          className="brutal-btn brutal-btn-outline"
          data-cursor="hover"
          onClick={() => play("thunk")}
        >
          Get In Touch
        </a>
      </div>


      <VerticalMarquee direction="horizontal" />

      </div>

      <div className="hero-marquee-wrapper" ref={marqueeContainerRef}>
        <VerticalMarquee />
      </div>
    </section>
  );
}

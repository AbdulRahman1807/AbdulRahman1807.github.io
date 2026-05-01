import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useSound } from "../hooks/useSound";

gsap.registerPlugin(ScrollTrigger);

const skillData = {
  Languages: ["Java", "Python", "HTML", "CSS", "JavaScript", "SQL"],
  Frameworks: ["React", "Ruby on Rails"],
  "AI / ML": ["scikit-learn", "NumPy", "Pandas", "Orange"],
  "Tools & DevOps": ["Git", "Docker", "n8n"],
  Databases: ["PostgreSQL","MySQL"],
};

// Subtle random rotations for the containers only
const getRandomRotation = (strength = 3) => (Math.random() * (strength * 2) - strength).toFixed(2);
const getRandomScale = () => (0.98 + Math.random() * 0.04).toFixed(2);

export default function Skills() {
  const { play } = useSound();
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const header = section?.querySelector(".section-title");
      const cards = section?.querySelectorAll(".skills-card") ?? [];

      gsap.fromTo(
        header,
        { clipPath: "inset(0 100% 0 0)", scale: 0.8, filter: "blur(10px)" },
        {
          clipPath: "inset(0 0% 0 0)",
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      gsap.fromTo(
        cards,
        { y: 80, opacity: 0, scale: 0.9, rotationZ: 10 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationZ: (i) => [-2, 1.5, -1.2, 2.2, -0.8][i % 5],
          stagger: 0.1,
          duration: 1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section id="skills" className="section-shell skills-section" ref={sectionRef}>
      <h2 className="font-display section-title">What I Work With</h2>
      <hr className="section-rule" />

      <div className="skills-wrap chaotic-grid">
        {Object.entries(skillData).map(([category, items], index) => (
          <div
            key={category}
            className={`brutal-card skills-card variant-${(index % 3) + 1}`}
            style={{ 
              transform: `rotate(${getRandomRotation()}deg) scale(${getRandomScale()})`,
            }}
          >
            <p className="font-mono skills-label">{category}</p>
            <div className="skills-tags">
              {items.map((item) => (
                <span
                  key={item}
                  className="font-mono skills-tag"
                  onMouseEnter={() => play("tick")}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

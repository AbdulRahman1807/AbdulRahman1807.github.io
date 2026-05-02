import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
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
  const [activeFilter, setActiveFilter] = useState("All");

  // Handle filtering animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const cards = section.querySelectorAll(".skills-card");
    
    cards.forEach((card, i) => {
      const category = Object.keys(skillData)[i];
      const isActive = activeFilter === "All" || category === activeFilter;
      
      gsap.to(card, {
        opacity: isActive ? 1 : 0.12,
        scale: isActive ? 1 : 0.92,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto"
      });
    });
  }, [activeFilter]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const header = section?.querySelector(".section-title");
      const cards = section?.querySelectorAll(".skills-card") ?? [];
      const tags = section?.querySelectorAll(".skills-tag");

      // Initial card entrance
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

      // Scramble tags logic
      gsap.fromTo(tags, 
        { opacity: 0 },
        {
          opacity: 1,
          stagger: {
            each: 0.03,
            onStart: function() {
              const el = this.targets()[0];
              const real = el.getAttribute('data-skill');
              const chars = "XQZJVBK#@!%&*";
              let frame = 0;
              const id = setInterval(() => {
                el.textContent = frame > 8 ? real 
                  : [...real].map(c => c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]).join("");
                if (++frame > 9) {
                  clearInterval(id);
                }
              }, 60);
            }
          },
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
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
            className={`brutal-card skills-card variant-${(index % 3) + 1} ${activeFilter === category ? "is-focused" : ""}`}
            style={{ 
              transform: `rotate(${getRandomRotation()}deg) scale(${getRandomScale()})`,
            }}
            onClick={() => {
              play("thunk");
              setActiveFilter(activeFilter === category ? "All" : category);
            }}
            data-cursor="hover"
          >
            <p className="font-mono skills-label">{category}</p>
            <div className="skills-tags">
              {items.map((item) => (
                <span
                  key={item}
                  data-skill={item}
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

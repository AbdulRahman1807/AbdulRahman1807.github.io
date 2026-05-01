import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const header = section?.querySelector(".section-title");
      const cards = section?.querySelectorAll(".project-item") ?? [];
      const sectionItems = section?.querySelectorAll(".section-rule, .project-item") ?? [];

      gsap.fromTo(
        header,
        { clipPath: "circle(0% at 50% 50%)", rotation: -5, opacity: 0 },
        {
          clipPath: "circle(100% at 50% 50%)",
          rotation: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      gsap.fromTo(
        sectionItems,
        { x: -100, opacity: 0, skewY: 5 },
        {
          x: 0,
          opacity: 1,
          skewY: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { 
            x: index % 2 === 0 ? -150 : 150, 
            opacity: 0, 
            rotationZ: index % 2 === 0 ? -10 : 10,
            scale: 0.9 
          },
          {
            x: 0,
            opacity: 1,
            rotationZ: 0,
            scale: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section id="projects" className="section-shell" ref={sectionRef}>
      <h2 className="font-display section-title">
        THINGS I&apos;VE <span className="title-accent">BUILT</span>
      </h2>
      <hr className="section-rule" />

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className={`project-item project-${project.id}`}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}

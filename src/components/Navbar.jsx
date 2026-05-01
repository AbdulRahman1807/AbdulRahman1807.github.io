import { Link, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSound } from "../hooks/useSound";
import { useTheme } from "../hooks/useTheme";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ animateIn }) {
  const toggleRef = useRef(null);
  const { play, isMuted, toggleMute } = useSound();
  const { theme, toggleTheme } = useTheme(toggleRef);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");
  const [dotOpen, setDotOpen] = useState(false);
  const dotMenuRef = useRef(null);

  const isProjectPage = pathname.startsWith("/projects/");

  useEffect(() => {
    if (isProjectPage || pathname !== "/") {
      setActiveSection("");
      return;
    }
    const sectionIds = links.map((l) => l.href.replace("#", ""));
    const observers = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(entry.target.id);
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, [pathname, isProjectPage]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dotMenuRef.current && !dotMenuRef.current.contains(e.target)) {
        setDotOpen(false);
      }
    };
    if (dotOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dotOpen]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      
      if (dotOpen) {
        gsap.to(".dot-dropdown", {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: prefersReducedMotion ? 0 : 0.5,
          ease: "power4.out"
        });
      } else {
        gsap.to(".dot-dropdown", {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: prefersReducedMotion ? 0 : 0.4,
          ease: "power3.in"
        });
      }
    }, dotMenuRef);
    return () => ctx.revert();
  }, [dotOpen]);

  return (
    <>
      <aside className="side-ticker">
        <div className="ticker-logo font-display">AR</div>
        <div className="ticker-links">
          {isProjectPage ? (
            <button 
              type="button"
              className="ticker-item font-mono"
              onClick={() => { play("click"); navigate(-1); }}
              onMouseEnter={() => play("click")}
              data-cursor="hover"
            >
              <span className="ticker-label">← Back</span>
            </button>
          ) : (
            links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`ticker-item font-mono ${activeSection === link.href.replace("#", "") ? "active" : ""}`}
                onMouseEnter={() => play("click")}
                data-cursor="hover"
              >
                <span className="ticker-label">{link.label}</span>
              </a>
            ))
          )}
        </div>
      </aside>

      <div className="watermark-container pointer-events-none">
        {links.map((link) => {
          const id = link.href.replace("#", "");
          return (
            <div 
              key={id} 
              className={`watermark-text font-display ${activeSection === id && !isProjectPage ? "active" : ""}`}
            >
              {link.label}
            </div>
          );
        })}
      </div>

      <div className="dot-menu-container" ref={dotMenuRef}>
        <button 
          type="button"
          className="dot-trigger" 
          onClick={() => { play("click"); setDotOpen(!dotOpen); }}
          data-cursor="hover"
          aria-label="Menu"
        />
        <div className="dot-dropdown brutal-border brutal-shadow">
          <div className="dot-mobile-links">
            {links.map((link) => (
              <a
                key={link.label}
                href={isProjectPage ? `/${link.href}` : link.href}
                className="dot-nav-item font-mono"
                onClick={() => setDotOpen(false)}
                data-cursor="hover"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="dot-controls-vertical">
            <button
              type="button"
              className="dot-nav-item font-mono"
              onClick={toggleTheme}
              ref={toggleRef}
              data-cursor="hover"
            >
              <span className="control-label">{theme === "dark" ? "LIGHT MODE" : "DARK MODE"}</span>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <button
              type="button"
              className="dot-nav-item font-mono"
              onClick={toggleMute}
              data-cursor="hover"
            >
              <span className="control-label">{isMuted ? "SOUND ON" : "SOUND OFF"}</span>
              {isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <a
              href="https://docs.google.com/uc?export=download&id=1Q2Ise948976Uongl6slBusoU3wAkgtDx"
              target="_blank"
              rel="noopener noreferrer"
              className="dot-nav-item font-mono"
              data-cursor="hover"
            >
              <span className="control-label">DOWNLOAD CV</span>
              <Link size={16} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
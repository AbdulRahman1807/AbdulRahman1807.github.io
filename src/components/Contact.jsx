/* 
 * EMAILJS SETUP REQUIRED:
 * 1. Create account at https://www.emailjs.com
 * 2. Create an Email Service (Gmail recommended) → copy Service ID
 * 3. Create an Email Template → copy Template ID
 * 4. Go to Account → API Keys → copy Public Key
 * 5. Replace the three placeholder strings in this file
 * Template variables needed: {{from_name}}, {{from_email}}, {{message}}
 */
import { GitFork, Link, Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useSound } from "../hooks/useSound";

gsap.registerPlugin(ScrollTrigger);

const initialForm = { name: "", email: "", message: "" };

export default function Contact() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const { play } = useSound();
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    play("tick");

    emailjs
      .sendForm(
        "service_portfolio",
        "template_portfolio",
        formRef.current,
        "UAKWNwjWgvVrdT9PU"
      )
      .then(
        () => {
          setStatus("success");
          setFormData(initialForm);
          play("chime");
          setTimeout(() => setStatus("idle"), 5000);
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setStatus("error");
          setTimeout(() => setStatus("idle"), 5000);
        }
      );
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const header = section?.querySelector(".contact-title");
      const leftSide = section?.querySelector(".contact-left");
      const formItems = section?.querySelectorAll(".form-field, .submit-btn") ?? [];

      gsap.fromTo(
        header,
        { y: -50, opacity: 0, scale: 1.2, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "bounce.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      gsap.fromTo(
        leftSide,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      gsap.fromTo(
        formItems,
        { x: 150, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.5)",
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
    <section id="contact" className="section-shell contact-grid" ref={sectionRef}>
      <div className="contact-left">
        <h2 className="font-display contact-title">LET&apos;S TALK.</h2>
        <p className="font-mono contact-email">arrsa1807@gmail.com</p>
        <div className="icon-row">
          <a
            href="https://github.com/AbdulRahman1807"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn brutal-border"
            aria-label="GitHub"
            data-cursor="hover"
          >
            <GitFork size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/abdul-rahman-rsa/"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn brutal-border"
            aria-label="LinkedIn"
            data-cursor="hover"
          >
            <Link size={18} />
          </a>
          <a
            href="mailto:arrsa1807@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn brutal-border"
            aria-label="Email"
            data-cursor="hover"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>

      <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="contact-name" className="form-label">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="brutal-input"
            data-cursor="hover"
          />
        </div>

        <div className="form-field">
          <label htmlFor="contact-email" className="form-label">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="brutal-input"
            data-cursor="hover"
          />
        </div>

        <div className="form-field">
          <label htmlFor="contact-message" className="form-label">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="How can I help?"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="brutal-input"
            data-cursor="hover"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className={`submit-btn brutal-btn ${status === "loading" ? "loading" : ""}`}
          data-cursor="hover"
        >
          {status === "loading" ? "SENDING..." : "GET IN TOUCH"}
        </button>

        {status === "error" && (
          <p className="font-mono form-error">Something went wrong. Try again.</p>
        )}
      </form>

      {/* Success Toast Notification */}
      <div className={`brutal-toast brutal-border brutal-shadow ${status === "success" ? "active" : ""}`}>
        <p className="font-mono">Message sent ✓ I&apos;ll get back to you soon.</p>
      </div>
    </section>
  );
}

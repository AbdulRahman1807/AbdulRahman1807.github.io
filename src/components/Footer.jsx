import { GitFork, Link, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer-shell">
      <p className="footer-copy">© 2026 Abdul Rahman</p>
      <div className="icon-row">
        <a
          href="https://github.com/AbdulRahman1807"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn brutal-border"
          aria-label="GitHub"
        >
          <GitFork size={18} />
        </a>
        <a
          href="https://www.linkedin.com/in/abdul-rahman-rsa/"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn brutal-border"
          aria-label="LinkedIn"
        >
          <Link size={18} />
        </a>
        <a
          href="mailto:arrsa1807@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn brutal-border"
          aria-label="Email"
        >
          <Mail size={18} />
        </a>
      </div>
    </footer>
  );
}

import { useNavigate } from "react-router-dom";
import { useSound } from "../../hooks/useSound";

const stack = ["React", "Node.js", "Express", "PostgreSQL"];

export default function SyntaxLab() {
  const { play } = useSound();
  const navigate = useNavigate();

  return (
    <main className="project-page-shell">
      <h1 className="font-display project-page-title">SyntaxLab</h1>
      <p className="project-page-tagline">
        Live DBMS execution for large-scale classrooms.
      </p>

      <div className="project-stack">
        {stack.map((item) => (
          <span key={item} className="font-mono skills-tag">
            {item}
          </span>
        ))}
      </div>

      <section className="project-two-col">
        <article className="brutal-card">
          <h2 className="font-display project-subtitle">The Problem</h2>
          <p className="project-text">
            Large classrooms struggle to run live DBMS sessions because student
            systems are inconsistent and shared hardware creates execution
            bottlenecks during practical learning.
          </p>
        </article>
        <article className="brutal-card">
          <h2 className="font-display project-subtitle">The Solution</h2>
          <p className="project-text">
            SyntaxLab introduces a dynamic PostgreSQL bridge and randomized team
            engine so students can execute queries in a guided, scalable flow.
          </p>
        </article>
      </section>

      <section className="project-features">
        <h2 className="font-display project-subtitle">Key Features</h2>
        <ol>
          <li>1. Randomized team-selection engine</li>
          <li>2. Dynamic PostgreSQL bridge for live SQL execution</li>
          <li>3. Eliminates hardware bottlenecks in large classrooms</li>
        </ol>
      </section>

      <div>
        <a
          href="https://github.com/AbdulRahman1807/SyntaxLab"
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-btn brutal-btn-outline"
          onClick={() => play("thunk")}
        >
          View on GitHub ↗
        </a>
      </div>
    </main>
  );
}
import { useNavigate } from "react-router-dom";
import { useSound } from "../../hooks/useSound";

const stack = ["HTML", "CSS", "JavaScript", "Firebase"];

export default function BuzzCode() {
  const { play } = useSound();
  const navigate = useNavigate();

  return (
    <main className="project-page-shell">
      <h1 className="font-display project-page-title">BuzzCode</h1>
      <p className="project-page-tagline">
        Real-time buzzer for contests, quizzes & classrooms.
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
            Quiz and contest sessions need fast, reliable buzz-in logic, but
            manual judging and delayed responses cause fairness issues.
          </p>
        </article>
        <article className="brutal-card">
          <h2 className="font-display project-subtitle">The Solution</h2>
          <p className="project-text">
            BuzzCode delivers a first-tap-wins flow with host controls, live
            scoring, and Firebase-backed synchronization for instant updates.
          </p>
        </article>
      </section>

      <section className="project-features">
        <h2 className="font-display project-subtitle">Key Features</h2>
        <ol>
          <li>1. First-tap-wins buzzer with configurable delay</li>
          <li>2. Host-controlled questions and session management</li>
          <li>3. Live participant list and score tracking</li>
          <li>4. Works on mobile browsers, no app install needed</li>
          <li>5. Firebase Realtime Database — no backend required</li>
        </ol>
      </section>

      <div className="project-links-row">
        <a
          href="https://github.com/AbdulRahman1807/buzzcode"
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-btn brutal-btn-outline"
          onClick={() => play("thunk")}
        >
          View on GitHub ↗
        </a>
        <a
          href="https://abdulrahman1807.github.io/buzzcode/"
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-btn brutal-btn-outline"
          onClick={() => play("thunk")}
        >
          Live Demo ↗
        </a>
      </div>
    </main>
  );
}
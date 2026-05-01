import { Link } from "react-router-dom";
import { useSound } from "../hooks/useSound";

export default function ProjectCard({ project }) {
  const { play } = useSound();

  if (project.placeholder) {
    return (
      <article
        className="brutal-card project-card placeholder-pulse"
        onMouseEnter={() => play("whoosh")}
      >
        <div className="placeholder-inner">
          <h3 className="font-display placeholder-name">{project.name}</h3>
          <p className="font-mono placeholder-label">Coming Soon</p>
        </div>
      </article>
    );
  }

  return (
    <article className="brutal-card project-card" onMouseEnter={() => play("whoosh")}>
      <div className="project-image-slot">
        <span className="font-display project-image-name">{project.name}</span>
      </div>
      <h3 className="font-display project-name">{project.name}</h3>
      <p className="project-tagline">{project.tagline}</p>
      {project.featured && <p className="font-mono project-featured">Featured</p>}
      <p className="project-description">{project.description}</p>

      <div className="project-stack">
        {project.stack.map((tech) => (
          <span key={tech} className="font-mono skills-tag">
            {tech}
          </span>
        ))}
      </div>

      <div className="project-buttons">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn brutal-btn-outline project-btn-small"
            data-cursor="hover"
            onClick={() => play("thunk")}
          >
            GitHub ↗
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn brutal-btn-outline project-btn-small"
            data-cursor="hover"
            onClick={() => play("thunk")}
          >
            Live Demo ↗
          </a>
        )}
        <Link
          to={`/projects/${project.id}`}
          className="brutal-btn brutal-btn-primary project-btn-small"
          data-cursor="hover"
          onClick={() => play("thunk")}
        >
          View Case Study →
        </Link>
      </div>
    </article>
  );
}

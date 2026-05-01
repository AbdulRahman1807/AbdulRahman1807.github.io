import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PlaceholderProject() {
  return (
    <main className="project-page-shell placeholder-page">
      <Link 
        to="/" 
        className="project-back-link font-mono"
        data-cursor="hover"
      >
        <ArrowLeft size={16} /> BACK TO HOME
      </Link>
      <div className="placeholder-page-center">
        <h1 className="font-display">Coming Soon</h1>
        <p>This project will be added soon.</p>
      </div>
    </main>
  );
}

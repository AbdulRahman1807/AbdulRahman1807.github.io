import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState("default");
  const cursorRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const angleRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let rafId;

    const updateVisuals = () => {
      const dx = mouseRef.current.x - posRef.current.x;
      const dy = mouseRef.current.y - posRef.current.y;
      
      posRef.current.x += dx * 0.15;
      posRef.current.y += dy * 0.15;
      
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        let diff = angle - angleRef.current;
        diff = ((diff + 180) % 360) - 180;
        if (diff < -180) diff += 360;
        angleRef.current += diff * 0.2;
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) rotate(${angleRef.current}deg)`;
      }
      
      rafId = requestAnimationFrame(updateVisuals);
    };

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("input, textarea, [contenteditable='true'], [data-cursor='text']")) {
        setMode("text");
        return;
      }
      if (target.closest("a, button, [data-cursor='hover']")) {
        setMode("hover");
        return;
      }
      setMode("default");
    };

    const onMouseOut = () => {
      setMode("default");
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);
    
    rafId = requestAnimationFrame(updateVisuals);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className={`blade-cursor ${mode}`} ref={cursorRef} />
  );
}

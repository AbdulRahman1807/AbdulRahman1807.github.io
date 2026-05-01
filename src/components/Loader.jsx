import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSound } from "../hooks/useSound";

const LINES = [
  { x1: 30, y1: 0, x2: 10, y2: 100 },
  { x1: 75, y1: 0, x2: 85, y2: 100 },
  { x1: 0, y1: 25, x2: 100, y2: 15 },
  { x1: 0, y1: 80, x2: 100, y2: 65 },
  { x1: 0, y1: 5, x2: 100, y2: 95 },
  { x1: 95, y1: 0, x2: 5, y2: 100 },
  { x1: 45, y1: 0, x2: 55, y2: 100 },
  { x1: 0, y1: 55, x2: 100, y2: 45 },
  { x1: 15, y1: 0, x2: 65, y2: 100 },
  { x1: 65, y1: 0, x2: 15, y2: 100 },
];

let polygons = [
  [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }]
];

LINES.forEach(line => {
  const l = { p1: { x: line.x1, y: line.y1 }, p2: { x: line.x2, y: line.y2 } };
  let newPolygons = [];
  
  polygons.forEach(poly => {
    const getSide = (p) => (p.x - l.p1.x) * (l.p2.y - l.p1.y) - (p.y - l.p1.y) * (l.p2.x - l.p1.x);
    const getIntersection = (p1, p2) => {
      const denominator = (l.p2.y - l.p1.y) * (p2.x - p1.x) - (l.p2.x - l.p1.x) * (p2.y - p1.y);
      if (Math.abs(denominator) < 0.00001) return null;
      const ua = ((l.p2.x - l.p1.x) * (p1.y - l.p1.y) - (l.p2.y - l.p1.y) * (p1.x - l.p1.x)) / denominator;
      return { x: p1.x + ua * (p2.x - p1.x), y: p1.y + ua * (p2.y - p1.y) };
    };

    const poly1 = [];
    const poly2 = [];
    
    for (let i = 0; i < poly.length; i++) {
      const pCur = poly[i];
      const pNext = poly[(i + 1) % poly.length];
      const sideCur = getSide(pCur);
      const sideNext = getSide(pNext);

      if (sideCur >= -0.01) poly1.push(pCur);
      if (sideCur <= 0.01) poly2.push(pCur);

      if ((sideCur > 0.01 && sideNext < -0.01) || (sideCur < -0.01 && sideNext > 0.01)) {
        const intersection = getIntersection(pCur, pNext);
        if (intersection) {
          poly1.push(intersection);
          poly2.push(intersection);
        }
      }
    }

    if (poly1.length > 2 && poly2.length > 2) {
      newPolygons.push(poly1, poly2);
    } else {
      newPolygons.push(poly);
    }
  });
  polygons = newPolygons;
});

const SHARDS = polygons.map(poly => {
  let cx = 0;
  let cy = 0;
  poly.forEach(p => { cx += p.x; cy += p.y; });
  cx /= poly.length;
  cy /= poly.length;
  
  return {
    clip: poly.map(p => `${p.x.toFixed(2)}% ${p.y.toFixed(2)}%`).join(', '),
    origin: `${cx.toFixed(2)}% ${cy.toFixed(2)}%`,
    cx,
    cy
  };
});

// Sort shards randomly for a chaotic, unpredictable peel sequence
SHARDS.sort(() => Math.random() - 0.5);

export default function Loader({ onComplete }) {
  const { play } = useSound();
  const rootRef = useRef(null);
  const shardsRef = useRef([]);
  const linesRef = useRef([]);
  const linesGroupRef = useRef(null);
  const callbacks = useRef({ onComplete });

  useEffect(() => {
    callbacks.current = { onComplete };
  }, [onComplete]);

  useEffect(() => {
    if (sessionStorage.getItem("loaded") === "true") {
      callbacks.current.onComplete?.();
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      sessionStorage.setItem("loaded", "true");
      callbacks.current.onComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(linesRef.current, { strokeDasharray: 100, strokeDashoffset: 100 });

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("loaded", "true");
          callbacks.current.onComplete?.();
        }
      });

      // Phase 1: Solid straight lines score the screen
      tl.to(linesRef.current, {
        strokeDashoffset: 0,
        duration: 0.5, // Drawn slower
        stagger: 0.1, // More staggered sequence
        ease: "power2.inOut",
        onStart: () => play("tick")
      }, 0);

      // Phase 2: Brief pause for tension (lines finish at ~1.4s, explosion starts at 1.8s)

      // Fade out lines right as peeling starts
      tl.to(linesGroupRef.current, { opacity: 0, duration: 0.1 }, 1.75);
      
      // Make the root background transparent so the shards reveal the site underneath
      tl.set(rootRef.current, { backgroundColor: "transparent" }, 1.75);

      shardsRef.current.forEach((shard, i) => {
        const shardData = SHARDS[i];
        
        // Push outward from center dynamically.
        // Massive multiplier (x8) increases the distance traveled, hugely boosting physical velocity.
        const dx = (shardData.cx - 50) * 8; 
        const dy = (shardData.cy - 50) * 8;

        if (i === 0 || i === Math.floor(SHARDS.length / 2)) {
          tl.add(() => play("swoosh"), 1.8 + i * 0.0075);
        }

        // Drastically reduced stagger so the entire sequence completes extremely fast
        const startTime = 1.8 + i * 0.0075;

        // Animate the solid pieces
        tl.to(shard, {
          backgroundColor: "#2A2A2A", // Simulates lighting to distinguish overlapping pieces
          x: `${dx}vw`,
          y: `${dy}vh`,
          z: 2500, // Massive Z pull rips it past the camera at breakneck speed
          rotateX: gsap.utils.random(-15, 15), 
          rotateY: gsap.utils.random(-15, 15),
          rotateZ: gsap.utils.random(-15, 15),
          duration: 0.25, // Significantly faster flight
          ease: "power4.in", // Sharper exponential acceleration for extreme top-speed
        }, startTime);
      });

    }, rootRef);

    return () => ctx.revert();
  }, [play]);

  return (
    <div 
      ref={rootRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 9999, 
        backgroundColor: '#0D0D0D', // Turns transparent instantly before peel
        perspective: '900px',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
        pointerEvents: 'all'
      }}
    >
      {SHARDS.map((shard, i) => (
        <div
          key={`shard-${i}`}
          ref={(el) => shardsRef.current[i] = el}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#0D0D0D',
            clipPath: `polygon(${shard.clip})`,
            transformOrigin: shard.origin,
            willChange: 'transform, background-color',
            backfaceVisibility: 'visible'
          }}
        />
      ))}

      <svg 
        ref={linesGroupRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10
        }}
        preserveAspectRatio="none"
      >
        {LINES.map((line, i) => (
          <line
            key={`line-${i}`}
            ref={(el) => linesRef.current[i] = el}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="#F97316"
            strokeWidth="1.5"
            pathLength="100"
            style={{ willChange: 'stroke-dashoffset' }}
          />
        ))}
      </svg>
    </div>
  );
}

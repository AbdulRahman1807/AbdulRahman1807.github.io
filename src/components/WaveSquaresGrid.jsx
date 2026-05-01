import { useEffect, useRef } from 'react';

export default function WaveSquaresGrid() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const size = 30; // Grid cell spacing (smaller squares)
    const maxSize = 8; // Maximum size of a square (smaller)

    const render = () => {
      time += 0.02; // slower base slosh
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / size) + 2;
      const rows = Math.ceil(canvas.height / size) + 2;

      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += 5; // wave expansion speed
        r.life -= 0.02; // wave dissipation
        if (r.life <= 0) ripplesRef.current.splice(i, 1);
      }

      // Use the theme's accent color (orange: rgb 249, 115, 22)
      const rColor = 249;
      const gColor = 115;
      const bColor = 22;

      for (let y = -1; y < rows; y++) {
        for (let x = -1; x < cols; x++) {
          const cx = x * size + size / 2;
          const cy = y * size + size / 2;

          const wave1 = Math.sin(time * 0.8 + x * 0.1 + y * 0.15);
          const wave2 = Math.cos(time * 0.5 - x * 0.2 + y * 0.1);
          const wave3 = Math.sin(time * 0.4 + x * 0.05 - y * 0.2);
          const slosh = (wave1 + wave2 + wave3) / 3;

          let scale = 0.2 + slosh * 0.15; 
          let brightness = 0.01 + ((slosh + 1) / 2) * 0.03; // Very subtle base

          const dx = mouseRef.current.x - cx;
          const dy = mouseRef.current.y - cy;
          const distToMouse = Math.sqrt(dx * dx + dy * dy);
          if (distToMouse < 150) {
            const effect = 1 - (distToMouse / 150);
            scale += effect * 0.3;
            brightness += effect * 0.15;
          }

          for (const r of ripplesRef.current) {
            const rdx = r.x - cx;
            const rdy = r.y - cy;
            const distToRipple = Math.sqrt(rdx * rdx + rdy * rdy);
            
            const ringDist = Math.abs(distToRipple - r.radius);
            if (ringDist < 50) {
              const effect = (1 - (ringDist / 50)) * r.life;
              scale += effect * 0.4;
              brightness += effect * 0.2;
            }
          }

          scale = Math.min(Math.max(scale, 0.05), 1);
          brightness = Math.min(Math.max(brightness, 0.005), 0.5);

          const finalSize = maxSize * scale;

          ctx.fillStyle = `rgba(${rColor}, ${gColor}, ${bColor}, ${brightness})`;
          ctx.beginPath();
          ctx.rect(cx - finalSize / 2, cy - finalSize / 2, finalSize, finalSize);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleGlobalMouseMove = (e) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only track if inside the canvas area
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        mouseRef.current = { x: -1000, y: -1000 };
        return;
      }

      if (mouseRef.current.x === -1000) {
        ripplesRef.current.push({ x, y, radius: 0, life: 1 });
      } else {
        const dx = x - mouseRef.current.x;
        const dy = y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 30) { 
          ripplesRef.current.push({ x, y, radius: 0, life: 1 });
        }
      }
      mouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  );
}

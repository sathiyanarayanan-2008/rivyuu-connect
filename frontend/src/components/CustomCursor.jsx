import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    let animId;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        setPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth trailing animation loop
    const animate = () => {
      setTrailPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Detect hover over interactive elements
    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, input, select, .card, .chip')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, [pos.x, pos.y]);

  return (
    <>
      {/* Outer Glowing Ring */}
      <div
        className={`cursor-ring ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
        style={{
          transform: `translate3d(${trailPos.x - 20}px, ${trailPos.y - 20}px, 0)`,
        }}
      />
      {/* Inner Precision Dot */}
      <div
        className="cursor-dot"
        style={{
          transform: `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`,
        }}
      />

      <style>{`
        .cursor-ring {
          position: fixed;
          top: 0; left: 0;
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(118, 185, 0, 0.6);
          background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(6, 182, 212, 0.08) 70%, transparent 100%);
          pointer-events: none;
          z-index: 9999;
          transition: width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease;
          box-shadow: 0 0 15px rgba(118, 185, 0, 0.25), inset 0 0 10px rgba(124, 58, 237, 0.2);
          backdrop-filter: blur(1px);
        }
        .cursor-ring.hovered {
          width: 56px; height: 56px;
          border-color: rgba(6, 182, 212, 0.9);
          background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(124, 58, 237, 0.2) 70%, transparent 100%);
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.4), inset 0 0 15px rgba(6, 182, 212, 0.3);
        }
        .cursor-ring.clicked {
          transform: scale(0.8);
          border-color: var(--primary-light);
        }
        .cursor-dot {
          position: fixed;
          top: 0; left: 0;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--nvidia-green);
          box-shadow: 0 0 10px #76b900, 0 0 20px #06b6d4;
          pointer-events: none;
          z-index: 10000;
        }
        @media (max-width: 768px) {
          .cursor-ring, .cursor-dot { display: none; }
        }
      `}</style>
    </>
  );
}

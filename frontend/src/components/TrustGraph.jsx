import { useEffect, useRef } from 'react';
import { TRUST_GRAPH_DATA } from '../utils/mockData.js';

export default function TrustGraph({ data = TRUST_GRAPH_DATA, height = 180 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const scores = data.scores;
    const labels = data.labels;
    const min = Math.min(...scores) - 5;
    const max = Math.max(...scores) + 5;
    const padL = 40, padR = 20, padT = 20, padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const toX = (i) => padL + (i / (scores.length - 1)) * chartW;
    const toY = (v) => padT + chartH - ((v - min) / (max - min)) * chartH;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (i / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
    }

    // Gradient fill under curve
    const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
    grad.addColorStop(0, 'rgba(124,58,237,0.4)');
    grad.addColorStop(1, 'rgba(124,58,237,0)');

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(scores[0]));
    scores.forEach((s, i) => {
      if (i === 0) return;
      const x0 = toX(i - 1), y0 = toY(scores[i - 1]);
      const x1 = toX(i), y1 = toY(s);
      const cpX = (x0 + x1) / 2;
      ctx.bezierCurveTo(cpX, y0, cpX, y1, x1, y1);
    });
    ctx.lineTo(toX(scores.length - 1), H - padB);
    ctx.lineTo(toX(0), H - padB);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    const lineGrad = ctx.createLinearGradient(0, 0, W, 0);
    lineGrad.addColorStop(0, '#7c3aed');
    lineGrad.addColorStop(1, '#06b6d4');

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(scores[0]));
    scores.forEach((s, i) => {
      if (i === 0) return;
      const x0 = toX(i - 1), y0 = toY(scores[i - 1]);
      const x1 = toX(i), y1 = toY(s);
      const cpX = (x0 + x1) / 2;
      ctx.bezierCurveTo(cpX, y0, cpX, y1, x1, y1);
    });
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Data points
    scores.forEach((s, i) => {
      const x = toX(i), y = toY(s);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#7c3aed';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Labels
    ctx.fillStyle = 'rgba(148,163,184,0.8)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
      ctx.fillText(label, toX(i), H - 8);
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = Math.round(min + (i / 4) * (max - min));
      const y = padT + chartH - (i / 4) * chartH;
      ctx.fillText(val, padL - 6, y + 4);
    }
  }, [data]);

  return (
    <div className="trust-graph-wrap">
      <div className="trust-graph-header">
        <span className="trust-graph-title">Trust Score Progression</span>
        <span className="trust-score-badge">
          {data.scores[data.scores.length - 1]}
          <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>/100</span>
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={height}
        style={{ width: '100%', height: `${height}px` }}
      />
      <style>{`
        .trust-graph-wrap {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 20px;
        }
        .trust-graph-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .trust-graph-title {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .trust-score-badge {
          font-size: 1.5rem;
          font-weight: 800;
          font-family: var(--font-display);
          background: var(--grad-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}

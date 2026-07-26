import { formatNumber, getTrustColor, getLevelColor } from '../utils/helpers.js';

export default function Leaderboard({ entries }) {
  const podiumColors = ['#f59e0b', '#94a3b8', '#d97706'];
  const podiumEmojis = ['🥇', '🥈', '🥉'];

  return (
    <div className="leaderboard-wrap">
      {/* Podium Top 3 */}
      <div className="podium">
        {entries.slice(0, 3).map((entry, i) => {
          const order = [1, 0, 2][i]; // 2nd, 1st, 3rd display order
          const realEntry = entries[order];
          const rank = order + 1;
          return (
            <div
              key={realEntry.user.id}
              className={`podium-item podium-${rank}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="podium-avatar" style={{ border: `3px solid ${podiumColors[rank - 1]}` }}>
                <div
                  className="avatar-placeholder"
                  style={{
                    width: rank === 1 ? 70 : 56,
                    height: rank === 1 ? 70 : 56,
                    fontSize: rank === 1 ? '1.3rem' : '1rem',
                    background: `linear-gradient(135deg, ${getLevelColor(realEntry.user.level)}66, ${getLevelColor(realEntry.user.level)}33)`,
                  }}
                >
                  {realEntry.user.initials}
                </div>
              </div>
              <div className="podium-crown">{podiumEmojis[rank - 1]}</div>
              <div className="podium-name">{realEntry.user.name.split(' ')[0]}</div>
              <div className="podium-score" style={{ color: podiumColors[rank - 1] }}>
                {realEntry.user.trustScore}
              </div>
              <div className="podium-base" style={{
                height: rank === 1 ? 80 : rank === 2 ? 60 : 40,
                background: `linear-gradient(180deg, ${podiumColors[rank - 1]}30, ${podiumColors[rank - 1]}10)`,
                borderTop: `2px solid ${podiumColors[rank - 1]}60`,
              }}>
                <span className="podium-rank">#{rank}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="lb-table">
        {entries.map((entry, i) => (
          <div key={entry.user.id} className={`lb-row ${i < 3 ? 'lb-row-top' : ''} animate-fade-in`}
            style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="lb-rank">
              {i < 3
                ? <span className="rank-medal">{podiumEmojis[i]}</span>
                : <span className="rank-num">#{entry.rank}</span>
              }
            </div>
            <div className="avatar-placeholder avatar-sm" style={{
              background: `linear-gradient(135deg, ${getLevelColor(entry.user.level)}66, ${getLevelColor(entry.user.level)}33)`,
              fontSize: '0.75rem',
            }}>
              {entry.user.initials}
            </div>
            <div className="lb-user-info">
              <div className="lb-name">{entry.user.name}</div>
              <div className="lb-meta">
                <span style={{ color: getLevelColor(entry.user.level), fontSize: '0.72rem', fontWeight: 700 }}>
                  ◆ {entry.user.level}
                </span>
                <span>•</span>
                <span>{entry.weeklyReviews} reviews this week</span>
                <span>•</span>
                <span>🔥 {entry.streak} day streak</span>
              </div>
            </div>
            <div className="lb-stats">
              <div className="lb-trust" style={{ color: getTrustColor(entry.user.trustScore) }}>
                {entry.user.trustScore}
                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>/100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>Trust</div>
            </div>
            <div className="lb-change">
              {entry.change === 0 && <span className="change-same">—</span>}
              {entry.change > 0 && <span className="change-up">▲{entry.change}</span>}
              {entry.change < 0 && <span className="change-down">▼{Math.abs(entry.change)}</span>}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .leaderboard-wrap {}
        .podium {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 12px;
          padding: 20px 0 0;
          margin-bottom: 32px;
        }
        .podium-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeIn 0.5s ease both;
          gap: 4px;
        }
        .podium-avatar {
          border-radius: 50%;
          padding: 3px;
          background: var(--bg-card);
        }
        .podium-crown { font-size: 1.5rem; margin-top: 6px; }
        .podium-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .podium-score {
          font-weight: 800;
          font-size: 1.1rem;
          font-family: var(--font-display);
        }
        .podium-base {
          width: 100%;
          min-width: 80px;
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 6px;
        }
        .podium-rank { font-weight: 700; color: var(--text-muted); font-size: 0.85rem; }
        .lb-table { display: flex; flex-direction: column; gap: 8px; }
        .lb-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          transition: all var(--transition-fast);
        }
        .lb-row:hover { border-color: var(--border); background: var(--bg-card-hover); }
        .lb-row-top { border-color: rgba(124,58,237,0.2); }
        .lb-rank { width: 36px; text-align: center; flex-shrink: 0; }
        .rank-medal { font-size: 1.3rem; }
        .rank-num { font-weight: 700; color: var(--text-muted); }
        .lb-user-info { flex: 1; min-width: 0; }
        .lb-name { font-weight: 600; font-size: 0.95rem; }
        .lb-meta { display: flex; gap: 6px; align-items: center; color: var(--text-muted); font-size: 0.76rem; margin-top: 2px; flex-wrap: wrap; }
        .lb-stats { text-align: center; flex-shrink: 0; }
        .lb-trust { font-weight: 800; font-size: 1.2rem; font-family: var(--font-display); }
        .lb-change { width: 40px; text-align: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }
        .change-up { color: var(--success-light); }
        .change-down { color: var(--danger-light); }
        .change-same { color: var(--text-muted); }
      `}</style>
    </div>
  );
}

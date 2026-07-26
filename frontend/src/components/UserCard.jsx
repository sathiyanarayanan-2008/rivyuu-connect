import { Link } from 'react-router-dom';
import { formatNumber, getTrustColor, getLevelColor } from '../utils/helpers.js';
import { BADGES_CATALOG } from '../utils/mockData.js';

export default function UserCard({ user, rank }) {
  const levelColor = getLevelColor(user.level);
  const earnedBadges = BADGES_CATALOG.filter(b => user.badges?.includes(b.id)).slice(0, 3);

  return (
    <div className="user-card card">
      {rank && (
        <div className="rank-badge" style={{
          background: rank <= 3 ? ['#f59e0b', '#94a3b8', '#d97706'][rank - 1] + '22' : 'var(--bg-elevated)',
          color: rank <= 3 ? ['#f59e0b', '#94a3b8', '#d97706'][rank - 1] : 'var(--text-muted)',
          borderColor: rank <= 3 ? ['#f59e0b', '#94a3b8', '#d97706'][rank - 1] + '44' : 'var(--border-subtle)',
        }}>
          {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
        </div>
      )}

      <div className="user-card-header">
        <div className="avatar-placeholder avatar-lg" style={{
          background: `linear-gradient(135deg, ${levelColor}66, ${levelColor}33)`,
          border: `2px solid ${levelColor}44`,
          fontSize: '1.1rem',
        }}>
          {user.initials}
        </div>
        <div className="user-info">
          <div className="flex items-center gap-2">
            <h3 className="user-name">{user.name}</h3>
            {user.isVerified && <span title="Verified">✅</span>}
          </div>
          <div className="username">@{user.username}</div>
          <div className="user-level" style={{ color: levelColor }}>
            ◆ {user.level}
          </div>
        </div>
      </div>

      <p className="user-bio">{user.bio || 'No bio provided'}</p>

      <div className="user-stats">
        <div className="user-stat">
          <div className="stat-num" style={{ color: getTrustColor(user.trustScore) }}>
            {user.trustScore}
          </div>
          <div className="stat-lbl">Trust</div>
        </div>
        <div className="stat-divider" />
        <div className="user-stat">
          <div className="stat-num">{formatNumber(user.reviewCount)}</div>
          <div className="stat-lbl">Reviews</div>
        </div>
        <div className="stat-divider" />
        <div className="user-stat">
          <div className="stat-num">{formatNumber(user.helpfulVotes)}</div>
          <div className="stat-lbl">Helpful</div>
        </div>
        <div className="stat-divider" />
        <div className="user-stat">
          <div className="stat-num">{formatNumber(user.followers)}</div>
          <div className="stat-lbl">Followers</div>
        </div>
      </div>

      {earnedBadges.length > 0 && (
        <div className="user-badges">
          {earnedBadges.map(b => (
            <span key={b.id} className="mini-badge" title={b.label} style={{ background: b.color + '22', border: `1px solid ${b.color}44` }}>
              {b.icon} <span>{b.label}</span>
            </span>
          ))}
          {(user.badges?.length || 0) > 3 && (
            <span className="mini-badge" style={{ background: 'var(--bg-elevated)' }}>
              +{user.badges.length - 3}
            </span>
          )}
        </div>
      )}

      <Link to="/profile" className="btn btn-secondary" style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}>
        View Profile
      </Link>

      <style>{`
        .user-card { position: relative; }
        .rank-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.85rem;
          border: 1px solid;
        }
        .user-card-header {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .user-info { flex: 1; }
        .user-name { font-size: 1rem; font-weight: 700; margin: 0; }
        .username { color: var(--text-muted); font-size: 0.8rem; margin-top: 2px; }
        .user-level { font-size: 0.78rem; font-weight: 700; margin-top: 4px; }
        .user-bio {
          color: var(--text-muted);
          font-size: 0.82rem;
          line-height: 1.5;
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .user-stats {
          display: flex;
          background: var(--bg-elevated);
          border-radius: var(--radius-md);
          padding: 10px;
          margin-bottom: 12px;
          gap: 0;
        }
        .user-stat { flex: 1; text-align: center; }
        .stat-num { font-weight: 800; font-size: 1rem; font-family: var(--font-display); }
        .stat-lbl { font-size: 0.7rem; color: var(--text-muted); margin-top: 2px; }
        .stat-divider { width: 1px; background: var(--border-subtle); margin: 4px 0; }
        .user-badges { display: flex; flex-wrap: wrap; gap: 6px; }
        .mini-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}

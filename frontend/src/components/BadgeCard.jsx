import { BADGES_CATALOG } from '../utils/mockData.js';
import { getBadgeRarityColor } from '../utils/helpers.js';

export default function BadgeCard({ badgeId, earned = true, size = 'md' }) {
  const badge = BADGES_CATALOG.find(b => b.id === badgeId);
  if (!badge) return null;

  const isSmall = size === 'sm';

  return (
    <div
      className={`badge-card ${earned ? 'earned' : 'locked'} ${isSmall ? 'badge-card-sm' : ''}`}
      title={badge.description}
    >
      <div className="badge-icon-wrap" style={{ background: earned ? `${badge.color}22` : 'var(--bg-elevated)', borderColor: earned ? badge.color + '44' : 'var(--border-subtle)' }}>
        <span className="badge-emoji" style={{ filter: earned ? 'none' : 'grayscale(100%) opacity(0.4)' }}>
          {badge.icon}
        </span>
      </div>
      {!isSmall && (
        <div className="badge-info">
          <div className="badge-name">{badge.label}</div>
          <div
            className="badge-rarity"
            style={{ color: earned ? getBadgeRarityColor(badge.rarity) : 'var(--text-muted)' }}
          >
            {badge.rarity}
          </div>
          {!earned && <div className="badge-locked-text">🔒 Locked</div>}
        </div>
      )}

      <style>{`
        .badge-card {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px;
          transition: all var(--transition-fast);
          cursor: default;
        }
        .badge-card.earned:hover {
          border-color: var(--border);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .badge-card.locked { opacity: 0.6; }
        .badge-card-sm {
          padding: 6px;
          gap: 0;
          border-radius: var(--radius-sm);
          width: 44px;
          height: 44px;
          justify-content: center;
        }
        .badge-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid;
          flex-shrink: 0;
        }
        .badge-card-sm .badge-icon-wrap {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent !important;
        }
        .badge-emoji { font-size: 1.4rem; line-height: 1; }
        .badge-card-sm .badge-emoji { font-size: 1.1rem; }
        .badge-info { flex: 1; min-width: 0; }
        .badge-name { font-weight: 600; font-size: 0.85rem; color: var(--text-primary); }
        .badge-rarity { font-size: 0.75rem; font-weight: 600; margin-top: 2px; }
        .badge-locked-text { font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; }
      `}</style>
    </div>
  );
}

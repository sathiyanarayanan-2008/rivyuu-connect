import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { MOCK_REVIEWS, BADGES_CATALOG } from '../utils/mockData.js';
import { formatNumber, getLevelColor, getTrustColor, xpPercent, timeAgo } from '../utils/helpers.js';
import TrustGraph from '../components/TrustGraph.jsx';
import BadgeCard from '../components/BadgeCard.jsx';
import ReviewTimeline from '../components/ReviewTimeline.jsx';
import RatingStars from '../components/RatingStars.jsx';

const TABS = ['Overview', 'Reviews', 'Badges', 'Trust Graph'];

export default function Profile() {
  const { user } = useAuth();
  const [tab, setTab] = useState('Overview');

  if (!user) return (
    <div className="page-wrapper">
      <div className="page-content" style={{ textAlign: 'center', paddingTop: 80 }}>
        <p>Please <a href="/login" style={{ color: 'var(--primary-light)' }}>log in</a> to view your profile.</p>
      </div>
    </div>
  );

  const userReviews = MOCK_REVIEWS.filter(r => r.userId === user.id || true).slice(0, 5);
  const earnedBadges = BADGES_CATALOG.filter(b => (user.badges || []).includes(b.id));
  const lockedBadges = BADGES_CATALOG.filter(b => !(user.badges || []).includes(b.id));
  const levelColor = getLevelColor(user.level);
  const xpPct = xpPercent(user.xp || 0, user.nextLevelXp || 1000);

  const avgRating = userReviews.length
    ? (userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length).toFixed(1)
    : 0;

  return (
    <div className="page-wrapper">
      {/* Profile Hero */}
      <div className="profile-hero">
        <div className="orb orb-primary" style={{ width: 400, height: 400, top: -150, left: -80 }} />
        <div className="container">
          <div className="profile-hero-inner">
            {/* Avatar */}
            <div className="profile-avatar-wrap">
              <div className="avatar-placeholder" style={{
                width: 100, height: 100, fontSize: '1.8rem',
                background: `linear-gradient(135deg, ${levelColor}88, ${levelColor}33)`,
                border: `3px solid ${levelColor}66`,
              }}>
                {user.initials}
              </div>
              <div className="avatar-level-badge" style={{ background: levelColor }}>
                ◆ {user.level}
              </div>
            </div>

            {/* Info */}
            <div className="profile-info">
              <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
                <h1 className="profile-name">{user.name}</h1>
                {user.isVerified && <span className="badge badge-success">✅ Verified</span>}
                {earnedBadges.slice(0, 2).map(b => (
                  <span key={b.id} className="badge badge-primary">{b.icon} {b.label}</span>
                ))}
              </div>
              <div className="profile-username">@{user.username}</div>
              <p className="profile-bio">{user.bio || 'No bio provided'}</p>
              {user.location && (
                <div className="profile-location">📍 {user.location}</div>
              )}

              {/* XP Bar */}
              <div className="xp-bar-wrap">
                <div className="xp-bar-labels">
                  <span>{user.level}</span>
                  <span className="xp-text">{formatNumber(user.xp || 0)} / {formatNumber(user.nextLevelXp || 1000)} XP</span>
                  <span>Next Level</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${xpPct}%` }} />
                </div>
              </div>
            </div>

            {/* Trust Score */}
            <div className="trust-score-panel">
              <div className="trust-ring-display">
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-elevated)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke={getTrustColor(user.trustScore)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - user.trustScore / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: getTrustColor(user.trustScore) }}>
                    {user.trustScore}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TRUST</div>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Score out of 100
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            {[
              { label: 'Reviews', value: formatNumber(userReviews.length) },
              { label: 'Helpful Votes', value: formatNumber(user.helpfulVotes || 0) },
              { label: 'Followers', value: formatNumber(user.followers || 0) },
              { label: 'Following', value: formatNumber(user.following || 0) },
              { label: 'Badges', value: earnedBadges.length },
              { label: 'Avg Rating', value: `★ ${avgRating}` },
            ].map(s => (
              <div key={s.label} className="profile-stat-item">
                <div className="profile-stat-value">{s.value}</div>
                <div className="profile-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="page-content">
        <div className="tabs">
          {TABS.map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Overview' && (
          <div className="grid-2" style={{ gap: 20 }}>
            <div>
              <h3 className="section-title" style={{ marginBottom: 16 }}>Recent Reviews</h3>
              {userReviews.slice(0, 3).map(r => (
                <div key={r.id} className="card" style={{ marginBottom: 12, padding: 16 }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                    <span>{r.businessLogo}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.businessName}</span>
                    <RatingStars rating={r.rating} size="sm" />
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{timeAgo(r.timestamp)}</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: 4 }}>{r.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{r.content.slice(0, 100)}...</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="section-title" style={{ marginBottom: 16 }}>Badges Earned</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {earnedBadges.map(b => <BadgeCard key={b.id} badgeId={b.id} earned />)}
              </div>
            </div>
          </div>
        )}

        {tab === 'Reviews' && (
          <ReviewTimeline reviews={userReviews} />
        )}

        {tab === 'Badges' && (
          <div>
            <h3 style={{ marginBottom: 16 }}>Earned Badges ({earnedBadges.length})</h3>
            <div className="badges-grid">
              {earnedBadges.map(b => <BadgeCard key={b.id} badgeId={b.id} earned />)}
            </div>
            {lockedBadges.length > 0 && (
              <>
                <h3 style={{ margin: '24px 0 16px', color: 'var(--text-muted)' }}>Locked Badges</h3>
                <div className="badges-grid">
                  {lockedBadges.map(b => <BadgeCard key={b.id} badgeId={b.id} earned={false} />)}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'Trust Graph' && (
          <TrustGraph height={250} />
        )}
      </div>

      <style>{`
        .profile-hero {
          background: var(--grad-hero);
          border-bottom: 1px solid var(--border-subtle);
          padding: 80px 0 32px;
          position: relative;
          overflow: hidden;
        }
        .profile-hero-inner {
          display: flex;
          gap: 28px;
          align-items: flex-start;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .profile-avatar-wrap { position: relative; flex-shrink: 0; }
        .avatar-level-badge {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
        }
        .profile-info { flex: 1; min-width: 200px; }
        .profile-name { font-size: 1.8rem; margin-bottom: 4px; }
        .profile-username { color: var(--text-muted); font-size: 0.875rem; margin-bottom: 10px; }
        .profile-bio { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 8px; }
        .profile-location { color: var(--text-muted); font-size: 0.82rem; margin-bottom: 14px; }
        .xp-bar-wrap { max-width: 400px; }
        .xp-bar-labels { display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 6px; }
        .xp-text { font-weight: 600; color: var(--primary-light); }
        .trust-score-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .trust-ring-display { position: relative; display: flex; align-items: center; justify-content: center; }
        .profile-stats {
          display: flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 16px;
          gap: 0;
        }
        .profile-stat-item {
          flex: 1;
          text-align: center;
          padding: 8px 0;
          border-right: 1px solid var(--border-subtle);
        }
        .profile-stat-item:last-child { border-right: none; }
        .profile-stat-value { font-weight: 800; font-size: 1.1rem; font-family: var(--font-display); }
        .profile-stat-label { font-size: 0.7rem; color: var(--text-muted); margin-top: 2px; }
        .badges-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
        @media (max-width: 768px) {
          .profile-hero-inner { flex-direction: column; }
          .trust-score-panel { flex-direction: row; gap: 16px; }
          .profile-stats { flex-wrap: wrap; }
          .profile-stat-item { min-width: 33%; border-right: none; border-bottom: 1px solid var(--border-subtle); }
        }
      `}</style>
    </div>
  );
}


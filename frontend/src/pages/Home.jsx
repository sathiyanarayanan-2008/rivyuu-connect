import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import { MOCK_REVIEWS, MOCK_BUSINESSES, MOCK_USERS } from '../utils/mockData.js';
import { formatNumber } from '../utils/helpers.js';
import { voteHelpful } from '../services/reviewService.js';

const CATEGORIES = ['All', 'Food', 'E-Commerce', 'Transport', 'Beauty', 'Tech'];

export default function Home() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [search, setSearch] = useState('');

  const filteredReviews = reviews
    .filter(r => {
      const matchesSearch = !search || r.title.toLowerCase().includes(search.toLowerCase())
        || r.businessName.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === 'helpful') return b.helpful - a.helpful;
      if (sortBy === 'rating-high') return b.rating - a.rating;
      if (sortBy === 'rating-low') return a.rating - b.rating;
      return 0;
    });

  const handleVote = (id, type) => voteHelpful(id, type);

  const stats = [
    { icon: '📝', label: 'Reviews Today', value: '1,284', change: '+12%' },
    { icon: '🏆', label: 'Active Reviewers', value: '48K', change: '+8%' },
    { icon: '🤖', label: 'AI Verified', value: '94.2%', change: '+0.5%' },
    { icon: '⭐', label: 'Avg Trust Score', value: '81.4', change: '+2.1' },
  ];

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="hero-section">
        <div className="orb orb-primary" style={{ width: 500, height: 500, top: -150, left: -100 }} />
        <div className="orb orb-secondary" style={{ width: 400, height: 400, top: -100, right: -100 }} />
        <div className="hero-content">
          {!user && (
            <div className="hero-pill animate-fade-in">
              ✨ Trusted by 48,000+ reviewers
            </div>
          )}
          <h1 className="hero-title animate-fade-in delay-1">
            {user ? (
              <>Welcome back, <span className="text-gradient">{user.name.split(' ')[0]}</span> 👋</>
            ) : (
              <>Reviews You Can <span className="text-gradient">Actually Trust</span></>
            )}
          </h1>
          <p className="hero-subtitle animate-fade-in delay-2">
            {user
              ? 'Your trust score is growing. Keep writing impactful reviews!'
              : 'AI-powered verification, reputation badges, and real community trust scores.'
            }
          </p>
          {!user && (
            <div className="hero-cta animate-fade-in delay-3">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started Free →</Link>
              <Link to="/leaderboard" className="btn btn-ghost btn-lg">View Leaderboard</Link>
            </div>
          )}
          {user && (
            <div className="hero-cta animate-fade-in delay-3">
              <Link to="/review/new" className="btn btn-primary btn-lg">✍️ Write a Review</Link>
              <Link to="/profile" className="btn btn-ghost btn-lg">Your Profile</Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-item animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="stat-item-icon">{s.icon}</span>
                <div>
                  <div className="stat-item-value">{s.value}</div>
                  <div className="stat-item-label">{s.label}</div>
                </div>
                <span className="stat-item-change positive">{s.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-content">
        <div className="home-layout">
          {/* Feed */}
          <div className="feed-col">
            {/* Filters */}
            <div className="feed-controls card" style={{ padding: '16px 20px', marginBottom: 20 }}>
              <div className="search-bar" style={{ marginBottom: 14 }}>
                <span className="search-icon">🔍</span>
                <input
                  id="home-search"
                  type="text"
                  className="form-input"
                  placeholder="Search reviews, businesses..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: 42 }}
                />
              </div>
              <div className="filter-row">
                <div className="category-chips">
                  {CATEGORIES.map(c => (
                    <button key={c} className={`chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
                  ))}
                </div>
                <select
                  className="form-input form-select"
                  style={{ width: 'auto', fontSize: '0.85rem', padding: '6px 32px 6px 10px' }}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="rating-high">Highest Rated</option>
                  <option value="rating-low">Lowest Rated</option>
                </select>
              </div>
            </div>

            {/* Review Feed */}
            <div className="review-feed">
              {filteredReviews.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🔍</span>
                  <div className="empty-title">No reviews found</div>
                  <div className="empty-desc">Try a different search or category</div>
                </div>
              ) : (
                filteredReviews.map((r, i) => (
                  <div key={r.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                    <ReviewCard review={r} onVote={handleVote} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sidebar-col">
            {/* Top Businesses */}
            <div className="card sidebar-card">
              <h3 className="sidebar-title">🏢 Top Rated Businesses</h3>
              <div className="biz-list">
                {MOCK_BUSINESSES.slice(0, 4).map((b, i) => (
                  <div key={b.id} className="biz-item">
                    <div className="biz-rank">#{i + 1}</div>
                    <span className="biz-logo">{b.logo}</span>
                    <div className="biz-info">
                      <div className="biz-name">{b.name}</div>
                      <div className="biz-cat">{b.category}</div>
                    </div>
                    <div className="biz-rating">
                      <span className="biz-score" style={{ color: 'var(--accent)' }}>★ {b.rating}</span>
                      <span className="biz-count">{formatNumber(b.reviewCount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Reviewers */}
            <div className="card sidebar-card">
              <div className="section-header" style={{ marginBottom: 16 }}>
                <h3 className="sidebar-title">🏆 Top Reviewers</h3>
                <Link to="/leaderboard" style={{ color: 'var(--primary-light)', fontSize: '0.8rem' }}>View all</Link>
              </div>
              <div className="reviewer-list">
                {MOCK_USERS.slice(0, 4).map((u, i) => (
                  <div key={u.id} className="reviewer-item">
                    <div className="reviewer-rank">#{i + 1}</div>
                    <div className="avatar-placeholder avatar-sm" style={{ fontSize: '0.7rem' }}>{u.initials}</div>
                    <div className="reviewer-info">
                      <div className="reviewer-name">{u.name}</div>
                      <div className="reviewer-meta">Trust: {u.trustScore}</div>
                    </div>
                    <div className="reviewer-badge badge badge-primary" style={{ fontSize: '0.68rem' }}>
                      {u.level}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review CTA */}
            <div className="cta-card">
              <div className="orb orb-primary" style={{ width: 200, height: 200, top: -60, right: -60 }} />
              <h3 style={{ marginBottom: 8, position: 'relative' }}>Share Your Experience</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 16, position: 'relative' }}>
                Write a review and earn XP, badges, and community trust.
              </p>
              <Link to="/review/new" className="btn btn-primary" style={{ position: 'relative' }}>
                ✍️ Write a Review
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .hero-section {
          background: var(--grad-hero);
          padding: 80px 24px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--border-subtle);
        }
        .hero-content { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: var(--radius-full);
          padding: 6px 16px;
          font-size: 0.82rem;
          color: var(--primary-light);
          font-weight: 500;
          margin-bottom: 20px;
        }
        .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .hero-subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.7;
          margin-bottom: 28px;
        }
        .hero-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .stats-bar {
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          padding: 20px 0;
        }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border-right: 1px solid var(--border-subtle);
        }
        .stat-item:last-child { border-right: none; }
        .stat-item-icon { font-size: 1.5rem; }
        .stat-item-value { font-weight: 800; font-size: 1.1rem; font-family: var(--font-display); }
        .stat-item-label { font-size: 0.72rem; color: var(--text-muted); }
        .stat-item-change { font-size: 0.75rem; font-weight: 600; margin-left: auto; }
        .stat-item-change.positive { color: var(--success-light); }
        .home-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: flex-start; }
        .feed-col {}
        .sidebar-col { display: flex; flex-direction: column; gap: 16px; }
        .sidebar-card { padding: 20px; }
        .sidebar-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 14px; }
        .filter-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .category-chips { display: flex; gap: 6px; flex-wrap: wrap; }
        .review-feed { display: flex; flex-direction: column; gap: 16px; }
        .biz-list { display: flex; flex-direction: column; gap: 10px; }
        .biz-item { display: flex; align-items: center; gap: 8px; }
        .biz-rank { width: 20px; font-size: 0.72rem; color: var(--text-muted); font-weight: 700; flex-shrink: 0; }
        .biz-logo { font-size: 1.2rem; flex-shrink: 0; }
        .biz-info { flex: 1; min-width: 0; }
        .biz-name { font-weight: 600; font-size: 0.875rem; }
        .biz-cat { font-size: 0.72rem; color: var(--text-muted); }
        .biz-rating { text-align: right; flex-shrink: 0; }
        .biz-score { font-weight: 700; font-size: 0.875rem; display: block; }
        .biz-count { font-size: 0.7rem; color: var(--text-muted); }
        .reviewer-list { display: flex; flex-direction: column; gap: 10px; }
        .reviewer-item { display: flex; align-items: center; gap: 8px; }
        .reviewer-rank { width: 20px; font-size: 0.72rem; color: var(--text-muted); font-weight: 700; }
        .reviewer-info { flex: 1; }
        .reviewer-name { font-weight: 600; font-size: 0.85rem; }
        .reviewer-meta { font-size: 0.72rem; color: var(--text-muted); }
        .cta-card {
          background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1));
          border: 1px solid rgba(124,58,237,0.3);
          border-radius: var(--radius-lg);
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 1024px) { .home-layout { grid-template-columns: 1fr; } .sidebar-col { display: none; } }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .stat-item { border-right: none; border-bottom: 1px solid var(--border-subtle); } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}


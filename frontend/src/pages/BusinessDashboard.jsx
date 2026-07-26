import { useState } from 'react';
import { BUSINESS_ANALYTICS, MOCK_REVIEWS } from '../utils/mockData.js';
import { formatNumber } from '../utils/helpers.js';

function BarChart({ data, maxVal, color = 'var(--primary)' }) {
  return (
    <div className="bar-chart">
      {data.map((item, i) => (
        <div key={i} className="bar-col">
          <div className="bar-value">{item.value || item.reviews}</div>
          <div className="bar-wrap">
            <div
              className="bar-fill"
              style={{
                height: `${((item.value || item.reviews) / maxVal) * 100}%`,
                background: color,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          </div>
          <div className="bar-label">{item.month || item.name}</div>
        </div>
      ))}
      <style>{`
        .bar-chart { display:flex; align-items:flex-end; gap:8px; height:160px; padding-bottom:28px; position:relative; }
        .bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
        .bar-value { font-size:0.68rem; color:var(--text-muted); font-weight:600; }
        .bar-wrap { flex:1; width:100%; display:flex; align-items:flex-end; }
        .bar-fill {
          width:100%; border-radius:4px 4px 0 0;
          animation:barGrow 0.8s ease both;
          min-height:4px;
        }
        @keyframes barGrow { from { height:0; } }
        .bar-label { font-size:0.68rem; color:var(--text-muted); }
      `}</style>
    </div>
  );
}

function DonutChart({ data, total }) {
  const colors = ['#10b981', '#94a3b8', '#ef4444'];
  let offset = 0;
  const r = 60, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;
  const segments = Object.entries(data).map(([key, pct], i) => {
    const dash = (pct / 100) * circumference;
    const gap = circumference - dash;
    const seg = { key, pct, dash, gap, offset, color: colors[i] };
    offset += dash;
    return seg;
  });

  return (
    <div className="donut-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth="20" />
        {segments.map(s => (
          <circle
            key={s.key}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="20"
            strokeLinecap="butt"
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="800" fontFamily="'Space Grotesk', sans-serif">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="9">
          TOTAL
        </text>
      </svg>
      <div className="donut-legend">
        {segments.map(s => (
          <div key={s.key} className="legend-item">
            <div className="legend-dot" style={{ background: s.color }} />
            <span>{s.key.charAt(0).toUpperCase() + s.key.slice(1)}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{s.pct}%</span>
          </div>
        ))}
      </div>
      <style>{`
        .donut-wrap { display:flex; align-items:center; gap:20px; }
        .donut-legend { display:flex; flex-direction:column; gap:8px; }
        .legend-item { display:flex; align-items:center; gap:8px; font-size:0.8rem; color:var(--text-secondary); min-width:130px; }
        .legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
      `}</style>
    </div>
  );
}

export default function BusinessDashboard() {
  const [tab, setTab] = useState('overview');
  const a = BUSINESS_ANALYTICS;
  const recentReviews = MOCK_REVIEWS.slice(0, 3);

  const statCards = [
    { icon: '📝', label: 'Total Reviews', value: formatNumber(a.totalReviews), change: '+12%', color: 'var(--primary)' },
    { icon: '⭐', label: 'Avg Rating', value: a.averageRating, change: '+0.2', color: 'var(--accent)' },
    { icon: '🛡️', label: 'Trust Score', value: a.trustScore, change: '+5', color: 'var(--success)' },
    { icon: '💬', label: 'Response Rate', value: `${a.responseRate}%`, change: '+8%', color: 'var(--secondary)' },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-content">
        {/* Header */}
        <div className="bd-header">
          <div className="orb orb-primary" style={{ width: 300, height: 300, top: -120, right: -80 }} />
          <div className="bd-biz-info">
            <div className="bd-logo">🍕</div>
            <div>
              <h1 className="page-title" style={{ margin: 0 }}>Zomato Business Dashboard</h1>
              <div className="flex items-center gap-2" style={{ marginTop: 6 }}>
                <span className="badge badge-success">✅ Verified Business</span>
                <span className="badge badge-primary">🏆 Top Rated</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Joined Jan 2024</span>
              </div>
            </div>
          </div>
          <div className="bd-header-actions">
            <button className="btn btn-secondary">📤 Export Report</button>
            <button className="btn btn-primary">💬 Respond to Reviews</button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid-4" style={{ marginBottom: 28, gap: 16 }}>
          {statCards.map((s, i) => (
            <div key={i} className="card stat-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-icon" style={{ background: s.color + '20' }}>
                <span>{s.icon}</span>
              </div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-change positive">▲ {s.change} this month</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          {['overview', 'reviews', 'sentiment', 'categories'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid-2" style={{ gap: 20 }}>
            {/* Monthly Reviews Chart */}
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: 20 }}>Monthly Review Volume</h3>
              <BarChart
                data={a.monthlyData.map(d => ({ ...d, value: d.reviews }))}
                maxVal={Math.max(...a.monthlyData.map(d => d.reviews)) * 1.2}
                color="var(--primary)"
              />
            </div>

            {/* Sentiment Breakdown */}
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: 20 }}>Sentiment Breakdown</h3>
              <DonutChart data={a.sentimentBreakdown} total={formatNumber(a.totalReviews)} />
            </div>

            {/* Rating Distribution */}
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: 16 }}>Rating Distribution</h3>
              {Object.entries(a.ratingDistribution).reverse().map(([star, pct]) => (
                <div key={star} className="rating-dist-row">
                  <span className="rating-dist-star">{'★'.repeat(Number(star))}</span>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: Number(star) >= 4 ? 'var(--success)' : Number(star) === 3 ? 'var(--accent)' : 'var(--danger)' }} />
                  </div>
                  <span className="rating-dist-pct">{pct}%</span>
                </div>
              ))}
            </div>

            {/* Top Category Scores */}
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: 16 }}>Category Performance</h3>
              {a.topCategories.map(cat => (
                <div key={cat.name} className="category-row">
                  <div className="cat-name">{cat.name}</div>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${cat.score}%` }} />
                  </div>
                  <div className="cat-score" style={{ color: cat.score >= 80 ? 'var(--success-light)' : cat.score >= 65 ? 'var(--accent-light)' : 'var(--danger-light)' }}>
                    {cat.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ padding: '16px 20px' }}>
              <div className="flex items-center gap-3">
                <input id="bd-search" className="form-input" placeholder="Search reviews..." style={{ flex: 1 }} />
                <select className="form-input form-select" style={{ width: 160 }}>
                  <option>All Ratings</option>
                  <option>5 Stars</option>
                  <option>4 Stars</option>
                  <option>3 Stars</option>
                  <option>1-2 Stars</option>
                </select>
                <select className="form-input form-select" style={{ width: 160 }}>
                  <option>All Sentiments</option>
                  <option>Positive</option>
                  <option>Mixed</option>
                  <option>Negative</option>
                </select>
              </div>
            </div>
            {recentReviews.map(r => (
              <div key={r.id} className="card bd-review-row">
                <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                  <div className="avatar-placeholder avatar-sm" style={{ fontSize: '0.7rem' }}>U</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Anonymous Reviewer</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>★ {r.rating} • {r.aiLabel}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <button className="btn btn-secondary btn-sm">💬 Respond</button>
                  </div>
                </div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: 6 }}>{r.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{r.content.slice(0, 150)}...</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'sentiment' && (
          <div className="grid-2" style={{ gap: 20 }}>
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: 20 }}>Monthly Sentiment Score</h3>
              <BarChart
                data={a.monthlyData.map(d => ({ month: d.month, value: d.sentiment }))}
                maxVal={100}
                color="var(--success)"
              />
            </div>
            <div className="card">
              <h3 className="section-title" style={{ marginBottom: 16 }}>Sentiment Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                {[['😊 Positive', a.sentimentBreakdown.positive, 'success'], ['😐 Neutral', a.sentimentBreakdown.neutral, 'secondary'], ['😞 Negative', a.sentimentBreakdown.negative, 'danger']].map(([label, pct, type]) => (
                  <div key={label}>
                    <div className="flex justify-between" style={{ marginBottom: 6, fontSize: '0.875rem' }}>
                      <span>{label}</span>
                      <span style={{ fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: type === 'success' ? 'var(--success)' : type === 'danger' ? 'var(--danger)' : 'var(--secondary)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'categories' && (
          <div className="card">
            <h3 className="section-title" style={{ marginBottom: 20 }}>Detailed Category Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {a.topCategories.map(cat => (
                <div key={cat.name} className="category-detail-row">
                  <div className="cat-detail-header">
                    <span style={{ fontWeight: 600 }}>{cat.name}</span>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: cat.score >= 80 ? 'var(--success-light)' : cat.score >= 65 ? 'var(--accent-light)' : 'var(--danger-light)' }}>
                      {cat.score}%
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: 10 }}>
                    <div className="progress-fill" style={{ width: `${cat.score}%` }} />
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Based on {Math.round(a.totalReviews * 0.7)} customer mentions
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .bd-header {
          display:flex; align-items:center; gap:20px;
          background:var(--grad-hero); border:1px solid var(--border-subtle);
          border-radius:var(--radius-xl); padding:28px;
          margin-bottom:28px; flex-wrap:wrap;
          position:relative; overflow:hidden;
        }
        .bd-logo { font-size:3rem; flex-shrink:0; }
        .bd-biz-info { flex:1; min-width:200px; position:relative; }
        .bd-header-actions { display:flex; gap:10px; flex-shrink:0; position:relative; }
        .rating-dist-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
        .rating-dist-star { font-size:0.8rem; color:var(--accent); min-width:70px; }
        .rating-dist-pct { font-size:0.8rem; font-weight:700; min-width:36px; text-align:right; color:var(--text-secondary); }
        .category-row { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
        .cat-name { font-size:0.875rem; min-width:150px; color:var(--text-secondary); }
        .cat-score { font-size:0.875rem; font-weight:700; min-width:40px; text-align:right; }
        .category-detail-row { padding-bottom:16px; border-bottom:1px solid var(--border-subtle); }
        .category-detail-row:last-child { border-bottom:none; }
        .cat-detail-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
        .bd-review-row { padding:20px; }
      `}</style>
    </div>
  );
}

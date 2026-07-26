import { LEADERBOARD_DATA } from '../utils/mockData.js';
import LeaderboardComponent from '../components/Leaderboard.jsx';

export default function LeaderboardPage() {
  const periods = ['This Week', 'This Month', 'All Time'];
  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <h1 className="page-title">🏆 Leaderboard</h1>
          </div>
          <p className="page-subtitle">Top trusted reviewers ranked by trust score, helpful votes & review quality</p>
        </div>

        {/* Period Tabs */}
        <div className="tabs" style={{ maxWidth: 360 }}>
          {periods.map((p, i) => (
            <button key={p} className={`tab-btn ${i === 0 ? 'active' : ''}`}>{p}</button>
          ))}
        </div>

        {/* Leaderboard Info */}
        <div className="grid-3" style={{ marginBottom: 32, gap: 16 }}>
          {[
            { icon: '🎯', label: 'Trust Score', desc: 'AI-verified authenticity metric combining review quality, consistency and community feedback' },
            { icon: '🔥', label: 'Weekly Streak', desc: 'Consecutive days with at least one review — maintain your streak to earn bonus XP!' },
            { icon: '👍', label: 'Helpful Votes', desc: 'How many times the community marked your reviews as helpful — quality over quantity.' },
          ].map(c => (
            <div key={c.label} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{c.label}</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <LeaderboardComponent entries={LEADERBOARD_DATA} />
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon-sm">R</div>
              <span className="footer-logo-text">Rivyuu<span style={{ color: 'var(--primary-light)' }}>Connect</span></span>
            </div>
            <p className="footer-tagline">
              The trust-based review ecosystem where authentic voices earn real influence.
            </p>
            <div className="social-links">
              {['𝕏', 'in', 'gh', 'yt'].map((s, i) => (
                <a key={i} href="#" className="social-link">{s}</a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/review/new">Write a Review</Link></li>
              <li><Link to="/business-dashboard">For Businesses</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/settings">Settings</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">About</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 RivyuuConnect. Built for Hackathon 2025. All rights reserved.</p>
          <div className="footer-badges">
            <span className="badge badge-primary">🤖 AI Powered</span>
            <span className="badge badge-success">✅ Trust Verified</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px 24px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .logo-icon-sm {
          width: 30px;
          height: 30px;
          background: var(--grad-primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #fff;
          font-size: 0.9rem;
        }
        .footer-logo-text {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1rem;
        }
        .footer-tagline {
          color: var(--text-muted);
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .social-links { display: flex; gap: 8px; }
        .social-link {
          width: 36px;
          height: 36px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 700;
          transition: all var(--transition-fast);
          text-decoration: none;
        }
        .social-link:hover {
          background: rgba(124,58,237,0.15);
          border-color: var(--primary);
          color: var(--primary-light);
        }
        .footer-heading {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        .footer-links { display: flex; flex-direction: column; gap: 10px; }
        .footer-links a {
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .footer-links a:hover { color: var(--primary-light); }
        .footer-bottom {
          border-top: 1px solid var(--border-subtle);
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-bottom p { color: var(--text-muted); font-size: 0.8rem; }
        .footer-badges { display: flex; gap: 8px; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
}

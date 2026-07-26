import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { to: '/review/new', label: 'Write Review', icon: '✍️' },
    { to: '/business-dashboard', label: 'Business', icon: '📊' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">R</div>
          <span className="logo-text">Rivyuu<span className="logo-accent">Connect</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links hide-mobile">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {user ? (
            <>
              <Link to="/notifications" className="btn btn-icon btn-ghost notif-btn" title="Notifications">
                <span>🔔</span>
                <span className="notif-dot"></span>
              </Link>
              <div className="dropdown">
                <button
                  className="avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  <div className="avatar-placeholder avatar-sm">{user.initials}</div>
                  <span className="hide-mobile user-name">{user.name.split(' ')[0]}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>▾</span>
                </button>
                {dropdownOpen && (
                  <>
                    <div className="dropdown-backdrop" onClick={() => setDropdownOpen(false)} />
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <div className="avatar-placeholder avatar-md">{user.initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Trust Score: {user.trustScore}</div>
                        </div>
                      </div>
                      <div className="divider" style={{ margin: '8px 0' }} />
                      <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        👤 My Profile
                      </Link>
                      <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        ⚙️ Settings
                      </Link>
                      <div className="divider" style={{ margin: '8px 0' }} />
                      <button className="dropdown-item" style={{ color: 'var(--danger-light)' }} onClick={handleLogout}>
                        🚪 Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link ${isActive(link.to) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
          {!user && (
            <div className="flex gap-3" style={{ padding: '12px 0' }}>
              <Link to="/login" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-navbar);
          background: rgba(8, 8, 15, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon {
          width: 36px;
          height: 36px;
          background: var(--grad-primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.1rem;
          color: #fff;
          box-shadow: 0 4px 12px rgba(124,58,237,0.4);
        }
        .logo-text {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        .logo-accent { color: var(--primary-light); }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          text-decoration: none;
        }
        .nav-link:hover { color: var(--text-primary); background: var(--bg-elevated); }
        .nav-link.active { color: var(--primary-light); background: rgba(124,58,237,0.12); }
        .nav-icon { font-size: 0.9rem; }
        .navbar-right { display: flex; align-items: center; gap: 8px; }
        .notif-btn { position: relative; }
        .notif-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--danger);
          border-radius: 50%;
          border: 2px solid var(--bg-base);
        }
        .avatar-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 6px 10px;
          cursor: pointer;
          transition: all var(--transition-fast);
          color: var(--text-primary);
          font-size: 0.875rem;
        }
        .avatar-btn:hover { border-color: var(--border); background: var(--bg-card-hover); }
        .dropdown-backdrop {
          position: fixed;
          inset: 0;
          z-index: calc(var(--z-dropdown) - 1);
        }
        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
        }
        .user-name { font-weight: 500; }
        .mobile-menu-btn {
          display: none;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 1.1rem;
          cursor: pointer;
        }
        .mobile-menu {
          background: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-weight: 500;
          text-decoration: none;
          transition: all var(--transition-fast);
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background: rgba(124,58,237,0.12);
          color: var(--primary-light);
        }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('sathyaviji2008@gmail.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div className="orb orb-primary" style={{ width: 400, height: 400, top: -100, left: -100 }} />
      <div className="orb orb-secondary" style={{ width: 300, height: 300, bottom: -50, right: -50 }} />

      <div className="auth-container animate-scale-in">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">R</div>
          <span className="auth-logo-text">Rivyuu<span className="text-gradient">Connect</span></span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to manage your platform & review reputation</p>

        {/* Demo hint */}
        <div className="demo-hint" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
          <span>👑</span>
          <div>
            <strong>Admin Account Pre-filled:</strong> <code>sathyaviji2008@gmail.com</code>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Password: <code>demo123</code> (Click <strong>Sign In</strong>)</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email address</label>
            <div className="input-icon-wrap">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                type="email"
                className="form-input"
                style={{ paddingLeft: 40 }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password
              <a href="#" className="forgot-link">Forgot password?</a>
            </label>
            <div className="input-icon-wrap">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type="password"
                className="form-input"
                style={{ paddingLeft: 40 }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button type="submit" id="login-btn" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-3">
                <span className="spinner" style={{ width: 18, height: 18 }} />
                Signing in...
              </span>
            ) : 'Sign In →'}
          </button>

          <div className="auth-divider">
            <span className="divider-line" />
            <span className="divider-text">or continue with</span>
            <span className="divider-line" />
          </div>

          <div className="social-auth">
            <button type="button" className="social-auth-btn">
              <span>G</span> Google
            </button>
            <button type="button" className="social-auth-btn">
              <span>𝕏</span> Twitter
            </button>
          </div>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">Create one free</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--grad-hero);
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .auth-container {
          background: rgba(19,19,31,0.8);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 40px;
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 1;
          box-shadow: var(--shadow-lg), var(--shadow-primary);
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }
        .auth-logo-icon {
          width: 40px;
          height: 40px;
          background: var(--grad-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.2rem;
          color: #fff;
          box-shadow: 0 4px 12px rgba(124,58,237,0.4);
        }
        .auth-logo-text {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.2rem;
        }
        .auth-title { font-size: 1.8rem; margin-bottom: 6px; }
        .auth-subtitle { color: var(--text-secondary); margin-bottom: 20px; }
        .demo-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .auth-form { display: flex; flex-direction: column; gap: 4px; }
        .auth-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          font-size: 0.875rem;
          color: var(--danger-light);
          margin-bottom: 8px;
        }
        .input-icon-wrap { position: relative; }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.9rem;
          pointer-events: none;
          z-index: 1;
        }
        .form-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .forgot-link {
          font-size: 0.78rem;
          color: var(--primary-light);
          text-decoration: none;
        }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--border-subtle);
        }
        .divider-text { font-size: 0.78rem; color: var(--text-muted); white-space: nowrap; }
        .social-auth { display: flex; gap: 12px; }
        .social-auth-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .social-auth-btn:hover {
          background: var(--bg-card-hover);
          border-color: var(--border);
          color: var(--text-primary);
        }
        .auth-switch {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-top: 20px;
        }
        .auth-switch a { color: var(--primary-light); font-weight: 600; text-decoration: none; }
        .auth-switch a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}


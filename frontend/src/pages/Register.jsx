import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (!agree) { setError('Please accept the terms'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#06b6d4', '#10b981'][strength];

  return (
    <div className="auth-page">
      <div className="orb orb-primary" style={{ width: 350, height: 350, top: -80, right: 50 }} />
      <div className="orb orb-secondary" style={{ width: 250, height: 250, bottom: -30, left: 20 }} />

      <div className="auth-container register-container animate-scale-in">
        <div className="auth-logo">
          <div className="auth-logo-icon">R</div>
          <span className="auth-logo-text">Rivyuu<span className="text-gradient">Connect</span></span>
        </div>

        <h1 className="auth-title">Join the community</h1>
        <p className="auth-subtitle">Start building your reviewer reputation today</p>

        {/* Feature pills */}
        <div className="register-perks">
          {['🏆 Earn badges', '🤖 AI trust score', '📊 Track impact'].map(p => (
            <span key={p} className="perk-pill">{p}</span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrap">
              <span className="input-icon">👤</span>
              <input id="reg-name" type="text" className="form-input" style={{ paddingLeft: 40 }}
                value={form.name} onChange={update('name')} placeholder="Your full name" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <div className="input-icon-wrap">
              <span className="input-icon">✉️</span>
              <input id="reg-email" type="email" className="form-input" style={{ paddingLeft: 40 }}
                value={form.email} onChange={update('email')} placeholder="you@example.com" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <span className="input-icon">🔒</span>
              <input id="reg-password" type="password" className="form-input" style={{ paddingLeft: 40 }}
                value={form.password} onChange={update('password')} placeholder="Create a strong password" required />
            </div>
            {form.password && (
              <div className="strength-bar">
                <div className="strength-track">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="strength-segment" style={{ background: i <= strength ? strengthColor : 'var(--bg-elevated)' }} />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-icon-wrap">
              <span className="input-icon">🔑</span>
              <input id="reg-confirm" type="password" className="form-input" style={{ paddingLeft: 40 }}
                value={form.confirm} onChange={update('confirm')} placeholder="Repeat password" required />
            </div>
          </div>

          <label className="terms-label">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
            <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
          </label>

          <button id="register-btn" type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-3">
                <span className="spinner" style={{ width: 18, height: 18 }} />
                Creating account...
              </span>
            ) : 'Create Account 🚀'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <style>{`
        .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--grad-hero); padding:24px; position:relative; overflow:hidden; }
        .auth-container { background:rgba(19,19,31,0.8); backdrop-filter:blur(20px); border:1px solid var(--border); border-radius:var(--radius-xl); padding:40px; width:100%; max-width:440px; position:relative; z-index:1; box-shadow:var(--shadow-lg),var(--shadow-primary); }
        .register-container { max-width: 480px; }
        .auth-logo { display:flex; align-items:center; gap:10px; margin-bottom:20px; }
        .auth-logo-icon { width:40px; height:40px; background:var(--grad-primary); border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1.2rem; color:#fff; box-shadow:0 4px 12px rgba(124,58,237,0.4); }
        .auth-logo-text { font-family:var(--font-display); font-weight:700; font-size:1.2rem; }
        .auth-title { font-size:1.8rem; margin-bottom:6px; }
        .auth-subtitle { color:var(--text-secondary); margin-bottom:16px; }
        .register-perks { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
        .perk-pill { background:rgba(124,58,237,0.12); border:1px solid rgba(124,58,237,0.25); border-radius:var(--radius-full); padding:4px 12px; font-size:0.78rem; color:var(--primary-light); font-weight:500; }
        .auth-form { display:flex; flex-direction:column; gap:4px; }
        .auth-error { display:flex; align-items:center; gap:8px; background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); border-radius:var(--radius-md); padding:10px 14px; font-size:0.875rem; color:var(--danger-light); margin-bottom:8px; }
        .input-icon-wrap { position:relative; }
        .input-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:0.9rem; pointer-events:none; z-index:1; }
        .strength-bar { display:flex; align-items:center; gap:8px; margin-top:6px; }
        .strength-track { display:flex; gap:4px; flex:1; }
        .strength-segment { height:4px; flex:1; border-radius:var(--radius-full); transition:background 0.3s ease; }
        .strength-label { font-size:0.75rem; font-weight:600; min-width:40px; text-align:right; }
        .terms-label { display:flex; align-items:flex-start; gap:10px; font-size:0.82rem; color:var(--text-secondary); cursor:pointer; margin:8px 0; }
        .terms-label input { margin-top:2px; accent-color:var(--primary); }
        .terms-label a { color:var(--primary-light); text-decoration:none; }
        .auth-switch { text-align:center; color:var(--text-muted); font-size:0.875rem; margin-top:20px; }
        .auth-switch a { color:var(--primary-light); font-weight:600; text-decoration:none; }
      `}</style>
    </div>
  );
}


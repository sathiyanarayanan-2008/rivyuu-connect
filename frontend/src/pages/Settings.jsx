import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

const SECTION_TABS = ['Account', 'Notifications', 'Privacy', 'Appearance'];

export default function Settings() {
  const { user } = useAuth();
  const [tab, setTab] = useState('Account');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    email: user?.email || '',
  });
  const [notifSettings, setNotifSettings] = useState({
    helpfulVotes: true,
    badges: true,
    businessResponse: true,
    followers: false,
    weeklyDigest: true,
  });
  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    showReviews: true,
    allowFollow: true,
    showTrustScore: true,
  });

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ checked, onChange, label, description }) => (
    <div className="setting-row">
      <div className="setting-info">
        <div className="setting-label">{label}</div>
        {description && <div className="setting-desc">{description}</div>}
      </div>
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="toggle-slider" />
      </label>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="page-content" style={{ maxWidth: 800 }}>
        <div className="page-header">
          <h1 className="page-title">⚙️ Settings</h1>
          <p className="page-subtitle">Manage your account preferences and privacy settings</p>
        </div>

        <div className="settings-layout">
          {/* Sidebar Tabs */}
          <div className="settings-sidebar">
            {SECTION_TABS.map(t => (
              <button
                key={t}
                className={`settings-tab ${tab === t ? 'active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'Account' ? '👤' : t === 'Notifications' ? '🔔' : t === 'Privacy' ? '🔒' : '🎨'}
                {t}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="settings-content">
            {tab === 'Account' && (
              <div className="card settings-card">
                <h2 className="settings-section-title">Account Information</h2>

                <div className="avatar-section">
                  <div className="avatar-placeholder avatar-xl" style={{ fontSize: '1.5rem' }}>
                    {user?.initials}
                  </div>
                  <div>
                    <button className="btn btn-secondary btn-sm">📷 Change Avatar</button>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                      JPG, PNG or GIF. Max 5MB.
                    </div>
                  </div>
                </div>

                <div className="divider" />

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input id="settings-name" type="text" className="form-input" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-input form-textarea" rows={3} value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Tell the community about yourself..." />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input id="settings-location" type="text" className="form-input" value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="City, Country" />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input id="settings-email" type="email" className="form-input" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>

                <div className="divider" />

                <h3 className="settings-section-title" style={{ fontSize: '1rem' }}>Change Password</h3>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input id="settings-current-pwd" type="password" className="form-input" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input id="settings-new-pwd" type="password" className="form-input" placeholder="••••••••" />
                </div>

                <div className="settings-actions">
                  <button id="settings-save-btn" className="btn btn-primary" onClick={handleSave}>
                    {saved ? '✅ Saved!' : '💾 Save Changes'}
                  </button>
                  <button className="btn btn-ghost">Cancel</button>
                </div>

                <div className="divider" />
                <div className="danger-zone">
                  <h3 style={{ color: 'var(--danger-light)', marginBottom: 8 }}>⚠️ Danger Zone</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 12 }}>
                    Deleting your account is permanent and cannot be undone.
                  </p>
                  <button className="btn btn-danger">🗑️ Delete Account</button>
                </div>
              </div>
            )}

            {tab === 'Notifications' && (
              <div className="card settings-card">
                <h2 className="settings-section-title">Notification Preferences</h2>
                <Toggle
                  label="Helpful Votes"
                  description="When someone marks your review as helpful"
                  checked={notifSettings.helpfulVotes}
                  onChange={v => setNotifSettings(s => ({ ...s, helpfulVotes: v }))}
                />
                <Toggle
                  label="Badge Earned"
                  description="When you unlock a new badge"
                  checked={notifSettings.badges}
                  onChange={v => setNotifSettings(s => ({ ...s, badges: v }))}
                />
                <Toggle
                  label="Business Response"
                  description="When a business responds to your review"
                  checked={notifSettings.businessResponse}
                  onChange={v => setNotifSettings(s => ({ ...s, businessResponse: v }))}
                />
                <Toggle
                  label="New Followers"
                  description="When someone starts following you"
                  checked={notifSettings.followers}
                  onChange={v => setNotifSettings(s => ({ ...s, followers: v }))}
                />
                <Toggle
                  label="Weekly Digest"
                  description="A summary of your activity every Monday"
                  checked={notifSettings.weeklyDigest}
                  onChange={v => setNotifSettings(s => ({ ...s, weeklyDigest: v }))}
                />
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={handleSave}>
                  {saved ? '✅ Saved!' : '💾 Save Preferences'}
                </button>
              </div>
            )}

            {tab === 'Privacy' && (
              <div className="card settings-card">
                <h2 className="settings-section-title">Privacy Settings</h2>
                <Toggle
                  label="Public Profile"
                  description="Allow anyone to view your profile"
                  checked={privacySettings.showProfile}
                  onChange={v => setPrivacySettings(s => ({ ...s, showProfile: v }))}
                />
                <Toggle
                  label="Show Reviews Publicly"
                  description="Make your reviews visible to everyone"
                  checked={privacySettings.showReviews}
                  onChange={v => setPrivacySettings(s => ({ ...s, showReviews: v }))}
                />
                <Toggle
                  label="Allow Following"
                  description="Let other users follow you"
                  checked={privacySettings.allowFollow}
                  onChange={v => setPrivacySettings(s => ({ ...s, allowFollow: v }))}
                />
                <Toggle
                  label="Display Trust Score"
                  description="Show your trust score on your public profile"
                  checked={privacySettings.showTrustScore}
                  onChange={v => setPrivacySettings(s => ({ ...s, showTrustScore: v }))}
                />
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={handleSave}>
                  {saved ? '✅ Saved!' : '💾 Save Settings'}
                </button>
              </div>
            )}

            {tab === 'Appearance' && (
              <div className="card settings-card">
                <h2 className="settings-section-title">Appearance</h2>
                <div className="setting-row">
                  <div className="setting-info">
                    <div className="setting-label">Theme</div>
                    <div className="setting-desc">Choose your preferred color theme</div>
                  </div>
                </div>
                <div className="theme-options">
                  {['Dark (Default)', 'Dark Purple', 'Dark Cyan', 'AMOLED Black'].map((theme, i) => (
                    <button key={theme} className={`theme-option ${i === 0 ? 'selected' : ''}`}>
                      <div className="theme-preview" style={{
                        background: ['#08080f', '#1a0a2e', '#080f1a', '#000000'][i],
                        border: `2px solid ${['#7c3aed', '#9d5cf6', '#06b6d4', '#7c3aed'][i]}`,
                      }} />
                      <span>{theme}</span>
                    </button>
                  ))}
                </div>
                <div className="setting-row" style={{ marginTop: 20 }}>
                  <div className="setting-info">
                    <div className="setting-label">Font Size</div>
                  </div>
                  <input type="range" min="14" max="20" defaultValue="16" style={{ accentColor: 'var(--primary)' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .settings-layout { display:grid; grid-template-columns:200px 1fr; gap:20px; align-items:flex-start; }
        .settings-sidebar { display:flex; flex-direction:column; gap:4px; background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:8px; }
        .settings-tab {
          display:flex; align-items:center; gap:10px;
          padding:12px 14px; border-radius:var(--radius-md);
          color:var(--text-secondary); font-size:0.875rem; font-weight:500;
          transition:all var(--transition-fast); text-align:left;
          cursor:pointer;
        }
        .settings-tab:hover { background:var(--bg-elevated); color:var(--text-primary); }
        .settings-tab.active { background:rgba(124,58,237,0.15); color:var(--primary-light); }
        .settings-card { padding:28px; }
        .settings-section-title { font-size:1.1rem; font-weight:700; margin-bottom:20px; }
        .avatar-section { display:flex; align-items:center; gap:16px; margin-bottom:20px; }
        .setting-row { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:16px 0; border-bottom:1px solid var(--border-subtle); }
        .setting-row:last-of-type { border-bottom:none; }
        .setting-info { flex:1; }
        .setting-label { font-weight:500; font-size:0.9rem; }
        .setting-desc { color:var(--text-muted); font-size:0.78rem; margin-top:2px; }
        .settings-actions { display:flex; gap:12px; }
        .danger-zone { background:rgba(239,68,68,0.06); border:1px solid rgba(239,68,68,0.2); border-radius:var(--radius-md); padding:20px; }
        .theme-options { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
        .theme-option {
          display:flex; flex-direction:column; align-items:center; gap:8px;
          background:var(--bg-elevated); border:1px solid var(--border-subtle);
          border-radius:var(--radius-md); padding:12px; cursor:pointer;
          transition:all var(--transition-fast); font-size:0.8rem; color:var(--text-secondary);
        }
        .theme-option:hover { border-color:var(--border); color:var(--text-primary); }
        .theme-option.selected { border-color:var(--primary); color:var(--primary-light); }
        .theme-preview { width:100%; height:40px; border-radius:6px; }
        @media (max-width: 768px) { .settings-layout { grid-template-columns:1fr; } .settings-sidebar { flex-direction:row; flex-wrap:wrap; } }
      `}</style>
    </div>
  );
}


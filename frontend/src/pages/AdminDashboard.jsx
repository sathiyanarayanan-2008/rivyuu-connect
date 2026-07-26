import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { getLoginLogs, getAllUsers, recordLog } from '../services/authService.js';
import { formatNumber, timeAgo, getTrustColor, getLevelColor } from '../utils/helpers.js';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('logs'); // 'logs' | 'users' | 'overview'
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [copiedEmail, setCopiedEmail] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // refresh logs every 5s
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setLogs(getLoginLogs());
    setUsers(getAllUsers());
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = !search || 
      l.email.toLowerCase().includes(search.toLowerCase()) || 
      l.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || l.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredUsers = users.filter(u => 
    !search || 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    totalLogins: logs.filter(l => l.type === 'LOGIN' && l.status === 'SUCCESS').length,
    failedAttempts: logs.filter(l => l.status === 'FAILED').length,
    adminEmail: 'sathyaviji2008@gmail.com',
  };

  return (
    <div className="page-wrapper">
      <div className="page-content">
        {/* Admin Header */}
        <div className="admin-header card">
          <div className="admin-header-main">
            <div className="admin-avatar">👑</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="page-title" style={{ margin: 0 }}>System Admin Dashboard</h1>
                <span className="badge badge-primary">Super Admin</span>
              </div>
              <p className="admin-subtitle">
                Registered Owner Email: <strong style={{ color: 'var(--primary-light)' }}>sathyaviji2008@gmail.com</strong>
              </p>
            </div>
          </div>
          <div className="admin-actions">
            <button className="btn btn-secondary btn-sm" onClick={loadData}>
              🔄 Refresh Logs
            </button>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid-4" style={{ marginBottom: 24, gap: 16 }}>
          <div className="card stat-card animate-fade-in">
            <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.15)' }}>👥</div>
            <div className="stat-value" style={{ color: 'var(--primary-light)' }}>{stats.totalUsers}</div>
            <div className="stat-label">Total Registered Users</div>
          </div>
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>✅</div>
            <div className="stat-value" style={{ color: 'var(--success-light)' }}>{stats.totalLogins}</div>
            <div className="stat-label">Successful Sign-Ins</div>
          </div>
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)' }}>⚠️</div>
            <div className="stat-value" style={{ color: 'var(--danger-light)' }}>{stats.failedAttempts}</div>
            <div className="stat-label">Failed Login Attempts</div>
          </div>
          <div className="card stat-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.15)' }}>🔐</div>
            <div className="stat-value" style={{ color: 'var(--secondary)' }}>Active</div>
            <div className="stat-label">Auth System Status</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs" style={{ marginBottom: 20 }}>
          <button className={`tab-btn ${tab === 'logs' ? 'active' : ''}`} onClick={() => setTab('logs')}>
            📜 Sign-in & Authentication Logs ({logs.length})
          </button>
          <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            👥 Registered Users Directory ({users.length})
          </button>
        </div>

        {/* TAB 1: Live Sign-in Logs */}
        {tab === 'logs' && (
          <div className="card" style={{ padding: 20 }}>
            <div className="flex justify-between items-center gap-3" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
              <div className="flex items-center gap-2" style={{ flex: 1, minWidth: 260 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Filter logs by email or user..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {['ALL', 'LOGIN', 'REGISTER', 'LOGOUT'].map(t => (
                  <button
                    key={t}
                    className={`chip ${filterType === t ? 'active' : ''}`}
                    onClick={() => setFilterType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User & Email</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Device / IP</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 30 }}>
                        No authentication logs found.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id} className={log.status === 'FAILED' ? 'row-failed' : ''}>
                        <td>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {new Date(log.timestamp).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{log.name}</div>
                          <div className="flex items-center gap-1" style={{ fontSize: '0.78rem', color: 'var(--primary-light)' }}>
                            <span>{log.email}</span>
                            <button
                              className="btn-icon"
                              title="Copy email"
                              onClick={() => copyEmail(log.email)}
                              style={{ padding: '0 4px', fontSize: '0.7rem' }}
                            >
                              {copiedEmail === log.email ? '✓' : '📋'}
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className={`type-badge type-${log.type.toLowerCase()}`}>
                            {log.type === 'LOGIN' ? '🔑 LOGIN' : log.type === 'REGISTER' ? '📝 REGISTER' : '🚪 LOGOUT'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${log.status.toLowerCase()}`}>
                            {log.status === 'SUCCESS' ? '✓ Success' : '⚠️ Failed'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${log.role === 'ADMIN' ? 'badge-primary' : 'badge-secondary'}`}>
                            {log.role || 'USER'}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.78rem' }}>{log.device}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>IP: {log.ipAddress}</div>
                        </td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => copyEmail(log.email)}
                            style={{ fontSize: '0.75rem' }}
                          >
                            Copy ID
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Registered Users Directory */}
        {tab === 'users' && (
          <div className="card" style={{ padding: 20 }}>
            <div className="flex justify-between items-center gap-3" style={{ marginBottom: 16 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search registered users by name, email, username..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ maxWidth: 400 }}
              />
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User Profile</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Trust Score</th>
                    <th>Level</th>
                    <th>Stats</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar-placeholder avatar-sm" style={{
                            background: `linear-gradient(135deg, ${getLevelColor(u.level)}66, ${getLevelColor(u.level)}33)`,
                            fontSize: '0.8rem',
                          }}>
                            {u.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</span>
                              {u.isVerified && <span title="Verified">✅</span>}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <strong style={{ fontSize: '0.85rem', color: u.email === 'sathyaviji2008@gmail.com' ? 'var(--primary-light)' : 'inherit' }}>
                            {u.email}
                          </strong>
                          <button className="btn-icon" onClick={() => copyEmail(u.email)}>
                            {copiedEmail === u.email ? '✓' : '📋'}
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' || u.email === 'sathyaviji2008@gmail.com' ? 'badge-primary' : 'badge-secondary'}`}>
                          {u.role || (u.email === 'sathyaviji2008@gmail.com' ? 'ADMIN' : 'USER')}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: getTrustColor(u.trustScore), fontFamily: 'var(--font-display)' }}>
                          {u.trustScore} / 100
                        </span>
                      </td>
                      <td>
                        <span style={{ color: getLevelColor(u.level), fontWeight: 700, fontSize: '0.8rem' }}>
                          ◆ {u.level}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.78rem' }}>📝 {u.reviewCount} reviews</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>👍 {u.helpfulVotes} helpful</div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {u.joinedAt || '2024-01-01'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          margin-bottom: 24px;
          background: linear-gradient(135deg, rgba(124,58,237,0.18), rgba(6,182,212,0.1));
          border: 1px solid rgba(124,58,237,0.3);
          flex-wrap: wrap;
          gap: 16px;
        }
        .admin-header-main { display: flex; align-items: center; gap: 16px; }
        .admin-avatar {
          width: 56px; height: 56px;
          border-radius: var(--radius-md);
          background: var(--grad-primary);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.8rem;
          box-shadow: 0 4px 16px rgba(124,58,237,0.4);
        }
        .admin-subtitle { color: var(--text-secondary); margin-top: 4px; font-size: 0.9rem; }
        .admin-actions { display: flex; gap: 10px; }
        .table-responsive { overflow-x: auto; }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th {
          padding: 12px 14px;
          background: var(--bg-elevated);
          color: var(--text-muted);
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-subtle);
        }
        .admin-table td {
          padding: 14px;
          border-bottom: 1px solid var(--border-subtle);
          vertical-align: middle;
        }
        .admin-table tbody tr:hover { background: var(--bg-card-hover); }
        .row-failed { background: rgba(239,68,68,0.05); }
        .type-badge {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
        }
        .type-login { background: rgba(6,182,212,0.15); color: var(--secondary); }
        .type-register { background: rgba(124,58,237,0.15); color: var(--primary-light); }
        .type-logout { background: rgba(148,163,184,0.15); color: var(--text-muted); }
        .status-badge {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
        }
        .status-success { background: rgba(16,185,129,0.15); color: var(--success-light); }
        .status-failed { background: rgba(239,68,68,0.15); color: var(--danger-light); }
        .btn-icon {
          background: none; border: none; cursor: pointer; color: var(--text-muted);
          transition: color 0.2s;
        }
        .btn-icon:hover { color: var(--primary-light); }
      `}</style>
    </div>
  );
}

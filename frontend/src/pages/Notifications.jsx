import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_NOTIFICATIONS } from '../utils/mockData.js';
import { timeAgo } from '../utils/helpers.js';

const TYPE_ICONS = {
  helpful_vote: '👍',
  badge_earned: '🏆',
  business_response: '💬',
  follower: '👥',
  trust_score: '⭐',
};

const TYPE_COLORS = {
  helpful_vote: 'var(--success)',
  badge_earned: 'var(--accent)',
  business_response: 'var(--secondary)',
  follower: 'var(--primary)',
  trust_score: 'var(--accent)',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  const filtered = filter === 'all' ? notifications : notifications.filter(n => !n.read);

  return (
    <div className="page-wrapper">
      <div className="page-content" style={{ maxWidth: 720 }}>
        <div className="page-header">
          <div className="flex items-center gap-3">
            <h1 className="page-title">Notifications</h1>
            {unread > 0 && (
              <span className="badge badge-danger">{unread} new</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="tabs" style={{ margin: 0 }}>
              <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
              <button className={`tab-btn ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
                Unread {unread > 0 && `(${unread})`}
              </button>
            </div>
            {unread > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔔</span>
            <div className="empty-title">No notifications</div>
            <div className="empty-desc">You're all caught up!</div>
          </div>
        ) : (
          <div className="notif-list">
            {filtered.map((n, i) => (
              <div
                key={n.id}
                className={`notif-item card animate-fade-in ${!n.read ? 'notif-unread' : ''}`}
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => markRead(n.id)}
              >
                <div className="notif-icon-wrap" style={{ background: TYPE_COLORS[n.type] + '20' }}>
                  <span className="notif-type-icon">{TYPE_ICONS[n.type]}</span>
                </div>
                <div className="notif-body">
                  <p className="notif-message">{n.message}</p>
                  <span className="notif-time">{timeAgo(n.timestamp)}</span>
                </div>
                {!n.read && <div className="notif-dot-badge" style={{ background: TYPE_COLORS[n.type] }} />}
                {n.link && (
                  <Link to={n.link} className="btn btn-ghost btn-sm" onClick={e => e.stopPropagation()}>
                    View →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .notif-list { display:flex; flex-direction:column; gap:10px; }
        .notif-item {
          display:flex; align-items:center; gap:14px;
          padding:16px 20px; cursor:pointer;
          transition:all var(--transition-fast);
        }
        .notif-item:hover { transform:none; }
        .notif-unread { border-color:rgba(124,58,237,0.25); background:rgba(124,58,237,0.04); }
        .notif-icon-wrap {
          width:44px; height:44px; border-radius:var(--radius-md);
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0;
        }
        .notif-type-icon { font-size:1.3rem; }
        .notif-body { flex:1; min-width:0; }
        .notif-message { font-size:0.9rem; font-weight:500; margin-bottom:4px; color:var(--text-primary); }
        .notif-time { font-size:0.75rem; color:var(--text-muted); }
        .notif-dot-badge {
          width:10px; height:10px; border-radius:50%;
          flex-shrink:0;
        }
      `}</style>
    </div>
  );
}

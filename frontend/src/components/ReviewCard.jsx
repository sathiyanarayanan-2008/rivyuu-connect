import { useState } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo, formatNumber, getSentimentColor, getAIBadgeClass, generateStars } from '../utils/helpers.js';
import { MOCK_USERS } from '../utils/mockData.js';
import RatingStars from './RatingStars.jsx';

export default function ReviewCard({ review, showBusiness = true, onVote }) {
  const [voted, setVoted] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const author = MOCK_USERS.find(u => u.id === review.userId);

  const handleVote = (type) => {
    if (voted) return;
    setVoted(type);
    onVote?.(review.id, type);
  };

  const isLong = review.content.length > 200;
  const displayContent = expanded || !isLong ? review.content : review.content.slice(0, 200) + '...';

  const sentimentIcon = review.aiSentiment === 'positive' ? '😊'
    : review.aiSentiment === 'negative' ? '😞' : '😐';

  return (
    <div className="review-card card animate-fade-in">
      {/* Header */}
      <div className="review-header">
        <div className="flex items-center gap-3">
          <div className="avatar-placeholder avatar-md" style={{ fontSize: '0.9rem' }}>
            {author?.initials || '??'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="reviewer-name">{author?.name || 'Anonymous'}</span>
              {author?.isVerified && <span className="badge badge-success" style={{ padding: '2px 6px', fontSize: '0.68rem' }}>✓ Verified</span>}
              {author?.level && (
                <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '0.68rem' }}>
                  {author.level}
                </span>
              )}
            </div>
            <div className="reviewer-meta">
              <span>Trust: <strong style={{ color: 'var(--accent)' }}>{author?.trustScore}</strong></span>
              <span>•</span>
              <span>{timeAgo(review.timestamp)}</span>
            </div>
          </div>
        </div>

        {showBusiness && (
          <div className="review-business">
            <span className="business-logo">{review.businessLogo}</span>
            <span className="business-name">{review.businessName}</span>
          </div>
        )}
      </div>

      {/* Rating & Title */}
      <div className="review-rating-row">
        <RatingStars rating={review.rating} size="sm" />
        <span className="rating-number">{review.rating}.0</span>
        {review.verified && (
          <span className="badge badge-secondary" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
            🔐 Verified Purchase
          </span>
        )}
      </div>

      <h3 className="review-title">{review.title}</h3>

      {/* Content */}
      <p className="review-content">
        {displayContent}
        {isLong && (
          <button
            className="read-more-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? ' Show less' : ' Read more'}
          </button>
        )}
      </p>

      {/* Tags */}
      {review.tags?.length > 0 && (
        <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: '12px' }}>
          {review.tags.map(tag => (
            <span key={tag} className="chip">#{tag}</span>
          ))}
        </div>
      )}

      {/* AI Badge */}
      <div className="ai-badge-row">
        <span className={`badge ${getAIBadgeClass(review.aiSentiment)}`}>
          {sentimentIcon} {review.aiLabel}
        </span>
        <div className="ai-score">
          <div className="progress-bar" style={{ width: 100, height: 4, display: 'inline-block', verticalAlign: 'middle' }}>
            <div
              className="progress-fill"
              style={{
                width: `${review.aiScore}%`,
                background: getSentimentColor(review.aiSentiment),
              }}
            />
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{review.aiScore}/100</span>
        </div>
      </div>

      {/* Business Response */}
      {review.response && (
        <div className="business-response">
          <div className="response-header">
            <span className="response-logo">{review.businessLogo}</span>
            <span className="response-label">Business Response</span>
            <span className="response-time">{timeAgo(review.response.timestamp)}</span>
          </div>
          <p className="response-text">{review.response.text}</p>
        </div>
      )}

      {/* Footer Actions */}
      <div className="review-footer">
        <div className="helpful-row">
          <span className="helpful-label">Helpful?</span>
          <button
            className={`vote-btn ${voted === 'helpful' ? 'voted-yes' : ''}`}
            onClick={() => handleVote('helpful')}
            disabled={!!voted}
          >
            👍 {formatNumber(review.helpful + (voted === 'helpful' ? 1 : 0))}
          </button>
          <button
            className={`vote-btn ${voted === 'notHelpful' ? 'voted-no' : ''}`}
            onClick={() => handleVote('notHelpful')}
            disabled={!!voted}
          >
            👎 {review.notHelpful + (voted === 'notHelpful' ? 1 : 0)}
          </button>
        </div>
        <button className="share-btn">↗ Share</button>
      </div>

      <style>{`
        .review-card { margin-bottom: 0; }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .reviewer-name { font-weight: 600; font-size: 0.95rem; }
        .reviewer-meta {
          display: flex;
          gap: 6px;
          align-items: center;
          color: var(--text-muted);
          font-size: 0.78rem;
          margin-top: 2px;
        }
        .review-business {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 6px 10px;
          font-size: 0.8rem;
        }
        .business-logo { font-size: 1.1rem; }
        .business-name { color: var(--text-secondary); font-weight: 500; }
        .review-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .rating-number {
          font-weight: 700;
          color: var(--accent);
          font-size: 0.9rem;
        }
        .review-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: var(--text-primary);
        }
        .review-content {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 12px;
        }
        .read-more-btn {
          color: var(--primary-light);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          margin-left: 4px;
        }
        .ai-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .ai-score {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .business-response {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-left: 3px solid var(--secondary);
          border-radius: var(--radius-md);
          padding: 12px;
          margin-bottom: 12px;
        }
        .response-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 0.8rem;
        }
        .response-logo { font-size: 1rem; }
        .response-label { font-weight: 600; color: var(--secondary-light); }
        .response-time { color: var(--text-muted); margin-left: auto; }
        .response-text { color: var(--text-secondary); font-size: 0.875rem; line-height: 1.6; }
        .review-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
          margin-top: 4px;
        }
        .helpful-row { display: flex; align-items: center; gap: 8px; }
        .helpful-label { font-size: 0.8rem; color: var(--text-muted); }
        .vote-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .vote-btn:hover:not(:disabled) { background: var(--bg-card-hover); border-color: var(--border); }
        .vote-btn.voted-yes { background: rgba(16,185,129,0.15); border-color: var(--success); color: var(--success-light); }
        .vote-btn.voted-no { background: rgba(239,68,68,0.12); border-color: var(--danger); color: var(--danger-light); }
        .vote-btn:disabled { cursor: not-allowed; }
        .share-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          cursor: pointer;
          padding: 5px 8px;
          border-radius: var(--radius-sm);
          transition: color var(--transition-fast);
        }
        .share-btn:hover { color: var(--primary-light); }
      `}</style>
    </div>
  );
}

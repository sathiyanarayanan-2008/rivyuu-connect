import { timeAgo } from '../utils/helpers.js';
import { MOCK_USERS } from '../utils/mockData.js';
import RatingStars from './RatingStars.jsx';

export default function ReviewTimeline({ reviews }) {
  return (
    <div className="timeline">
      {reviews.map((review, i) => {
        const author = MOCK_USERS.find(u => u.id === review.userId);
        return (
          <div key={review.id} className="timeline-item animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="timeline-connector">
              <div className="timeline-dot" />
              {i < reviews.length - 1 && <div className="timeline-line" />}
            </div>
            <div className="timeline-content card">
              <div className="timeline-header">
                <span className="timeline-business">{review.businessLogo} {review.businessName}</span>
                <RatingStars rating={review.rating} size="sm" />
                <span className="timeline-time">{timeAgo(review.timestamp)}</span>
              </div>
              <h4 className="timeline-title">{review.title}</h4>
              <p className="timeline-excerpt">
                {review.content.slice(0, 120)}{review.content.length > 120 ? '...' : ''}
              </p>
              <div className="timeline-meta">
                <span className="timeline-badge" style={{
                  background: review.aiSentiment === 'positive' ? 'rgba(16,185,129,0.12)' : review.aiSentiment === 'negative' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                  color: review.aiSentiment === 'positive' ? 'var(--success-light)' : review.aiSentiment === 'negative' ? 'var(--danger-light)' : 'var(--accent-light)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}>
                  🤖 {review.aiLabel}
                </span>
                <span className="timeline-helpful">👍 {review.helpful} found helpful</span>
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        .timeline { display: flex; flex-direction: column; }
        .timeline-item { display: flex; gap: 16px; }
        .timeline-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          padding-top: 20px;
        }
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--grad-primary);
          box-shadow: 0 0 8px var(--primary-glow);
          flex-shrink: 0;
        }
        .timeline-line {
          flex: 1;
          width: 2px;
          background: var(--border-subtle);
          margin: 6px 0;
        }
        .timeline-content {
          flex: 1;
          margin-bottom: 16px;
          padding: 16px;
        }
        .timeline-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .timeline-business { font-weight: 600; font-size: 0.875rem; color: var(--text-secondary); }
        .timeline-time { font-size: 0.75rem; color: var(--text-muted); margin-left: auto; }
        .timeline-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 6px; }
        .timeline-excerpt { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 10px; }
        .timeline-meta { display: flex; align-items: center; gap: 10px; }
        .timeline-helpful { font-size: 0.75rem; color: var(--text-muted); margin-left: auto; }
      `}</style>
    </div>
  );
}

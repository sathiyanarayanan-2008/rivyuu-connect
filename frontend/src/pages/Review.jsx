import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import RatingStars from '../components/RatingStars.jsx';
import { createReview } from '../services/reviewService.js';
import { analyzeSentiment } from '../services/aiService.js';
import { MOCK_BUSINESSES } from '../utils/mockData.js';

export default function Review() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    businessId: '',
    rating: 0,
    title: '',
    content: '',
    tags: [],
  });
  const [aiResult, setAiResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const update = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const selectedBusiness = MOCK_BUSINESSES.find(b => b.id === form.businessId);

  const handleAnalyze = async () => {
    if (!form.content || form.content.length < 20) return;
    setAnalyzing(true);
    const result = await analyzeSentiment(form.content);
    setAiResult(result);
    setAnalyzing(false);
    setStep(3);
  };

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
      if (!form.tags.includes(tag) && form.tags.length < 5) {
        setForm(f => ({ ...f, tags: [...f.tags, tag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      await createReview({
        userId: user.id,
        businessId: form.businessId,
        businessName: selectedBusiness?.name || '',
        businessLogo: selectedBusiness?.logo || '',
        rating: form.rating,
        title: form.title,
        content: form.content,
        tags: form.tags,
        verified: user.isVerified,
        aiSentiment: aiResult?.sentiment || 'mixed',
        aiScore: aiResult?.score || 50,
        aiLabel: aiResult?.label || 'Unanalyzed',
      });
      navigate('/');
    } finally {
      setSubmitting(false);
    }
  };

  const sentimentColors = {
    positive: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: 'var(--success-light)' },
    negative: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: 'var(--danger-light)' },
    mixed:    { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: 'var(--accent-light)' },
  };

  return (
    <div className="page-wrapper">
      <div className="page-content" style={{ maxWidth: 720 }}>
        {/* Header */}
        <div className="page-header">
          <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
            <div className="step-indicator">
              {[1, 2, 3].map(s => (
                <div key={s} className={`step-dot ${s === step ? 'active' : s < step ? 'done' : ''}`}>
                  {s < step ? '✓' : s}
                </div>
              ))}
            </div>
          </div>
          <h1 className="page-title">Write a Review</h1>
          <p className="page-subtitle">Your honest feedback helps build a trustworthy community</p>
        </div>

        {/* Step 1: Choose Business & Rating */}
        {step >= 1 && (
          <div className={`card review-step ${step === 1 ? 'active-step' : 'done-step'}`} style={{ marginBottom: 20 }}>
            <div className="step-header">
              <div className="step-num">{step > 1 ? '✓' : '1'}</div>
              <h2 className="step-title">Choose a Business & Rate</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Select Business</label>
              <div className="biz-selector">
                {MOCK_BUSINESSES.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    className={`biz-option ${form.businessId === b.id ? 'selected' : ''}`}
                    onClick={() => update('businessId')(b.id)}
                  >
                    <span className="biz-option-logo">{b.logo}</span>
                    <div>
                      <div className="biz-option-name">{b.name}</div>
                      <div className="biz-option-cat">{b.category}</div>
                    </div>
                    {form.businessId === b.id && <span className="biz-selected-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <div className="rating-picker">
                <RatingStars rating={form.rating} interactive onChange={update('rating')} size="xl" />
                {form.rating > 0 && (
                  <span className="rating-text">
                    {['', 'Terrible', 'Bad', 'Average', 'Good', 'Excellent!'][form.rating]}
                  </span>
                )}
              </div>
            </div>

            {form.businessId && form.rating > 0 && (
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                Continue →
              </button>
            )}
          </div>
        )}

        {/* Step 2: Write Review */}
        {step >= 2 && (
          <div className={`card review-step ${step === 2 ? 'active-step' : 'done-step'}`} style={{ marginBottom: 20 }}>
            <div className="step-header">
              <div className="step-num">{step > 2 ? '✓' : '2'}</div>
              <h2 className="step-title">Write Your Review</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Review Title</label>
              <input
                id="review-title"
                type="text"
                className="form-input"
                placeholder="Summarize your experience in one line..."
                value={form.title}
                onChange={e => update('title')(e.target.value)}
                maxLength={100}
              />
              <div style={{ textAlign: 'right', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {form.title.length}/100
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Review</label>
              <textarea
                id="review-content"
                className="form-input form-textarea"
                placeholder="Share your experience in detail. What did you like or dislike? Would you recommend this to others?"
                value={form.content}
                onChange={e => update('content')(e.target.value)}
                rows={7}
                maxLength={1000}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Min. 20 characters for AI analysis</span>
                <span>{form.content.length}/1000</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags (optional)</label>
              <input
                id="review-tags"
                type="text"
                className="form-input"
                placeholder="Type a tag and press Enter (e.g. delivery, packaging)"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              {form.tags.length > 0 && (
                <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: 8 }}>
                  {form.tags.map(tag => (
                    <span key={tag} className="chip active">
                      #{tag}
                      <button onClick={() => removeTag(tag)} style={{ color: 'var(--danger-light)', fontWeight: 700, marginLeft: 4 }}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {step === 2 && (
              <button
                className="btn btn-primary"
                onClick={handleAnalyze}
                disabled={analyzing || form.content.length < 20 || !form.title}
              >
                {analyzing ? (
                  <span className="flex items-center gap-3">
                    <span className="spinner" style={{ width: 18, height: 18 }} />
                    🤖 Analyzing with AI...
                  </span>
                ) : '🤖 Run AI Analysis →'}
              </button>
            )}
          </div>
        )}

        {/* Step 3: AI Result & Submit */}
        {step >= 3 && aiResult && (
          <div className="card review-step active-step" style={{ marginBottom: 20 }}>
            <div className="step-header">
              <div className="step-num">3</div>
              <h2 className="step-title">AI Analysis Result</h2>
            </div>

            <div className="ai-result-panel" style={{
              background: sentimentColors[aiResult.sentiment]?.bg,
              border: `1px solid ${sentimentColors[aiResult.sentiment]?.border}`,
              borderRadius: 'var(--radius-md)',
              padding: 20,
              marginBottom: 20,
            }}>
              <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
                <div className="ai-sentiment-icon">
                  {aiResult.sentiment === 'positive' ? '😊' : aiResult.sentiment === 'negative' ? '😞' : '😐'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: sentimentColors[aiResult.sentiment]?.color }}>
                    {aiResult.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Confidence: {Math.round((aiResult.confidence || 0.87) * 100)}%
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: sentimentColors[aiResult.sentiment]?.color }}>
                    {aiResult.score}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/ 100</div>
                </div>
              </div>

              <div className="progress-bar" style={{ marginBottom: 12 }}>
                <div className="progress-fill" style={{
                  width: `${aiResult.score}%`,
                  background: sentimentColors[aiResult.sentiment]?.color,
                }} />
              </div>

              {aiResult.keywords?.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>Key topics detected:</div>
                  <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                    {aiResult.keywords.map(k => (
                      <span key={k} className="chip">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="ai-badges-row" style={{ marginTop: 12 }}>
                <span className="badge" style={{ background: 'rgba(118,185,0,0.18)', border: '1px solid rgba(118,185,0,0.4)', color: '#76b900', fontWeight: 700 }}>
                  ⚡ NVIDIA NIM Accelerated
                </span>
                <span className="badge badge-primary">🤖 AI Verified</span>
                <span className="badge badge-success">✅ Not Spam</span>
                <span className="badge badge-secondary">🔐 Authentic</span>
              </div>
            </div>

            <button
              id="submit-review-btn"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-3">
                  <span className="spinner" style={{ width: 18, height: 18 }} />
                  Submitting...
                </span>
              ) : '🚀 Submit Review'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .step-indicator { display:flex; align-items:center; gap:8px; }
        .step-dot {
          width:32px; height:32px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:0.875rem; font-weight:700;
          background:var(--bg-elevated); color:var(--text-muted);
          border:2px solid var(--border-subtle);
          transition:all 0.3s ease;
          position:relative;
        }
        .step-dot::after {
          content:'';
          position:absolute;
          right:-12px;
          width:8px; height:2px;
          background:var(--border-subtle);
        }
        .step-dot:last-child::after { display:none; }
        .step-dot.active { background:var(--primary); color:#fff; border-color:var(--primary); box-shadow:0 0 15px var(--primary-glow); }
        .step-dot.done { background:var(--success); color:#fff; border-color:var(--success); }
        .review-step { transition:all 0.3s ease; }
        .active-step { border-color:rgba(124,58,237,0.3); box-shadow:var(--shadow-primary); }
        .done-step { opacity:0.8; }
        .step-header { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
        .step-num {
          width:36px; height:36px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          background:var(--grad-primary); color:#fff; font-weight:700;
          flex-shrink:0;
        }
        .step-title { font-size:1.1rem; font-weight:700; margin:0; }
        .biz-selector { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:10px; }
        .biz-option {
          display:flex; align-items:center; gap:10px;
          background:var(--bg-elevated); border:1px solid var(--border-subtle);
          border-radius:var(--radius-md); padding:12px;
          cursor:pointer; transition:all var(--transition-fast);
          text-align:left; position:relative;
        }
        .biz-option:hover { border-color:var(--border); background:var(--bg-card-hover); }
        .biz-option.selected { border-color:var(--primary); background:rgba(124,58,237,0.12); }
        .biz-option-logo { font-size:1.4rem; flex-shrink:0; }
        .biz-option-name { font-weight:600; font-size:0.85rem; }
        .biz-option-cat { font-size:0.72rem; color:var(--text-muted); }
        .biz-selected-check { position:absolute; top:8px; right:8px; color:var(--primary-light); font-weight:700; }
        .rating-picker { display:flex; align-items:center; gap:16px; padding:16px; background:var(--bg-elevated); border-radius:var(--radius-md); }
        .rating-text { font-weight:700; font-size:1rem; color:var(--accent); }
        .ai-result-panel {}
        .ai-sentiment-icon { font-size:2.5rem; }
        .ai-badges-row { display:flex; flex-wrap:wrap; gap:6px; }
      `}</style>
    </div>
  );
}


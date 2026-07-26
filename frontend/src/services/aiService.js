// AI Service — mock sentiment analysis
const delay = ms => new Promise(r => setTimeout(r, ms));

const POSITIVE_WORDS = ['great', 'excellent', 'amazing', 'love', 'fantastic', 'perfect', 'best', 'wonderful', 'outstanding', 'recommend'];
const NEGATIVE_WORDS = ['bad', 'terrible', 'worst', 'hate', 'awful', 'horrible', 'disappointed', 'useless', 'poor', 'pathetic'];

export async function analyzeSentiment(text) {
  await delay(1200); // simulate AI processing

  const lower = text.toLowerCase();
  let positiveCount = POSITIVE_WORDS.filter(w => lower.includes(w)).length;
  let negativeCount = NEGATIVE_WORDS.filter(w => lower.includes(w)).length;

  let sentiment, score, label;

  if (positiveCount > negativeCount + 1) {
    sentiment = 'positive';
    score = Math.min(95, 60 + positiveCount * 8 + Math.floor(Math.random() * 15));
    label = score > 85 ? 'Highly Positive & Authentic' : 'Positive with Valid Concerns';
  } else if (negativeCount > positiveCount + 1) {
    sentiment = 'negative';
    score = Math.max(15, 55 - negativeCount * 7 + Math.floor(Math.random() * 10));
    label = 'Negative — Specific Grievances';
  } else {
    sentiment = 'mixed';
    score = 40 + Math.floor(Math.random() * 20);
    label = 'Mixed — Credible Issues Identified';
  }

  return {
    sentiment,
    score,
    label,
    confidence: 0.87 + Math.random() * 0.10,
    isSpam: false,
    isFake: false,
    keywords: extractKeywords(text),
    engine: 'NVIDIA NIM (NeMo Microservice)',
    nvidiaAccelerated: true,
  };
}

function extractKeywords(text) {
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 4);
  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

export async function detectFakeReview(text) {
  await delay(800);
  const wordCount = text.trim().split(/\s+/).length;
  const isFake = wordCount < 10 || /buy now|click here|promo code/i.test(text);
  return { isFake, confidence: isFake ? 0.91 : 0.08 };
}

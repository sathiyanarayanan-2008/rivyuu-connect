// Helper utilities for Rivyuu-Connect

/**
 * Format a timestamp to human-readable relative time
 */
export function timeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Format number with K/M suffix
 */
export function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}

/**
 * Get initials from name
 */
export function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

/**
 * Get sentiment color
 */
export function getSentimentColor(sentiment) {
  switch (sentiment) {
    case 'positive': return 'var(--success)';
    case 'negative': return 'var(--danger)';
    case 'mixed': return 'var(--accent)';
    default: return 'var(--text-muted)';
  }
}

/**
 * Get AI sentiment badge style
 */
export function getAIBadgeClass(sentiment) {
  switch (sentiment) {
    case 'positive': return 'badge-success';
    case 'negative': return 'badge-danger';
    case 'mixed': return 'badge-accent';
    default: return 'badge-primary';
  }
}

/**
 * Get level color
 */
export function getLevelColor(level) {
  switch (level) {
    case 'Diamond': return '#7c3aed';
    case 'Gold': return '#f59e0b';
    case 'Silver': return '#94a3b8';
    case 'Bronze': return '#d97706';
    default: return '#64748b';
  }
}

/**
 * Get trust score color
 */
export function getTrustColor(score) {
  if (score >= 85) return 'var(--success)';
  if (score >= 70) return 'var(--accent)';
  if (score >= 50) return 'var(--warning)';
  return 'var(--danger)';
}

/**
 * Get badge rarity color
 */
export function getBadgeRarityColor(rarity) {
  switch (rarity) {
    case 'Legendary': return '#f59e0b';
    case 'Epic': return '#9d5cf6';
    case 'Rare': return '#06b6d4';
    case 'Uncommon': return '#10b981';
    default: return '#64748b';
  }
}

/**
 * Truncate text
 */
export function truncate(str, maxLen = 150) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '...';
}

/**
 * Generate star array for a rating
 */
export function generateStars(rating, max = 5) {
  return Array.from({ length: max }, (_, i) => {
    if (i < Math.floor(rating)) return 'full';
    if (i < rating) return 'half';
    return 'empty';
  });
}

/**
 * Calculate XP percentage
 */
export function xpPercent(xp, nextLevelXp) {
  return Math.min(100, Math.floor((xp / nextLevelXp) * 100));
}

/**
 * Local storage helpers
 */
export const storage = {
  get: (key) => {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch {}
  },
  remove: (key) => localStorage.removeItem(key),
};

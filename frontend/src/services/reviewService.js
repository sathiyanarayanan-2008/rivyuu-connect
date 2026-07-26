// Review Service — CRUD operations for reviews
import { MOCK_REVIEWS } from '../utils/mockData.js';
import { storage } from '../utils/helpers.js';

const REVIEWS_KEY = 'rivyuu_reviews';

function getReviews() {
  return storage.get(REVIEWS_KEY) || MOCK_REVIEWS;
}

function saveReviews(reviews) {
  storage.set(REVIEWS_KEY, reviews);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchAllReviews() {
  await delay(400);
  return getReviews();
}

export async function fetchReviewsByUser(userId) {
  await delay(300);
  return getReviews().filter(r => r.userId === userId);
}

export async function fetchReviewsByBusiness(businessId) {
  await delay(300);
  return getReviews().filter(r => r.businessId === businessId);
}

export async function fetchReviewById(id) {
  await delay(200);
  return getReviews().find(r => r.id === id) || null;
}

export async function createReview(reviewData) {
  await delay(700);
  const reviews = getReviews();
  const newReview = {
    id: `r${Date.now()}`,
    ...reviewData,
    helpful: 0,
    notHelpful: 0,
    timestamp: new Date().toISOString(),
    response: null,
  };
  reviews.unshift(newReview);
  saveReviews(reviews);
  return newReview;
}

export async function updateReview(id, updates) {
  await delay(500);
  const reviews = getReviews();
  const idx = reviews.findIndex(r => r.id === id);
  if (idx === -1) throw new Error('Review not found');
  reviews[idx] = { ...reviews[idx], ...updates };
  saveReviews(reviews);
  return reviews[idx];
}

export async function deleteReview(id) {
  await delay(400);
  const reviews = getReviews().filter(r => r.id !== id);
  saveReviews(reviews);
}

export async function voteHelpful(id, type) {
  await delay(200);
  const reviews = getReviews();
  const idx = reviews.findIndex(r => r.id === id);
  if (idx === -1) return;
  if (type === 'helpful') reviews[idx].helpful += 1;
  else reviews[idx].notHelpful += 1;
  saveReviews(reviews);
  return reviews[idx];
}

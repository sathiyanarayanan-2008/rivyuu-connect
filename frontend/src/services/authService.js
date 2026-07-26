// Auth Service — mock JWT auth with localStorage persistence
import { MOCK_USERS } from '../utils/mockData.js';
import { storage } from '../utils/helpers.js';

const AUTH_KEY = 'rivyuu_auth';
const MOCK_PASSWORD = 'demo123';

/**
 * Simulate JWT login
 */
export async function login(email, password) {
  await delay(800);
  const user = MOCK_USERS.find(u => u.email === email);
  if (!user || password !== MOCK_PASSWORD) {
    throw new Error('Invalid email or password');
  }
  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  const session = { user, token, expiresAt: Date.now() + 86400000 };
  storage.set(AUTH_KEY, session);
  return session;
}

/**
 * Register new user (mock)
 */
export async function register({ name, email, password }) {
  await delay(1000);
  const exists = MOCK_USERS.find(u => u.email === email);
  if (exists) throw new Error('Email already registered');
  const newUser = {
    id: `u${Date.now()}`,
    name,
    email,
    username: name.toLowerCase().replace(/\s/g, ''),
    initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    bio: '',
    location: '',
    joinedAt: new Date().toISOString().slice(0, 10),
    trustScore: 50,
    reviewCount: 0,
    helpfulVotes: 0,
    followers: 0,
    following: 0,
    badges: ['early-adopter'],
    level: 'Bronze',
    xp: 0,
    nextLevelXp: 1000,
    isVerified: false,
  };
  const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
  const session = { user: newUser, token, expiresAt: Date.now() + 86400000 };
  storage.set(AUTH_KEY, session);
  return session;
}

/**
 * Get current session
 */
export function getSession() {
  const session = storage.get(AUTH_KEY);
  if (!session || Date.now() > session.expiresAt) {
    storage.remove(AUTH_KEY);
    return null;
  }
  return session;
}

/**
 * Logout
 */
export function logout() {
  storage.remove(AUTH_KEY);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

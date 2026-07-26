// User Service
import { MOCK_USERS } from '../utils/mockData.js';
import { storage } from '../utils/helpers.js';

const delay = ms => new Promise(r => setTimeout(r, ms));

export async function fetchUserById(id) {
  await delay(300);
  return MOCK_USERS.find(u => u.id === id) || null;
}

export async function fetchUserByUsername(username) {
  await delay(300);
  return MOCK_USERS.find(u => u.username === username) || null;
}

export async function fetchLeaderboard() {
  await delay(400);
  return [...MOCK_USERS].sort((a, b) => b.trustScore - a.trustScore);
}

export async function updateProfile(userId, updates) {
  await delay(500);
  const users = storage.get('rivyuu_users') || MOCK_USERS;
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new Error('User not found');
  users[idx] = { ...users[idx], ...updates };
  storage.set('rivyuu_users', users);
  return users[idx];
}

export async function followUser(targetId) {
  await delay(200);
  return { success: true };
}

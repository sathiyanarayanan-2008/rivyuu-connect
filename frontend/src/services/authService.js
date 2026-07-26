// Auth Service — mock JWT auth with localStorage persistence & logging
import { MOCK_USERS } from '../utils/mockData.js';
import { storage } from '../utils/helpers.js';

const AUTH_KEY = 'rivyuu_auth';
const LOGS_KEY = 'rivyuu_login_logs';
const USERS_KEY = 'rivyuu_users_db';
const MOCK_PASSWORD = 'demo123';

/**
 * Initialize storage with default users and sample logs if empty
 */
function getUsersList() {
  const custom = storage.get(USERS_KEY) || [];
  return [...MOCK_USERS, ...custom];
}

function saveCustomUser(user) {
  const custom = storage.get(USERS_KEY) || [];
  storage.set(USERS_KEY, [user, ...custom]);
}

export function recordLog({ email, name, type = 'LOGIN', status = 'SUCCESS', role = 'USER' }) {
  const logs = storage.get(LOGS_KEY) || getInitialSampleLogs();
  const newLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    email,
    name: name || email.split('@')[0],
    type, // 'LOGIN' | 'REGISTER' | 'LOGOUT'
    status, // 'SUCCESS' | 'FAILED'
    role,
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
    device: 'Desktop (Chrome / Windows)',
  };
  storage.set(LOGS_KEY, [newLog, ...logs.slice(0, 49)]); // keep latest 50
  return newLog;
}

export function getLoginLogs() {
  const logs = storage.get(LOGS_KEY);
  if (!logs || logs.length === 0) {
    const samples = getInitialSampleLogs();
    storage.set(LOGS_KEY, samples);
    return samples;
  }
  return logs;
}

export function getAllUsers() {
  return getUsersList();
}

/**
 * Simulate JWT login
 */
export async function login(email, password) {
  await delay(600);
  const users = getUsersList();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || password !== MOCK_PASSWORD) {
    recordLog({
      email,
      name: user?.name || 'Unknown User',
      type: 'LOGIN',
      status: 'FAILED',
      role: user?.role || 'USER',
    });
    throw new Error('Invalid email or password. (Demo Password is demo123)');
  }

  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  const session = { user, token, expiresAt: Date.now() + 86400000 };
  storage.set(AUTH_KEY, session);

  recordLog({
    email: user.email,
    name: user.name,
    type: 'LOGIN',
    status: 'SUCCESS',
    role: user.role || (user.email === 'sathyaviji2008@gmail.com' ? 'ADMIN' : 'USER'),
  });

  return session;
}

/**
 * Register new user
 */
export async function register({ name, email, password }) {
  await delay(800);
  const users = getUsersList();
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    recordLog({ email, name, type: 'REGISTER', status: 'FAILED' });
    throw new Error('Email is already registered. Please log in.');
  }

  const isAdmin = email.toLowerCase() === 'sathyaviji2008@gmail.com';

  const newUser = {
    id: `u_${Date.now()}`,
    name,
    email,
    username: name.toLowerCase().replace(/\s+/g, ''),
    initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    bio: 'Reviewer on Rivyuu-Connect',
    location: 'India',
    joinedAt: new Date().toISOString().slice(0, 10),
    trustScore: isAdmin ? 98 : 60,
    reviewCount: 0,
    helpfulVotes: 0,
    followers: 0,
    following: 0,
    badges: isAdmin ? ['verified', 'top-reviewer', 'community-champion'] : ['early-adopter'],
    level: isAdmin ? 'Diamond' : 'Bronze',
    xp: isAdmin ? 9950 : 100,
    nextLevelXp: 1000,
    isVerified: true,
    role: isAdmin ? 'ADMIN' : 'USER',
  };

  saveCustomUser(newUser);

  const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
  const session = { user: newUser, token, expiresAt: Date.now() + 86400000 };
  storage.set(AUTH_KEY, session);

  recordLog({
    email: newUser.email,
    name: newUser.name,
    type: 'REGISTER',
    status: 'SUCCESS',
    role: newUser.role,
  });

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
  const session = storage.get(AUTH_KEY);
  if (session?.user) {
    recordLog({
      email: session.user.email,
      name: session.user.name,
      type: 'LOGOUT',
      status: 'SUCCESS',
      role: session.user.role || 'USER',
    });
  }
  storage.remove(AUTH_KEY);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getInitialSampleLogs() {
  const now = Date.now();
  return [
    {
      id: 'log_001',
      email: 'sathyaviji2008@gmail.com',
      name: 'Sathiyanarayanan (Admin)',
      type: 'LOGIN',
      status: 'SUCCESS',
      role: 'ADMIN',
      timestamp: new Date(now - 1000 * 60 * 5).toISOString(),
      ipAddress: '192.168.1.1',
      device: 'Desktop (Chrome / Windows)',
    },
    {
      id: 'log_002',
      email: 'arjun@example.com',
      name: 'Arjun Mehta',
      type: 'LOGIN',
      status: 'SUCCESS',
      role: 'USER',
      timestamp: new Date(now - 1000 * 60 * 45).toISOString(),
      ipAddress: '192.168.1.42',
      device: 'Mobile (Safari / iOS)',
    },
    {
      id: 'log_003',
      email: 'priya@example.com',
      name: 'Priya Sharma',
      type: 'LOGIN',
      status: 'SUCCESS',
      role: 'USER',
      timestamp: new Date(now - 1000 * 60 * 120).toISOString(),
      ipAddress: '192.168.1.88',
      device: 'Desktop (Firefox / MacOS)',
    },
    {
      id: 'log_004',
      email: 'guest_attempt@test.com',
      name: 'Unknown User',
      type: 'LOGIN',
      status: 'FAILED',
      role: 'USER',
      timestamp: new Date(now - 1000 * 60 * 180).toISOString(),
      ipAddress: '203.0.113.195',
      device: 'Desktop (Chrome / Windows)',
    },
    {
      id: 'log_005',
      email: 'rahul@example.com',
      name: 'Rahul Nair',
      type: 'REGISTER',
      status: 'SUCCESS',
      role: 'USER',
      timestamp: new Date(now - 1000 * 60 * 360).toISOString(),
      ipAddress: '192.168.1.15',
      device: 'Desktop (Edge / Windows)',
    },
  ];
}

import { DEFAULT_USER_PROFILE } from './sampleData.js';

const DATABASE_NAME = 'hnazer-browser-data';
const DATABASE_VERSION = 1;
const ACCOUNTS_STORE = 'accounts';
const SESSION_KEY = 'hnazer_browser_session_v1';
const SESSION_ACCOUNT_KEY = 'hnazer_browser_account_v1';
const PASSWORD_ITERATIONS = 210000;
let databasePromise;
let saveQueue = Promise.resolve();

function openDatabase() {
  if (!globalThis.indexedDB) {
    return Promise.reject(new Error('This browser does not support local account storage.'));
  }
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        const accounts = database.createObjectStore(ACCOUNTS_STORE, { keyPath: 'id', autoIncrement: true });
        accounts.createIndex('username', 'username', { unique: true });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Could not open browser storage.'));
    });
  }
  return databasePromise;
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Browser storage request failed.'));
  });
}

function randomHex(byteCount = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteCount));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: new TextEncoder().encode(salt),
    iterations: PASSWORD_ITERATIONS,
    hash: 'SHA-256'
  }, key, 256);
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function getAccountById(id) {
  const database = await openDatabase();
  const transaction = database.transaction(ACCOUNTS_STORE, 'readonly');
  return (await requestResult(transaction.objectStore(ACCOUNTS_STORE).get(Number(id)))) || null;
}

async function getAccountByUsername(username) {
  const database = await openDatabase();
  const transaction = database.transaction(ACCOUNTS_STORE, 'readonly');
  return (await requestResult(transaction.objectStore(ACCOUNTS_STORE).index('username').get(username))) || null;
}

async function getAllAccounts() {
  const database = await openDatabase();
  const transaction = database.transaction(ACCOUNTS_STORE, 'readonly');
  return requestResult(transaction.objectStore(ACCOUNTS_STORE).getAll());
}

async function putAccount(account) {
  const database = await openDatabase();
  const transaction = database.transaction(ACCOUNTS_STORE, 'readwrite');
  transaction.objectStore(ACCOUNTS_STORE).put(account);
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(account);
    transaction.onerror = () => reject(transaction.error || new Error('Could not save browser account data.'));
    transaction.onabort = () => reject(transaction.error || new Error('Browser account update was cancelled.'));
  });
}

async function addAccount(account) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(ACCOUNTS_STORE, 'readwrite');
    const store = transaction.objectStore(ACCOUNTS_STORE);
    let created;
    const addRequest = store.add(account);
    addRequest.onsuccess = () => {
      const id = Number(addRequest.result);
      created = {
        ...account,
        id,
        profile: { ...account.profile, user_id: id }
      };
      store.put(created);
    };
    transaction.oncomplete = () => resolve(created);
    transaction.onerror = () => {
      reject(transaction.error?.name === 'ConstraintError'
        ? new Error('That username already exists in this browser.')
        : transaction.error || new Error('Could not create browser account.'));
    };
    transaction.onabort = () => reject(transaction.error || new Error('Account creation was cancelled.'));
  });
}

async function ensureDefaultAdmin() {
  if (await getAccountByUsername('admin')) return;
  const salt = randomHex(16);
  const account = {
    username: 'admin',
    name: 'System Administrator',
    role: 'admin',
    passwordSalt: salt,
    passwordHash: await hashPassword('admin1234', salt),
    created_at: new Date().toISOString(),
    profile: {
      ...DEFAULT_USER_PROFILE,
      name: 'System Administrator',
      role: 'admin',
      created_at: new Date().toISOString().slice(0, 10)
    },
    logs: []
  };
  try {
    await addAccount(account);
  } catch (error) {
    if (error.message !== 'That username already exists in this browser.') throw error;
  }
}

function makeSession(account) {
  const token = randomHex();
  localStorage.setItem(SESSION_KEY, token);
  localStorage.setItem(SESSION_ACCOUNT_KEY, String(account.id));
  return {
    token,
    account: { id: account.id, username: account.username, name: account.name, role: account.role },
    profile: account.profile,
    logs: account.role === 'admin' ? [] : account.logs
  };
}

function requireCurrentAdmin() {
  const accountId = localStorage.getItem(SESSION_ACCOUNT_KEY);
  if (!localStorage.getItem(SESSION_KEY) || !accountId) {
    throw new Error('Sign in as an administrator to continue.');
  }
  return getAccountById(accountId).then((account) => {
    if (!account || account.role !== 'admin') throw new Error('Admin privileges required.');
    return account;
  });
}

export async function getAccountSession() {
  await ensureDefaultAdmin();
  const token = localStorage.getItem(SESSION_KEY);
  const accountId = localStorage.getItem(SESSION_ACCOUNT_KEY);
  if (!token || !accountId) return null;
  const account = await getAccountById(accountId);
  if (!account) {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_ACCOUNT_KEY);
    return null;
  }
  return makeSession({ ...account, logs: account.role === 'admin' ? [] : account.logs || [] });
}

export async function authenticateAccount(mode, credentials) {
  await ensureDefaultAdmin();
  const username = String(credentials.username || '').trim().toLowerCase();
  const password = String(credentials.password || '');
  if (mode === 'register') {
    const name = String(credentials.name || '').trim();
    if (!/^[a-z0-9_]{3,32}$/.test(username)) {
      throw new Error('Username must be 3 to 32 characters using letters, numbers, or underscores.');
    }
    if (!name || name.length > 80) throw new Error('Enter a name of up to 80 characters.');
    if (password.length < 8 || password.length > 128) {
      throw new Error('Password must be between 8 and 128 characters.');
    }
    if (await getAccountByUsername(username)) throw new Error('That username already exists in this browser.');
    const salt = randomHex(16);
    const account = await addAccount({
      username,
      name,
      role: 'user',
      passwordSalt: salt,
      passwordHash: await hashPassword(password, salt),
      created_at: new Date().toISOString(),
      profile: { ...DEFAULT_USER_PROFILE, name, created_at: new Date().toISOString().slice(0, 10) },
      logs: []
    });
    return makeSession(account);
  }

  const account = await getAccountByUsername(username);
  const salt = account?.passwordSalt || 'hnazer-invalid-account';
  const suppliedHash = await hashPassword(password.slice(0, 128), salt);
  if (!account || password.length > 128 || suppliedHash !== account.passwordHash) {
    throw new Error('Username or password is incorrect.');
  }
  return makeSession(account);
}

export function saveAccountData(profile, logs) {
  const accountId = localStorage.getItem(SESSION_ACCOUNT_KEY);
  if (!localStorage.getItem(SESSION_KEY) || !accountId) return Promise.resolve();
  saveQueue = saveQueue.catch(() => {}).then(async () => {
    const account = await getAccountById(accountId);
    if (!account || account.role === 'admin') return;
    await putAccount({ ...account, profile, logs });
  }).catch((error) => console.error('Could not save browser account data:', error));
  return saveQueue;
}

export async function signOutAccount() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_ACCOUNT_KEY);
}

export async function fetchAdminUsers() {
  await requireCurrentAdmin();
  return (await getAllAccounts()).map((account) => {
    const logs = account.role === 'admin' ? [] : account.logs || [];
    const totalLogs = logs.length;
    const average = (field) => totalLogs
      ? (logs.reduce((sum, log) => sum + (Number.parseFloat(log[field]) || 0), 0) / totalLogs).toFixed(1)
      : '0.0';
    const latestLog = [...logs].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
    return {
      id: account.id,
      username: account.username,
      name: account.name,
      role: account.role,
      created_at: account.created_at,
      totalLogs,
      avgSleep: average('sleep_hour'),
      avgWater: average('water_intake'),
      avgScreen: average('screen_time'),
      latestDate: latestLog?.date || 'None'
    };
  });
}

export async function fetchAdminSystemStats() {
  await requireCurrentAdmin();
  const accounts = await getAllAccounts();
  const logs = accounts.flatMap((account) => account.role === 'admin' ? [] : account.logs || []);
  const average = (field) => logs.length
    ? (logs.reduce((sum, log) => sum + (Number.parseFloat(log[field]) || 0), 0) / logs.length).toFixed(1)
    : '0.0';
  const dbSizeBytes = new Blob([JSON.stringify(accounts)]).size;
  return {
    totalUsers: accounts.length,
    totalLogs: logs.length,
    activeSessions: localStorage.getItem(SESSION_KEY) ? 1 : 0,
    dbSizeBytes,
    databasePath: 'This browser profile (IndexedDB)',
    systemUptimeSec: Math.floor(performance.now() / 1000),
    nodeVersion: 'Browser storage',
    communityAverages: {
      avgSleep: average('sleep_hour'),
      avgWater: average('water_intake'),
      avgScreen: average('screen_time')
    }
  };
}

export async function deleteAdminUser(userId) {
  const admin = await requireCurrentAdmin();
  if (Number(userId) === admin.id) throw new Error('Cannot delete your own active administrator account.');
  const database = await openDatabase();
  const transaction = database.transaction(ACCOUNTS_STORE, 'readwrite');
  transaction.objectStore(ACCOUNTS_STORE).delete(Number(userId));
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve({ ok: true });
    transaction.onerror = () => reject(transaction.error || new Error('Could not delete the account.'));
  });
}

export async function resetAdminUserLogs(userId) {
  await requireCurrentAdmin();
  const account = await getAccountById(userId);
  if (!account) throw new Error('User account not found.');
  await putAccount({ ...account, logs: [] });
  return { ok: true };
}

export async function changeAdminPassword(currentPassword, newPassword) {
  const admin = await requireCurrentAdmin();
  if (newPassword.length < 8 || newPassword.length > 128) {
    throw new Error('New password must be between 8 and 128 characters.');
  }
  const currentHash = await hashPassword(currentPassword.slice(0, 128), admin.passwordSalt);
  if (currentPassword.length > 128 || currentHash !== admin.passwordHash) {
    throw new Error('Current password is incorrect.');
  }
  const passwordSalt = randomHex(16);
  const passwordHash = await hashPassword(newPassword, passwordSalt);
  await putAccount({ ...admin, passwordSalt, passwordHash });
  return { ok: true };
}

export async function exportAdminSystemBackup() {
  await requireCurrentAdmin();
  const accounts = await getAllAccounts();
  return {
    exportedAt: new Date().toISOString(),
    totalAccounts: accounts.length,
    accounts: accounts.map(({ id, username, name, role, created_at, profile, logs }) => ({
      id, username, name, role, created_at, profile, logs: role === 'admin' ? [] : logs || []
    }))
  };
}

export async function inspectUserDossier(userId) {
  await requireCurrentAdmin();
  const account = await getAccountById(userId);
  if (!account) throw new Error('User not found.');
  return {
    account: { id: account.id, username: account.username, name: account.name, role: account.role },
    profile: account.profile,
    logs: account.role === 'admin' ? [] : account.logs || []
  };
}
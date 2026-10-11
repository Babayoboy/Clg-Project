const SESSION_KEY = 'hnazer_local_account_token_v1';
let saveQueue = Promise.resolve();

async function request(path, options = {}) {
  const { token: suppliedToken, ...fetchOptions } = options;
  const token = Object.hasOwn(options, 'token') ? suppliedToken : localStorage.getItem(SESSION_KEY);
  const response = await fetch(path, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem(SESSION_KEY);
    throw new Error(result.error || 'The local account request failed.');
  }
  return result;
}

function rememberSession(session) {
  localStorage.setItem(SESSION_KEY, session.token);
  const { token, ...accountData } = session;
  return accountData;
}

export async function getAccountSession() {
  if (!localStorage.getItem(SESSION_KEY)) return null;
  try {
    return rememberSession(await request('/api/auth/session'));
  } catch (error) {
    if (error.message === 'Sign in again to continue.') return null;
    throw error;
  }
}

export async function authenticateAccount(mode, credentials) {
  const session = await request(`/api/auth/${mode}`, {
    method: 'POST',
    body: JSON.stringify(credentials),
    token: null
  });
  return rememberSession(session);
}

export function saveAccountData(profile, logs) {
  if (!localStorage.getItem(SESSION_KEY)) return Promise.resolve();
  const body = JSON.stringify({ profile, logs });
  saveQueue = saveQueue
    .catch(() => {})
    .then(() => request('/api/data', { method: 'PUT', body }))
    .catch((error) => console.error('Could not save local account data:', error));
  return saveQueue;
}

export async function signOutAccount() {
  try {
    await request('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Could not close local account session:', error);
  } finally {
    localStorage.removeItem(SESSION_KEY);
  }
}
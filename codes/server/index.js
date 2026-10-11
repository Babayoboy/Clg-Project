import { spawn } from 'node:child_process';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { chmodSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { DEFAULT_USER_PROFILE } from '../src/utils/sampleData.js';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dataDirectory = process.env.HNAZER_DATA_DIR || join(homedir(), '.hnazer');
const apiPort = Number(process.env.HNAZER_API_PORT || 3001);
const sessionLifetimeMs = 30 * 24 * 60 * 60 * 1000;

process.umask(0o077);
mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
const databasePath = join(dataDirectory, 'accounts.sqlite');
const database = new DatabaseSync(databasePath);
chmodSync(dataDirectory, 0o700);
chmodSync(databasePath, 0o600);
database.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS account_data (
    account_id INTEGER PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
    profile_json TEXT NOT NULL,
    logs_json TEXT NOT NULL DEFAULT '[]'
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
`);
database.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());

const send = (response, status, payload) => {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(payload));
};

const readBody = (request) => new Promise((resolveBody, rejectBody) => {
  let raw = '';
  request.setEncoding('utf8');
  request.on('data', (chunk) => {
    raw += chunk;
    if (raw.length > 5_000_000) {
      rejectBody(new Error('Request body is too large.'));
      request.destroy();
    }
  });
  request.on('end', () => {
    try {
      resolveBody(raw ? JSON.parse(raw) : {});
    } catch {
      rejectBody(new Error('Request body must be valid JSON.'));
    }
  });
  request.on('error', rejectBody);
});

const hashToken = (token) => createHash('sha256').update(token).digest('hex');

const getAccountById = (accountId) => database.prepare(`
  SELECT accounts.id, accounts.username, accounts.display_name, account_data.profile_json,
    account_data.logs_json
  FROM accounts JOIN account_data ON account_data.account_id = accounts.id
  WHERE accounts.id = ?
`).get(accountId);

const makeSession = (accountId) => {
  const token = randomBytes(32).toString('hex');
  database.prepare('INSERT INTO sessions (token_hash, account_id, expires_at) VALUES (?, ?, ?)')
    .run(hashToken(token), accountId, Date.now() + sessionLifetimeMs);
  return token;
};

const getSession = (request) => {
  const authorization = request.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) return null;
  const session = database.prepare(`
    SELECT accounts.id, accounts.username, accounts.display_name, account_data.profile_json,
      account_data.logs_json, sessions.token_hash
    FROM sessions
    JOIN accounts ON accounts.id = sessions.account_id
    JOIN account_data ON account_data.account_id = accounts.id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?
  `).get(hashToken(token), Date.now());
  return session ? { ...session, token } : null;
};

const sessionPayload = (session) => ({
  token: session.token,
  account: { id: session.id, username: session.username, name: session.display_name },
  profile: JSON.parse(session.profile_json),
  logs: JSON.parse(session.logs_json)
});

const server = createServer(async (request, response) => {
  const route = new URL(request.url, 'http://127.0.0.1').pathname;
  try {
    if (request.method === 'POST' && route === '/api/auth/register') {
      const body = await readBody(request);
      const username = String(body.username || '').trim().toLowerCase();
      const name = String(body.name || '').trim();
      const password = String(body.password || '');
      if (!/^[a-z0-9_]{3,32}$/.test(username)) {
        return send(response, 400, { error: 'Username must be 3 to 32 characters using letters, numbers, or underscores.' });
      }
      if (!name || name.length > 80) return send(response, 400, { error: 'Enter a name of up to 80 characters.' });
      if (password.length < 8 || password.length > 128) {
        return send(response, 400, { error: 'Password must be between 8 and 128 characters.' });
      }

      const salt = randomBytes(16).toString('hex');
      const passwordHash = scryptSync(password, salt, 64).toString('hex');
      let accountId;
      try {
        database.exec('BEGIN');
        const result = database.prepare(
          'INSERT INTO accounts (username, display_name, password_salt, password_hash) VALUES (?, ?, ?, ?)'
        ).run(username, name, salt, passwordHash);
        accountId = Number(result.lastInsertRowid);
        const profile = { ...DEFAULT_USER_PROFILE, user_id: accountId, name, created_at: new Date().toISOString().slice(0, 10) };
        database.prepare('INSERT INTO account_data (account_id, profile_json, logs_json) VALUES (?, ?, ?)')
          .run(accountId, JSON.stringify(profile), '[]');
        database.exec('COMMIT');
      } catch (error) {
        database.exec('ROLLBACK');
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return send(response, 409, { error: 'That username is already in use on this device.' });
        }
        throw error;
      }
      const session = getAccountById(accountId);
      session.token = makeSession(accountId);
      return send(response, 201, sessionPayload(session));
    }

    if (request.method === 'POST' && route === '/api/auth/login') {
      const body = await readBody(request);
      const username = String(body.username || '').trim().toLowerCase();
      const password = String(body.password || '');
      const account = database.prepare('SELECT id, password_salt, password_hash FROM accounts WHERE username = ?').get(username);
      const suppliedHash = scryptSync(password.slice(0, 128), account?.password_salt || 'hnazer-invalid-account', 64);
      const storedHash = account ? Buffer.from(account.password_hash, 'hex') : Buffer.alloc(64);
      if (!account || password.length > 128 || !timingSafeEqual(suppliedHash, storedHash)) {
        return send(response, 401, { error: 'Username or password is incorrect.' });
      }
      const session = getAccountById(account.id);
      session.token = makeSession(account.id);
      return send(response, 200, sessionPayload(session));
    }

    if (request.method === 'GET' && route === '/api/auth/session') {
      const session = getSession(request);
      if (!session) return send(response, 401, { error: 'Sign in again to continue.' });
      return send(response, 200, sessionPayload(session));
    }

    if (request.method === 'POST' && route === '/api/auth/logout') {
      const session = getSession(request);
      if (session) database.prepare('DELETE FROM sessions WHERE token_hash = ?').run(session.token_hash);
      return send(response, 200, { ok: true });
    }

    if (route === '/api/data' && (request.method === 'GET' || request.method === 'PUT')) {
      const session = getSession(request);
      if (!session) return send(response, 401, { error: 'Sign in again to continue.' });
      if (request.method === 'GET') return send(response, 200, sessionPayload(session));
      const body = await readBody(request);
      if (!body.profile || typeof body.profile !== 'object' || !Array.isArray(body.logs)) {
        return send(response, 400, { error: 'Profile and logs are required.' });
      }
      database.prepare('UPDATE account_data SET profile_json = ?, logs_json = ? WHERE account_id = ?')
        .run(JSON.stringify(body.profile), JSON.stringify(body.logs), session.id);
      return send(response, 200, { ok: true });
    }

    return send(response, 404, { error: 'Not found.' });
  } catch (error) {
    if (!response.headersSent) send(response, 400, { error: error.message || 'Local account service error.' });
  }
});

server.listen(apiPort, '127.0.0.1', () => {
  console.log(`Hnazer local account service listening on http://127.0.0.1:${apiPort}`);
  const vite = spawn(process.execPath, [join(projectRoot, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1'], {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  vite.on('error', (error) => {
    console.error('Could not start Vite:', error.message);
    server.close(() => process.exit(1));
  });
  vite.on('exit', (code) => server.close(() => process.exit(code || 0)));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => vite.kill(signal));
});
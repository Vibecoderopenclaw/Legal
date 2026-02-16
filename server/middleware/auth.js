// Simple session-based auth middleware
// In production, replace with JWT or OAuth2 provider

const sessions = new Map();

export function createSession(userId, userData) {
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, {
    userId,
    ...userData,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  });
  return sessionId;
}

export function authMiddleware(req, res, next) {
  const sessionId = req.headers['x-session-id'];

  if (!sessionId) {
    // Allow unauthenticated access for demo purposes
    req.user = { id: 'demo-user', name: 'Demo User', role: 'attorney' };
    return next();
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  session.lastActive = new Date().toISOString();
  req.user = session;
  next();
}

export default { createSession, authMiddleware };

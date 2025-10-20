import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'freeship-nexus-secret-key';

export function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
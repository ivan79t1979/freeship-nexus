import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export function generateToken(userId) {
  if (!SECRET_KEY) {
    throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
  }
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
}

export function verifyToken(token) {
  if (!SECRET_KEY) {
    throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
  }
  
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

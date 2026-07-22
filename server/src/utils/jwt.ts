import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '../generated/prisma/client';

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-assessment';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '24h') as SignOptions['expiresIn'];

export function generateToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

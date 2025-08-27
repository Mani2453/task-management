// Authentication utilities: JWT, bcrypt
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-min-32-characters-long';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function signJwt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(JWT_SECRET));
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload;
  } catch {
    return null;
  }
}

import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'taskmanagementsecret');

export async function signJwt(payload: Record<string, unknown>, expiresIn = '7d') {
  return await new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

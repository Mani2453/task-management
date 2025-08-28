import { NextRequest } from 'next/server';
import { verifyJwt } from './jwt';

export async function getUserFromRequest(req: NextRequest | Request) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return null;
  const payload = await verifyJwt(token);
  if (!payload || typeof payload !== 'object' || !payload.userId) return null;
  return payload;
}

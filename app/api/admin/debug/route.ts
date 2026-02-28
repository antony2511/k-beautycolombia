import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  const email = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_SECRET_KEY;
  
  let hashMatch = false;
  if (hash) {
    hashMatch = await bcrypt.compare('C@6bGT9MBdBXuDJ#', hash);
  }

  return NextResponse.json({
    hasEmail: !!email,
    email: email || 'NOT SET',
    hasHash: !!hash,
    hashLength: hash?.length || 0,
    hashStart: hash?.substring(0, 7) || 'NOT SET',
    hasSecret: !!secret,
    hashMatch,
    nodeEnv: process.env.NODE_ENV,
  });
}

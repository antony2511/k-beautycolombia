import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

export interface AdminSession {
  email: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const validEmail = process.env.ADMIN_EMAIL;
  const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  console.log('🔍 Verify credentials:', {
    inputEmail: email,
    validEmail,
    emailMatch: email === validEmail,
    hasValidHash: !!validPasswordHash,
    hashLength: validPasswordHash?.length,
    hashStart: validPasswordHash?.substring(0, 10),
  });

  if (!validEmail || !validPasswordHash) {
    console.error('❌ Admin credentials not configured in environment variables');
    return false;
  }

  if (email !== validEmail) {
    console.error('❌ Email does not match');
    return false;
  }

  try {
    const result = await bcrypt.compare(password, validPasswordHash);
    console.log('🔐 Password comparison result:', result);
    return result;
  } catch (error) {
    console.error('❌ Error verifying password:', error);
    return false;
  }
}

export async function generateAdminToken(email: string): Promise<string> {
  const secretKey = process.env.ADMIN_SECRET_KEY;

  if (!secretKey) {
    throw new Error('ADMIN_SECRET_KEY not configured in environment variables');
  }

  const secret = new TextEncoder().encode(secretKey);

  const token = await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret);

  return token;
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  const secretKey = process.env.ADMIN_SECRET_KEY;

  console.log('🔑 Verifying token:', {
    hasSecretKey: !!secretKey,
    secretKeyLength: secretKey?.length,
    tokenLength: token?.length,
    tokenStart: token?.substring(0, 30),
  });

  if (!secretKey) {
    console.error('❌ ADMIN_SECRET_KEY not configured in environment variables');
    return null;
  }

  try {
    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, secret);

    console.log('✅ Token verified successfully:', payload);

    return {
      email: payload.email as string,
      role: payload.role as 'admin',
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return null;
  }
}

export function getAdminEmail(): string | undefined {
  return process.env.ADMIN_EMAIL;
}

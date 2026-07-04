import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import { sendEmail, registrationOtpEmail } from './emailService';

const OTP_EXPIRY_MINUTES = 10;
export const OTP_PURPOSE_REGISTRATION = 'REGISTRATION';

function generateCode(): string {
  return String(crypto.randomInt(100000, 999999));
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function sendRegistrationOtp(email: string): Promise<void> {
  const normalized = normalizeEmail(email);

  if (!normalized || !normalized.includes('@')) {
    throw new Error('A valid email address is required');
  }

  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  await prisma.emailVerification.deleteMany({
    where: { email: normalized, purpose: OTP_PURPOSE_REGISTRATION },
  });

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.emailVerification.create({
    data: {
      email: normalized,
      codeHash,
      purpose: OTP_PURPOSE_REGISTRATION,
      expiresAt,
    },
  });

  await sendEmail({
    to: normalized,
    subject: 'Your QuickDoctor verification code',
    html: registrationOtpEmail({ code, expiresMinutes: OTP_EXPIRY_MINUTES }),
  });
}

export async function verifyRegistrationOtp(email: string, code: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  const trimmedCode = String(code).trim();

  if (!/^\d{6}$/.test(trimmedCode)) {
    return false;
  }

  const record = await prisma.emailVerification.findFirst({
    where: {
      email: normalized,
      purpose: OTP_PURPOSE_REGISTRATION,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) return false;

  const match = await bcrypt.compare(trimmedCode, record.codeHash);
  if (!match) return false;

  await prisma.emailVerification.delete({ where: { id: record.id } });
  return true;
}

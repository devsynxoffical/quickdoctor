import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { sendEmail, passwordResetEmail, welcomeEmail } from '../services/emailService';
import { normalizeEmail, sendRegistrationOtp, verifyRegistrationOtp } from '../services/otpService';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function frontendBase() {
  const raw = process.env.FRONTEND_URL || 'http://localhost:3000';
  return raw.split(',')[0].trim();
}

function publicUserPayload(user: {
  id: string;
  email: string;
  role: Role;
  patient: { firstName: string; lastName: string } | null;
  doctor: { firstName: string; lastName: string } | null;
}) {
  const base = { id: user.id, email: user.email, role: user.role };
  if (user.patient) {
    return { ...base, firstName: user.patient.firstName, lastName: user.patient.lastName };
  }
  if (user.doctor) {
    return { ...base, firstName: user.doctor.firstName, lastName: user.doctor.lastName };
  }
  return base;
}

export const sendRegistrationOtpHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    await sendRegistrationOtp(email);
    res.status(200).json({ message: 'Verification code sent. Check your email.' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Could not send verification code';
    res.status(400).json({ message });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, dob, otp } = req.body;

    if (!email || !password || !firstName || !lastName || !dob || !otp) {
      res.status(400).json({ message: 'All fields including verification code are required' });
      return;
    }

    if (typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters' });
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const otpValid = await verifyRegistrationOtp(normalizedEmail, String(otp));
    if (!otpValid) {
      res.status(400).json({ message: 'Invalid or expired verification code' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        role: 'PATIENT',
        isActive: true,
        patient: {
          create: {
            firstName,
            lastName,
            dob: new Date(dob),
          },
        },
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    const base = frontendBase().replace(/\/$/, '');
    await sendEmail({
      to: normalizedEmail,
      subject: 'Welcome to QuickDoctor',
      html: welcomeEmail({
        firstName,
        dashboardUrl: `${base}/dashboard`,
        doctorsUrl: `${base}/doctors`,
      }),
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: publicUserPayload(user) });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { patient: true, doctor: true },
    });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    if (user.role === 'DOCTOR' && user.doctor) {
      if (user.doctor.status === 'REJECTED') {
        res.status(403).json({
          message: 'Your doctor application was not approved. Contact support or re-apply.',
        });
        return;
      }
      if (user.doctor.status === 'SUSPENDED') {
        res.status(403).json({ message: 'Doctor account suspended.' });
        return;
      }
      if (user.doctor.status === 'PENDING' || !user.isActive) {
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
          token,
          user: publicUserPayload(user),
          pendingApproval: true,
          message: 'Application under review. You can check status in the doctor portal.',
        });
        return;
      }
    }

    if (!user.isActive) {
      if (user.role === 'DOCTOR') {
        res.status(403).json({
          message:
            'Your doctor account is pending admin approval. Check status at /doctor/apply/status',
        });
        return;
      }
      res.status(403).json({ message: 'Account is inactive' });
      return;
    }

    if (user.role === 'DOCTOR' && user.doctor) {
      if (user.doctor.status !== 'APPROVED') {
        res.status(403).json({
          message:
            user.doctor.status === 'PENDING'
              ? 'Your application is still under review.'
              : user.doctor.status === 'REJECTED'
                ? 'Your doctor application was not approved.'
                : 'Doctor account suspended.',
        });
        return;
      }
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, user: publicUserPayload(user) });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email: email.trim() } });
    if (user?.isActive) {
      const token = jwt.sign({ id: user.id, purpose: 'password_reset' }, JWT_SECRET, {
        expiresIn: '1h',
      });
      const resetUrl = `${frontendBase()}/reset-password?token=${encodeURIComponent(token)}`;
      await sendEmail({
        to: user.email,
        subject: 'Reset your QuickDoctor password',
        html: passwordResetEmail({ resetUrl }),
      });
    }

    res.status(200).json({
      message: 'If an account exists for that email, a reset link has been sent.',
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).json({ message: 'Token and new password are required' });
      return;
    }
    if (typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters' });
      return;
    }

    let decoded: { id?: string; purpose?: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id?: string; purpose?: string };
    } catch {
      res.status(400).json({ message: 'Invalid or expired reset link' });
      return;
    }

    if (!decoded.id || decoded.purpose !== 'password_reset') {
      res.status(400).json({ message: 'Invalid or expired reset link' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || !user.isActive) {
      res.status(400).json({ message: 'Invalid or expired reset link' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

/** Validate the current JWT and return the signed-in user. */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { patient: true, doctor: true },
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    if (user.role === 'DOCTOR' && user.doctor?.status === 'PENDING') {
      res.json({ user: publicUserPayload(user), pendingApproval: true });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    res.json({ user: publicUserPayload(user) });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

/** @deprecated Use GET /api/doctors/public */
export const getDoctors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { status: 'APPROVED', profileComplete: true, user: { isActive: true } },
      include: { specialtyCategory: true },
      orderBy: { lastName: 'asc' },
    });
    res.status(200).json(doctors);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

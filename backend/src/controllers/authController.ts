import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { sendEmail, passwordResetEmail } from '../services/emailService';

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

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, dob } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
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

    if (!user.isActive) {
      if (user.role === 'DOCTOR') {
        res.status(403).json({
          message:
            'Your doctor account is pending admin approval. Apply at /doctor/apply or check your application status.',
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

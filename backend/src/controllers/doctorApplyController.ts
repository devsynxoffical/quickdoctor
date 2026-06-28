import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const applyAsDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      specialtyCategoryId,
      licenseNumber,
      licenseDocumentUrl,
      bio,
      yearsExperience,
    } = req.body;

    if (!email || !password || !firstName || !lastName || !specialtyCategoryId || !licenseNumber) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const category = await prisma.specialtyCategory.findUnique({
      where: { id: specialtyCategoryId },
    });
    if (!category || !category.isActive) {
      res.status(400).json({ message: 'Invalid specialty category' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'DOCTOR',
          isActive: false,
        },
      });

      const doctor = await tx.doctor.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          specialization: category.name,
          specialtyCategoryId: category.id,
          licenseNumber,
          bio,
          status: 'PENDING',
          profileComplete: false,
        },
      });

      const application = await tx.doctorApplication.create({
        data: {
          userId: user.id,
          specialtyCategoryId: category.id,
          licenseNumber,
          licenseDocumentUrl,
          bio,
          yearsExperience: yearsExperience ? Number(yearsExperience) : null,
          status: 'PENDING',
        },
        include: { specialtyCategory: true },
      });

      return { user, doctor, application };
    });

    res.status(201).json({
      message: 'Application submitted. You will be notified when an admin approves your account.',
      applicationId: result.application.id,
      status: 'PENDING',
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const getMyApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const payload = await buildApplicationStatusResponse(userId);
    if (!payload) {
      res.status(404).json({ message: 'No application found' });
      return;
    }

    res.json(payload);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const checkApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { doctor: true },
    });
    if (!user || user.role !== 'DOCTOR') {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const payload = await buildApplicationStatusResponse(user.id);
    if (!payload) {
      res.status(404).json({ message: 'No application found' });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({
      ...payload,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.doctor?.firstName,
        lastName: user.doctor?.lastName,
      },
      pendingApproval: payload.doctorStatus === 'PENDING' || !user.isActive,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

async function buildApplicationStatusResponse(userId: string) {
  const application = await prisma.doctorApplication.findUnique({
    where: { userId },
    include: {
      specialtyCategory: true,
      user: { select: { email: true, isActive: true } },
    },
  });

  const doctor = await prisma.doctor.findUnique({ where: { userId } });

  if (!application) return null;

  return {
    application,
    doctorStatus: doctor?.status,
    canAccessPortal: doctor?.status === 'APPROVED' && application.user.isActive,
  };
}

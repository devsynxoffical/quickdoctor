import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { getPrismaErrorMessage } from '../lib/prismaErrors';

export const listApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const status = req.query.status as string | undefined;
    const applications = await prisma.doctorApplication.findMany({
      where: status ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' } : undefined,
      include: {
        specialtyCategory: true,
        user: { select: { id: true, email: true, isActive: true, createdAt: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });
    res.json(applications);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const getApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const application = await prisma.doctorApplication.findUnique({
      where: { id },
      include: {
        specialtyCategory: true,
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
            doctor: true,
          },
        },
      },
    });
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    res.json(application);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const approveApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const adminId = req.user?.id;

    const application = await prisma.doctorApplication.findUnique({
      where: { id },
      include: { user: { include: { doctor: true } } },
    });

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    if (application.status !== 'PENDING') {
      res.status(400).json({ message: 'Application already processed' });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.doctorApplication.update({
        where: { id },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
          reviewedById: adminId,
          rejectionReason: null,
        },
      });

      await tx.user.update({
        where: { id: application.userId },
        data: { isActive: true },
      });

      if (application.user.doctor) {
        await tx.doctor.update({
          where: { id: application.user.doctor.id },
          data: { status: 'APPROVED' },
        });
      }
    });

    res.json({ message: 'Doctor approved. They can now sign in to the doctor portal.' });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const rejectApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { rejectionReason } = req.body;
    const adminId = req.user?.id;

    const application = await prisma.doctorApplication.findUnique({ where: { id } });
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    if (application.status !== 'PENDING') {
      res.status(400).json({ message: 'Application already processed' });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.doctorApplication.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectionReason: rejectionReason || 'Application not approved',
          reviewedAt: new Date(),
          reviewedById: adminId,
        },
      });

      await tx.doctor.updateMany({
        where: { userId: application.userId },
        data: { status: 'REJECTED' },
      });
    });

    res.json({ message: 'Application rejected' });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

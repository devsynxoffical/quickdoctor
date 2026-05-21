import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { logAudit } from '../services/auditService';

export const exportMyData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id!;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        patient: {
          include: {
            appointments: {
              include: { doctor: true, payment: true, prescription: true, certificate: true },
            },
            prescriptions: true,
            certificates: true,
          },
        },
        consentRecords: true,
        notifications: { take: 100, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await logAudit({
      actorId: userId,
      action: 'DATA_EXPORT',
      entityType: 'User',
      entityId: userId,
    });

    res.json({
      exportedAt: new Date().toISOString(),
      user,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const deleteMyAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id!;
    const { confirmEmail } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.email !== confirmEmail) {
      res.status(400).json({ message: 'Email confirmation does not match' });
      return;
    }

    if (user.role === 'ADMIN') {
      res.status(403).json({ message: 'Admin accounts cannot be self-deleted' });
      return;
    }

    await logAudit({
      actorId: userId,
      action: 'ACCOUNT_DELETE_REQUEST',
      entityType: 'User',
      entityId: userId,
    });

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false, email: `deleted_${Date.now()}_${user.email}` },
    });

    res.json({ message: 'Account deactivated. Contact support for full erasure.' });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const recordConsent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id!;
    const { consentType, version } = req.body;

    if (!consentType) {
      res.status(400).json({ message: 'consentType required' });
      return;
    }

    const record = await prisma.consentRecord.upsert({
      where: { userId_consentType: { userId, consentType } },
      update: { version: version || '1.0', acceptedAt: new Date() },
      create: {
        userId,
        consentType,
        version: version || '1.0',
      },
    });

    res.json(record);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

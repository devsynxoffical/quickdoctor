import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { getPrismaErrorMessage } from '../lib/prismaErrors';

async function getDoctorForUser(userId: string) {
  return prisma.doctor.findUnique({
    where: { userId },
    include: {
      specialtyCategory: true,
      availability: true,
      services: true,
      user: { select: { email: true } },
    },
  });
}

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctor = await getDoctorForUser(req.user!.id);
    if (!doctor) {
      res.status(404).json({ message: 'Doctor profile not found' });
      return;
    }
    res.json(doctor);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      firstName,
      lastName,
      bio,
      consultationFeeCents,
      specialization,
      profileComplete,
    } = req.body;

    const doctor = await prisma.doctor.update({
      where: { userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(bio !== undefined && { bio }),
        ...(consultationFeeCents !== undefined && {
          consultationFeeCents: Number(consultationFeeCents),
        }),
        ...(specialization !== undefined && { specialization }),
        ...(profileComplete !== undefined && { profileComplete: Boolean(profileComplete) }),
      },
      include: { specialtyCategory: true, availability: true, services: true },
    });

    res.json(doctor);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const updateAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    const slots: { dayOfWeek: number; startTime: string; endTime: string; slotMinutes?: number }[] =
      req.body.availability || [];

    await prisma.$transaction(async (tx) => {
      await tx.doctorAvailability.deleteMany({ where: { doctorId: doctor.id } });
      if (slots.length > 0) {
        await tx.doctorAvailability.createMany({
          data: slots.map((s) => ({
            doctorId: doctor.id,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            slotMinutes: s.slotMinutes ?? 15,
          })),
        });
      }
    });

    const updated = await getDoctorForUser(userId);
    res.json(updated);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const updateServices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    const { priceCents, durationMinutes } = req.body;
    const fee = priceCents ?? doctor.consultationFeeCents;

    await prisma.$transaction(async (tx) => {
      await tx.doctor.update({
        where: { id: doctor.id },
        data: { consultationFeeCents: Number(fee), profileComplete: true },
      });

      await tx.doctorService.upsert({
        where: {
          doctorId_type: { doctorId: doctor.id, type: 'VIDEO_CONSULTATION' },
        },
        create: {
          doctorId: doctor.id,
          type: 'VIDEO_CONSULTATION',
          priceCents: Number(fee),
          durationMinutes: durationMinutes ?? 15,
        },
        update: {
          priceCents: Number(fee),
          durationMinutes: durationMinutes ?? 15,
          isActive: true,
        },
      });
    });

    const updated = await getDoctorForUser(userId);
    res.json(updated);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

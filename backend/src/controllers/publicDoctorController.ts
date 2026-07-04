import { Request, Response } from 'express';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { generateSlotsForDay, type WeeklySlot } from '../utils/slots';
import { startOfAppDay, endOfAppDay, bookingDayOfWeek } from '../lib/appTime';
import { SLOT_OCCUPIED_STATUSES } from '../lib/appointmentSlots';

async function reviewStatsByDoctorId(doctorIds: string[]) {
  const map = new Map<string, { averageRating: number | null; reviewCount: number }>();
  if (doctorIds.length === 0) return map;

  const rows = await prisma.review.groupBy({
    by: ['doctorId'],
    where: { doctorId: { in: doctorIds } },
    _avg: { rating: true },
    _count: { rating: true },
  });

  for (const row of rows) {
    map.set(row.doctorId, {
      averageRating: row._count.rating > 0 ? row._avg.rating : null,
      reviewCount: row._count.rating,
    });
  }
  return map;
}

export const listApprovedDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = req.query.categoryId as string | undefined;

    const doctors = await prisma.doctor.findMany({
      where: {
        status: 'APPROVED',
        profileComplete: true,
        user: { isActive: true },
        ...(categoryId ? { specialtyCategoryId: categoryId } : {}),
      },
      include: {
        specialtyCategory: true,
        services: { where: { isActive: true } },
      },
      orderBy: { lastName: 'asc' },
    });

    const reviewStats = await reviewStatsByDoctorId(doctors.map((d) => d.id));

    res.json(
      doctors.map((d) => {
        const stats = reviewStats.get(d.id);
        return {
          id: d.id,
          firstName: d.firstName,
          lastName: d.lastName,
          specialization: d.specialization,
          bio: d.bio,
          consultationFeeCents: d.consultationFeeCents,
          currency: d.currency,
          category: d.specialtyCategory,
          services: d.services,
          averageRating: stats?.averageRating ?? null,
          reviewCount: stats?.reviewCount ?? 0,
        };
      })
    );
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const getDoctorPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const doctor = await prisma.doctor.findFirst({
      where: {
        id,
        status: 'APPROVED',
        profileComplete: true,
        user: { isActive: true },
      },
      include: {
        specialtyCategory: true,
        services: { where: { isActive: true } },
        availability: true,
      },
    });

    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    const reviewAggregate = await prisma.review.aggregate({
      where: { doctorId: id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    res.json({
      ...doctor,
      averageRating:
        reviewAggregate._count.rating > 0 ? reviewAggregate._avg.rating : null,
      reviewCount: reviewAggregate._count.rating,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const getDoctorSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const dateStr = req.query.date as string;
    if (!dateStr) {
      res.status(400).json({ message: 'date query required (YYYY-MM-DD)' });
      return;
    }

    const doctor = await prisma.doctor.findFirst({
      where: { id, status: 'APPROVED', user: { isActive: true } },
      include: { availability: true },
    });

    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    const dayOfWeek = bookingDayOfWeek(dateStr);

    const dayAvailability = doctor.availability.find((a) => a.dayOfWeek === dayOfWeek);
    const weekly: WeeklySlot | undefined = dayAvailability
      ? {
          dayOfWeek: dayAvailability.dayOfWeek,
          startTime: dayAvailability.startTime,
          endTime: dayAvailability.endTime,
          slotMinutes: dayAvailability.slotMinutes,
        }
      : undefined;

    const startOfDay = startOfAppDay(dateStr);
    const endOfDay = endOfAppDay(dateStr);

    const booked = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        dateTime: { gte: startOfDay, lte: endOfDay },
        status: { in: SLOT_OCCUPIED_STATUSES },
      },
      select: { dateTime: true },
    });

    const slots = generateSlotsForDay(
      weekly,
      dateStr,
      booked.map((b) => b.dateTime)
    );

    res.json({
      date: dateStr,
      consultationFeeCents: doctor.consultationFeeCents,
      currency: doctor.currency,
      slots,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

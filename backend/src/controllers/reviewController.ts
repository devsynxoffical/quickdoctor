import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { logAudit } from '../services/auditService';

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const userId = req.user?.id!;

    if (!appointmentId || !rating || rating < 1 || rating > 5) {
      res.status(400).json({ message: 'appointmentId and rating (1-5) required' });
      return;
    }

    const patient = await prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      res.status(403).json({ message: 'Patient profile required' });
      return;
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: patient.id,
        status: { in: ['COMPLETED', 'CONFIRMED'] },
      },
    });

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found or not eligible for review' });
      return;
    }

    const existing = await prisma.review.findUnique({ where: { appointmentId } });
    if (existing) {
      res.status(400).json({ message: 'You already reviewed this appointment' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        appointmentId,
        patientId: patient.id,
        doctorId: appointment.doctorId,
        rating: Number(rating),
        comment: comment || null,
      },
    });

    await logAudit({
      actorId: userId,
      action: 'REVIEW_CREATED',
      entityType: 'Review',
      entityId: review.id,
      metadata: { rating },
    });

    res.status(201).json(review);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const getDoctorReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctorId = String(req.params.doctorId);
    const where = { doctorId };

    const [reviews, aggregate] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    const count = aggregate._count.rating;
    const averageRating =
      count > 0 && aggregate._avg.rating != null ? aggregate._avg.rating : null;

    res.json({ reviews, averageRating, count });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

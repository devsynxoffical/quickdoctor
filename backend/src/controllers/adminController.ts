import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: { patient: true, doctor: true }
    });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: { user: { select: { email: true, createdAt: true } } }
    });
    res.status(200).json(doctors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const listAllAppointments = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
        payment: true,
      },
      orderBy: { dateTime: 'desc' },
      take: 100,
    });
    res.status(200).json(appointments);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error';
    res.status(500).json({ message: msg });
  }
};

export const listAllPayments = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        appointment: {
          include: { patient: true, doctor: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.status(200).json(payments);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error';
    res.status(500).json({ message: msg });
  }
};

export const getSystemStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalPatients = await prisma.patient.count();
    const totalDoctors = await prisma.doctor.count();
    const totalAppointments = await prisma.appointment.count();
    const totalRevenue = await prisma.appointment.aggregate({
      _sum: { priceCents: true },
      where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
    });

    res.status(200).json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRevenue: (totalRevenue._sum.priceCents || 0) / 100,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

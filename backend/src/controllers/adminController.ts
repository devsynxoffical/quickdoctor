import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { finalizeConfirmedAppointment } from '../services/appointmentLifecycle';

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

export const adminCreateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId, doctorId, dateTime, notes } = req.body;

    if (!patientId || !doctorId || !dateTime) {
      res.status(400).json({ message: 'patientId, doctorId, and dateTime are required' });
      return;
    }

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    const doctor = await prisma.doctor.findFirst({
      where: {
        id: doctorId,
        status: 'APPROVED',
        profileComplete: true,
        user: { isActive: true },
      },
    });

    if (!doctor) {
      res.status(404).json({ message: 'Doctor not available for booking' });
      return;
    }

    const slot = new Date(dateTime);
    if (slot <= new Date()) {
      res.status(400).json({ message: 'Cannot book a past time slot' });
      return;
    }

    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        dateTime: slot,
        status: { in: ['PENDING_PAYMENT', 'CONFIRMED', 'PENDING', 'COMPLETED'] },
      },
    });

    if (conflict) {
      res.status(400).json({ message: 'This time slot is no longer available' });
      return;
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        dateTime: slot,
        status: 'CONFIRMED',
        notes: notes || 'Booked by admin',
        priceCents: doctor.consultationFeeCents,
      },
    });

    await prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        amountCents: doctor.consultationFeeCents,
        originalAmountCents: doctor.consultationFeeCents,
        currency: doctor.currency,
        status: 'SUCCEEDED',
        paidAt: new Date(),
      },
    });

    await finalizeConfirmedAppointment(appointment.id, req.user?.id);

    res.status(201).json({
      message: 'Appointment booked and confirmed',
      appointmentId: appointment.id,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
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

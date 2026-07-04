import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';

function paramId(id: string | string[] | undefined): string | undefined {
  if (id === undefined) return undefined;
  return Array.isArray(id) ? id[0] : id;
}

export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(400).json({
    message: 'Use POST /api/payments/checkout to book and pay for an appointment.',
  });
};

export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let appointments;

    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId: userId! } });
      if (!patient) {
        res.status(200).json([]);
        return;
      }
      appointments = await prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: { doctor: { include: { specialtyCategory: true } }, payment: true },
        orderBy: { dateTime: 'desc' },
      });
    } else if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId: userId! } });
      if (!doctor) {
        res.status(200).json([]);
        return;
      }
      appointments = await prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: { patient: true, payment: true },
        orderBy: { dateTime: 'desc' },
      });
    } else {
      appointments = await prisma.appointment.findMany({
        include: { patient: true, doctor: true, payment: true },
        orderBy: { dateTime: 'desc' },
      });
    }

    res.status(200).json(appointments);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const getAppointmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = paramId(req.params.id);
    if (!id) {
      res.status(400).json({ message: 'Appointment id required' });
      return;
    }
    const userId = req.user?.id;
    const role = req.user?.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { email: true } } } },
        doctor: { include: { specialtyCategory: true } },
        prescription: true,
        certificate: true,
        payment: true,
      },
    });

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    if (role === 'ADMIN') {
      res.status(200).json(appointment);
      return;
    }

    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId: userId! } });
      if (!patient || appointment.patientId !== patient.id) {
        res.status(403).json({ message: 'You cannot view this appointment' });
        return;
      }
    } else if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId: userId! } });
      if (!doctor || appointment.doctorId !== doctor.id) {
        res.status(403).json({ message: 'You cannot view this appointment' });
        return;
      }
    } else {
      res.status(403).json({ message: 'Unauthorized access' });
      return;
    }

    res.status(200).json(appointment);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = paramId(req.params.id);
    if (!id) {
      res.status(400).json({ message: 'Appointment id required' });
      return;
    }
    const { status } = req.body;
    const userId = req.user?.id;
    const role = req.user?.role;

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId: userId! } });
      if (!doctor || existing.doctorId !== doctor.id) {
        res.status(403).json({ message: 'You cannot update this appointment' });
        return;
      }
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    res.status(200).json(appointment);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const updateClinicalNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = paramId(req.params.id);
    const { clinicalNotes } = req.body;
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!id) {
      res.status(400).json({ message: 'Appointment id required' });
      return;
    }

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId: userId! } });
      if (!doctor || existing.doctorId !== doctor.id) {
        res.status(403).json({ message: 'You cannot update this appointment' });
        return;
      }
    } else if (role !== 'ADMIN') {
      res.status(403).json({ message: 'Only doctors can save clinical notes' });
      return;
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { clinicalNotes: clinicalNotes ?? null, notes: clinicalNotes ?? existing.notes },
    });

    res.status(200).json(appointment);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const completeConsultation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = paramId(req.params.id);
    const userId = req.user?.id;
    if (!id || !userId) {
      res.status(400).json({ message: 'Invalid request' });
      return;
    }

    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) {
      res.status(403).json({ message: 'Doctor profile not found' });
      return;
    }

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing || existing.doctorId !== doctor.id) {
      res.status(403).json({ message: 'You cannot update this appointment' });
      return;
    }

    if (existing.status !== 'CONFIRMED') {
      res.status(400).json({ message: 'Only confirmed consultations can be completed' });
      return;
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'COMPLETED' },
      include: { patient: true, prescription: true, certificate: true },
    });

    res.status(200).json(appointment);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const cancelPendingAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = paramId(req.params.id);
    const userId = req.user?.id;
    const patient = await prisma.patient.findUnique({ where: { userId: userId! } });

    const appointment = await prisma.appointment.findFirst({
      where: { id, patientId: patient?.id, status: 'PENDING_PAYMENT' },
    });

    if (!appointment) {
      res.status(404).json({ message: 'Pending appointment not found' });
      return;
    }

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'CANCELLED' },
    });

    res.json({ message: 'Appointment cancelled' });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

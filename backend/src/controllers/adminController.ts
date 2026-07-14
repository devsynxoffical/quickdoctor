import { Response } from 'express';
import { DoctorStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { finalizeConfirmedAppointment } from '../services/appointmentLifecycle';
import { findOccupiedSlotConflict, normalizeSlotTime } from '../lib/appointmentSlots';
import { normalizeEmail } from '../services/otpService';

const DOCTOR_STATUSES: DoctorStatus[] = ['APPROVED', 'SUSPENDED', 'REJECTED', 'PENDING'];

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
      include: { user: { select: { email: true, isActive: true, createdAt: true } } }
    });
    res.status(200).json(doctors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = String(req.params.userId);
    const { email, firstName, lastName, phone, address, dob, isActive } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { patient: true },
    });

    if (!user || user.role !== 'PATIENT' || !user.patient) {
      res.status(404).json({ message: 'Patient not found' });
      return;
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || !email.trim()) {
        res.status(400).json({ message: 'Valid email is required' });
        return;
      }
      const normalized = normalizeEmail(email);
      if (normalized !== user.email) {
        const taken = await prisma.user.findUnique({ where: { email: normalized } });
        if (taken) {
          res.status(400).json({ message: 'Email is already in use' });
          return;
        }
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(email !== undefined ? { email: normalizeEmail(String(email)) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
        patient: {
          update: {
            ...(firstName !== undefined ? { firstName: String(firstName) } : {}),
            ...(lastName !== undefined ? { lastName: String(lastName) } : {}),
            ...(phone !== undefined ? { phone: phone ? String(phone) : null } : {}),
            ...(address !== undefined ? { address: address ? String(address) : null } : {}),
            ...(dob !== undefined ? { dob: new Date(dob) } : {}),
          },
        },
      },
      include: { patient: true },
    });

    res.status(200).json(updated);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const updateDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctorId = String(req.params.doctorId);
    const {
      firstName,
      lastName,
      specialization,
      licenseNumber,
      bio,
      consultationFeeCents,
      profileComplete,
      email,
      isActive,
      status,
    } = req.body;

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { user: true },
    });

    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    if (status !== undefined && !DOCTOR_STATUSES.includes(status)) {
      res.status(400).json({
        message: 'status must be APPROVED, SUSPENDED, REJECTED, or PENDING',
      });
      return;
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || !email.trim()) {
        res.status(400).json({ message: 'Valid email is required' });
        return;
      }
      const normalized = normalizeEmail(email);
      if (normalized !== doctor.user.email) {
        const taken = await prisma.user.findUnique({ where: { email: normalized } });
        if (taken) {
          res.status(400).json({ message: 'Email is already in use' });
          return;
        }
      }
    }

    if (licenseNumber !== undefined) {
      const license = String(licenseNumber).trim();
      if (!license) {
        res.status(400).json({ message: 'licenseNumber is required' });
        return;
      }
      if (license !== doctor.licenseNumber) {
        const taken = await prisma.doctor.findUnique({ where: { licenseNumber: license } });
        if (taken) {
          res.status(400).json({ message: 'License number is already in use' });
          return;
        }
      }
    }

    if (consultationFeeCents !== undefined) {
      const fee = Number(consultationFeeCents);
      if (!Number.isFinite(fee) || fee < 0) {
        res.status(400).json({ message: 'consultationFeeCents must be a non-negative number' });
        return;
      }
    }

    const updated = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        ...(firstName !== undefined ? { firstName: String(firstName) } : {}),
        ...(lastName !== undefined ? { lastName: String(lastName) } : {}),
        ...(specialization !== undefined ? { specialization: String(specialization) } : {}),
        ...(licenseNumber !== undefined ? { licenseNumber: String(licenseNumber).trim() } : {}),
        ...(bio !== undefined ? { bio: bio ? String(bio) : null } : {}),
        ...(consultationFeeCents !== undefined
          ? { consultationFeeCents: Math.floor(Number(consultationFeeCents)) }
          : {}),
        ...(profileComplete !== undefined ? { profileComplete: Boolean(profileComplete) } : {}),
        ...(status !== undefined ? { status: status as DoctorStatus } : {}),
        user: {
          update: {
            ...(email !== undefined ? { email: normalizeEmail(String(email)) } : {}),
            ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
          },
        },
      },
      include: { user: { select: { email: true, isActive: true, createdAt: true } } },
    });

    res.status(200).json(updated);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
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

    const slot = normalizeSlotTime(dateTime);
    if (slot <= new Date()) {
      res.status(400).json({ message: 'Cannot book a past time slot' });
      return;
    }

    const conflict = await findOccupiedSlotConflict(doctorId, slot);

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

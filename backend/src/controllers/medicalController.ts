import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { logAudit } from '../services/auditService';
import { notifyCertificateIssued, notifyPrescriptionIssued } from '../services/notificationService';
import {
  normalizePrescriptionItems,
  summarizePrescriptionItems,
} from '../lib/prescriptionItems';

async function assertDoctorOwnsAppointment(userId: string, appointmentId: string) {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) return { error: 'Doctor profile not found', status: 403 as const };

  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment || appointment.doctorId !== doctor.id) {
    return { error: 'Invalid appointment for this doctor', status: 403 as const };
  }

  if (!['CONFIRMED', 'COMPLETED'].includes(appointment.status)) {
    return { error: 'Prescriptions can only be issued for confirmed consultations', status: 400 as const };
  }

  return { doctor, appointment };
}

export const issuePrescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId, patientId } = req.body;
    const userId = req.user?.id!;

    const check = await assertDoctorOwnsAppointment(userId, appointmentId);
    if ('error' in check) {
      res.status(check.status ?? 403).json({ message: check.error });
      return;
    }

    const { appointment } = check;
    if (appointment.patientId !== patientId) {
      res.status(400).json({ message: 'Patient does not match appointment' });
      return;
    }

    const items = normalizePrescriptionItems(req.body);
    if (items.length === 0) {
      res.status(400).json({ message: 'Add at least one medicine with name and dosage' });
      return;
    }

    const summary = summarizePrescriptionItems(items);
    const existing = await prisma.prescription.findUnique({ where: { appointmentId } });

    const prescription = existing
      ? await prisma.prescription.update({
          where: { appointmentId },
          data: {
            medications: summary.medications,
            dosage: summary.dosage,
            instructions: summary.instructions,
            items: summary.items,
          },
        })
      : await prisma.prescription.create({
          data: {
            appointmentId,
            patientId,
            medications: summary.medications,
            dosage: summary.dosage,
            instructions: summary.instructions,
            items: summary.items,
          },
        });

    const patientUser = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { userId: true },
    });
    if (patientUser && !existing) {
      await notifyPrescriptionIssued(patientUser.userId, appointmentId);
    }

    await logAudit({
      actorId: userId,
      action: existing ? 'PRESCRIPTION_UPDATED' : 'PRESCRIPTION_ISSUED',
      entityType: 'Prescription',
      entityId: prescription.id,
      metadata: { appointmentId, itemCount: items.length },
    });

    res.status(existing ? 200 : 201).json(prescription);
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
};

export const issueCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId, patientId, reason, startDate, endDate } = req.body;
    const userId = req.user?.id!;

    const check = await assertDoctorOwnsAppointment(userId, appointmentId);
    if ('error' in check) {
      res.status(check.status ?? 403).json({ message: check.error });
      return;
    }

    const { appointment } = check;
    if (appointment.patientId !== patientId) {
      res.status(400).json({ message: 'Patient does not match appointment' });
      return;
    }

    if (!reason?.trim() || !startDate || !endDate) {
      res.status(400).json({ message: 'Reason, start date, and end date are required' });
      return;
    }

    const existing = await prisma.medicalCertificate.findUnique({ where: { appointmentId } });
    const certificate = existing
      ? await prisma.medicalCertificate.update({
          where: { appointmentId },
          data: {
            reason: String(reason).trim(),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          },
        })
      : await prisma.medicalCertificate.create({
          data: {
            appointmentId,
            patientId,
            reason: String(reason).trim(),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          },
        });

    const patientUser = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { userId: true },
    });
    if (patientUser && !existing) {
      await notifyCertificateIssued(patientUser.userId, appointmentId);
    }

    await logAudit({
      actorId: userId,
      action: existing ? 'CERTIFICATE_UPDATED' : 'CERTIFICATE_ISSUED',
      entityType: 'MedicalCertificate',
      entityId: certificate.id,
      metadata: { appointmentId },
    });

    res.status(existing ? 200 : 201).json(certificate);
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
};

export const getDoctorPrescriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user!.id } });
    if (!doctor) {
      res.status(200).json([]);
      return;
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { appointment: { doctorId: doctor.id } },
      include: {
        appointment: { include: { patient: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });

    res.status(200).json(prescriptions);
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
};

export const getDoctorCertificates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user!.id } });
    if (!doctor) {
      res.status(200).json([]);
      return;
    }

    const certificates = await prisma.medicalCertificate.findMany({
      where: { appointment: { doctorId: doctor.id } },
      include: {
        appointment: { include: { patient: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });

    res.status(200).json(certificates);
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
};

export const getMyPrescriptions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const patient = await prisma.patient.findUnique({ where: { userId: userId! } });
    if (!patient) {
      res.status(200).json([]);
      return;
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: patient.id },
      include: { appointment: { include: { doctor: true } } },
      orderBy: { issuedAt: 'desc' },
    });

    res.status(200).json(prescriptions);
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
};

export const getMyCertificates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const patient = await prisma.patient.findUnique({ where: { userId: userId! } });
    if (!patient) {
      res.status(200).json([]);
      return;
    }

    const certificates = await prisma.medicalCertificate.findMany({
      where: { patientId: patient.id },
      include: { appointment: { include: { doctor: true } } },
      orderBy: { issuedAt: 'desc' },
    });

    res.status(200).json(certificates);
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
};

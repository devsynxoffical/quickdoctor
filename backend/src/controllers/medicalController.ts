import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { logAudit } from '../services/auditService';
import { notifyPrescriptionIssued } from '../services/notificationService';

export const issuePrescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId, patientId, medications, dosage, instructions } = req.body;
    const userId = req.user?.id;

    const doctor = await prisma.doctor.findUnique({ where: { userId: userId! } });
    if (!doctor) {
      res.status(403).json({ message: 'Doctor profile not found' });
      return;
    }

    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment || appointment.doctorId !== doctor.id) {
      res.status(403).json({ message: 'Invalid appointment for this doctor' });
      return;
    }
    if (appointment.patientId !== patientId) {
      res.status(400).json({ message: 'Patient does not match appointment' });
      return;
    }

    const existing = await prisma.prescription.findUnique({ where: { appointmentId } });
    if (existing) {
      res.status(400).json({ message: 'A prescription already exists for this appointment' });
      return;
    }

    const prescription = await prisma.prescription.create({
      data: {
        appointmentId,
        patientId,
        medications,
        dosage,
        instructions
      }
    });

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'COMPLETED' },
    });

    const patientUser = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { userId: true },
    });
    if (patientUser) {
      await notifyPrescriptionIssued(patientUser.userId, appointmentId);
    }

    await logAudit({
      actorId: userId,
      action: 'PRESCRIPTION_ISSUED',
      entityType: 'Prescription',
      entityId: prescription.id,
      metadata: { appointmentId },
    });

    res.status(201).json(prescription);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const issueCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId, patientId, reason, startDate, endDate } = req.body;
    const userId = req.user?.id;

    const doctor = await prisma.doctor.findUnique({ where: { userId: userId! } });
    if (!doctor) {
      res.status(403).json({ message: 'Doctor profile not found' });
      return;
    }

    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment || appointment.doctorId !== doctor.id) {
      res.status(403).json({ message: 'Invalid appointment for this doctor' });
      return;
    }
    if (appointment.patientId !== patientId) {
      res.status(400).json({ message: 'Patient does not match appointment' });
      return;
    }

    const existing = await prisma.medicalCertificate.findUnique({ where: { appointmentId } });
    if (existing) {
      res.status(400).json({ message: 'A certificate already exists for this appointment' });
      return;
    }

    const certificate = await prisma.medicalCertificate.create({
      data: {
        appointmentId,
        patientId,
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'COMPLETED' },
    });

    await logAudit({
      actorId: userId,
      action: 'CERTIFICATE_ISSUED',
      entityType: 'MedicalCertificate',
      entityId: certificate.id,
      metadata: { appointmentId },
    });

    res.status(201).json(certificate);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

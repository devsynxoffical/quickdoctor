import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import {
  ensureZoomMeetingForAppointment,
  getJoinUrlForRole,
} from '../services/zoomService';

function paramId(id: string | string[] | undefined): string | undefined {
  if (id === undefined) return undefined;
  return Array.isArray(id) ? id[0] : id;
}

export const getAppointmentJoin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = paramId(req.params.id);
    const role = req.user?.role;
    const userId = req.user?.id;

    if (!id || !role || !userId) {
      res.status(400).json({ message: 'Invalid request' });
      return;
    }

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient || appointment.patientId !== patient.id) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    } else if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      if (!doctor || appointment.doctorId !== doctor.id) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    } else if (role !== 'ADMIN') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    let appt = appointment;
    if (!appt.zoomMeetingId && appt.status === 'CONFIRMED') {
      appt = (await ensureZoomMeetingForAppointment(id))!;
    }

    const joinRole = role === 'DOCTOR' ? 'DOCTOR' : 'PATIENT';
    const result = getJoinUrlForRole(appt, joinRole);

    res.json({
      ...result,
      appointmentId: id,
      dateTime: appt.dateTime,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const createZoomMeeting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = paramId(req.params.id);
    if (!id) {
      res.status(400).json({ message: 'Appointment id required' });
      return;
    }

    const updated = await ensureZoomMeetingForAppointment(id);
    res.json(updated);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

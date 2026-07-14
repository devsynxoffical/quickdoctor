import { formatAppDateTime } from '../lib/appTime';
import { Response, Request } from 'express';
import Stripe from 'stripe';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { finalizeConfirmedAppointment } from '../services/appointmentLifecycle';
import { isMaintenanceBlocking } from '../services/siteSettingsService';
import { applyCoupon, incrementCouponUsage } from '../services/couponService';
import { findOccupiedSlotConflict, prepareCheckoutAppointment, normalizeSlotTime, SlotTakenError } from '../lib/appointmentSlots';
import { pickServiceDoctorId, reserveAsyncReviewSlot } from '../lib/asyncServiceSlots';
import { CERTIFICATE_PRICE_CENTS, PRESCRIPTION_REVIEW_PRICE_CENTS } from '../lib/servicePricing';
import { sendEmail, temporaryPasswordEmail } from '../services/emailService';
import { normalizeEmail } from '../services/otpService';
import type { AppointmentServiceType } from '@prisma/client';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function frontendBase() {
  const raw = process.env.FRONTEND_URL || 'http://localhost:3000';
  return raw.split(',')[0].trim().replace(/\/$/, '');
}

function getStripe() {
  if (!stripeSecret) return null;
  return new Stripe(stripeSecret);
}

function generateTempPassword(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

const HOLD_MINUTES = 15;
const STRIPE_MIN_CENTS = 50;

type CheckoutResult =
  | { ok: true; status: number; body: Record<string, unknown> }
  | { ok: false; status: number; body: Record<string, unknown> };

async function runVideoCheckout(params: {
  patientId: string;
  userId: string;
  customerEmail?: string | null;
  doctorId: string;
  dateTime: string;
  notes?: string;
  couponCode?: string;
}): Promise<CheckoutResult> {
  const { patientId, userId, doctorId, dateTime, notes, couponCode } = params;

  const doctor = await prisma.doctor.findFirst({
    where: {
      id: doctorId,
      status: 'APPROVED',
      profileComplete: true,
      user: { isActive: true },
    },
  });

  if (!doctor) {
    return { ok: false, status: 404, body: { message: 'Doctor not available for booking' } };
  }

  const slot = normalizeSlotTime(dateTime);
  if (slot <= new Date()) {
    return { ok: false, status: 400, body: { message: 'Cannot book a past time slot' } };
  }

  const conflict = await findOccupiedSlotConflict(doctorId, slot);
  if (conflict) {
    return { ok: false, status: 400, body: { message: 'This time slot is no longer available' } };
  }

  let pricing;
  try {
    pricing = await applyCoupon(couponCode, doctor.consultationFeeCents);
  } catch (couponError: unknown) {
    return {
      ok: false,
      status: 400,
      body: {
        message: couponError instanceof Error ? couponError.message : 'Invalid coupon',
      },
    };
  }

  const originalCents = doctor.consultationFeeCents;
  const amountCents = pricing.finalCents;
  const holdExpiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);

  let appointment;
  let checkoutReused = false;
  try {
    const prepared = await prepareCheckoutAppointment({
      patientId,
      doctorId: doctor.id,
      dateTime: slot,
      notes,
      priceCents: amountCents,
      holdExpiresAt,
    });
    appointment = prepared.appointment;
    checkoutReused = prepared.reused;
  } catch (error) {
    if (error instanceof SlotTakenError) {
      return { ok: false, status: 400, body: { message: error.message } };
    }
    throw error;
  }

  const paymentData = {
    appointmentId: appointment.id,
    amountCents,
    originalAmountCents: originalCents,
    discountCents: pricing.discountCents,
    couponId: pricing.couponId || null,
    currency: doctor.currency,
    status: 'PENDING' as const,
  };

  const stripe = getStripe();

  const upsertPendingPayment = async (extra?: { stripeSessionId?: string }) => {
    if (checkoutReused) {
      return prisma.payment.upsert({
        where: { appointmentId: appointment.id },
        create: { ...paymentData, ...extra },
        update: {
          ...paymentData,
          ...extra,
          paidAt: null,
          stripePaymentIntentId: null,
        },
      });
    }
    return prisma.payment.create({ data: { ...paymentData, ...extra } });
  };

  if (!stripe || amountCents < STRIPE_MIN_CENTS) {
    const payment = await upsertPendingPayment();

    if (amountCents < STRIPE_MIN_CENTS) {
      const result = await confirmAppointmentPayment(
        appointment.id,
        payment.id,
        pricing.couponId,
        userId
      );
      if (!result.confirmed) {
        return {
          ok: false,
          status: 409,
          body: { message: result.message || 'This time slot is no longer available' },
        };
      }
      return {
        ok: true,
        status: 201,
        body: {
          message: amountCents === 0 ? 'Booking confirmed with coupon' : 'Booking confirmed',
          appointmentId: appointment.id,
          freeCheckout: true,
        },
      };
    }

    return {
      ok: true,
      status: 200,
      body: {
        message:
          'Stripe is not configured. Complete booking in test mode or set STRIPE_SECRET_KEY in backend/.env.',
        appointmentId: appointment.id,
        testMode: true,
        devConfirmUrl: `${frontendBase()}/dashboard/appointments?confirmDev=${appointment.id}`,
      },
    };
  }

  const patientUser =
    params.customerEmail != null
      ? { email: params.customerEmail }
      : await prisma.user.findUnique({ where: { id: userId } });

  const lineDescription = pricing.discountCents
    ? `${formatAppDateTime(dateTime)} (coupon ${pricing.code}: -€${(pricing.discountCents / 100).toFixed(2)})`
    : formatAppDateTime(dateTime);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: patientUser?.email || undefined,
    line_items: [
      {
        price_data: {
          currency: doctor.currency.toLowerCase(),
          unit_amount: amountCents,
          product_data: {
            name: `Video consultation with Dr. ${doctor.lastName}`,
            description: lineDescription,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      appointmentId: appointment.id,
      patientId,
      doctorId: doctor.id,
      couponId: pricing.couponId || '',
    },
    success_url: `${frontendBase()}/dashboard/appointments?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendBase()}/dashboard/appointments?payment=cancelled&appointmentId=${appointment.id}`,
  });

  await upsertPendingPayment({ stripeSessionId: session.id });

  return {
    ok: true,
    status: 201,
    body: {
      checkoutUrl: session.url,
      sessionId: session.id,
      appointmentId: appointment.id,
      discountCents: pricing.discountCents,
      finalAmountCents: amountCents,
    },
  };
}

async function confirmAppointmentPayment(
  appointmentId: string,
  paymentId: string,
  couponId?: string | null,
  actorUserId?: string,
  stripePaymentIntentId?: string
): Promise<{ confirmed: boolean; message?: string }> {
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) {
    return { confirmed: false, message: 'Appointment not found' };
  }

  if (appointment.status !== 'PENDING_PAYMENT') {
    return { confirmed: true };
  }

  const skipSlotConflict =
    appointment.serviceType === 'MEDICAL_CERTIFICATE' ||
    appointment.serviceType === 'PRESCRIPTION_REVIEW';

  if (!skipSlotConflict) {
    const conflict = await findOccupiedSlotConflict(
      appointment.doctorId,
      appointment.dateTime,
      appointmentId
    );

    if (conflict) {
      await prisma.$transaction([
        prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: 'CANCELLED', holdExpiresAt: null },
        }),
        prisma.payment.update({
          where: { id: paymentId },
          data: { status: 'FAILED' },
        }),
      ]);

      const stripe = getStripe();
      if (stripe && stripePaymentIntentId) {
        try {
          await stripe.refunds.create({ payment_intent: stripePaymentIntentId });
          await prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'REFUNDED' },
          });
        } catch {
          /* refund may need manual handling */
        }
      }

      return {
        confirmed: false,
        message:
          'This time slot was just booked by someone else. If you were charged, a refund will be processed.',
      };
    }
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'SUCCEEDED',
        paidAt: new Date(),
        ...(stripePaymentIntentId ? { stripePaymentIntentId } : {}),
      },
    }),
    prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CONFIRMED', holdExpiresAt: null },
    }),
  ]);
  await incrementCouponUsage(couponId);
  await finalizeConfirmedAppointment(appointmentId, actorUserId);
  return { confirmed: true };
}

type StripeWebhookEvent = {
  type: string;
  data: {
    object: {
      id: string;
      metadata?: Record<string, string>;
      payment_intent?: string | { id: string };
    };
  };
};

export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const maintenance = await isMaintenanceBlocking(req.user?.role);
    if (maintenance.blocked) {
      res.status(503).json({ message: maintenance.message, maintenanceMode: true });
      return;
    }

    const { doctorId, dateTime, notes, couponCode } = req.body;
    const userId = req.user?.id;

    if (!doctorId || !dateTime) {
      res.status(400).json({ message: 'doctorId and dateTime are required' });
      return;
    }

    const patient = await prisma.patient.findUnique({ where: { userId: userId! } });
    if (!patient) {
      res.status(404).json({ message: 'Patient profile not found' });
      return;
    }

    const result = await runVideoCheckout({
      patientId: patient.id,
      userId: userId!,
      doctorId,
      dateTime,
      notes,
      couponCode,
    });

    res.status(result.status).json(result.body);
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const createGuestCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const maintenance = await isMaintenanceBlocking(undefined);
    if (maintenance.blocked) {
      res.status(503).json({ message: maintenance.message, maintenanceMode: true });
      return;
    }

    const { doctorId, dateTime, notes, couponCode, email, firstName, lastName, phone, dob } =
      req.body;

    if (!doctorId || !dateTime || !email || !firstName || !lastName || !dob) {
      res.status(400).json({
        message: 'doctorId, dateTime, email, firstName, lastName, and dob are required',
      });
      return;
    }

    const normalizedEmail = normalizeEmail(String(email));
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (existingUser) {
      if (existingUser.role === 'PATIENT' && existingUser.isActive) {
        res.status(409).json({
          requiresLogin: true,
          message: 'Account exists. Please log in to continue booking.',
        });
        return;
      }
      res.status(400).json({
        message:
          existingUser.role === 'PATIENT'
            ? 'This email belongs to an inactive account. Contact support or use another email.'
            : 'This email belongs to a doctor or admin account and cannot use guest checkout.',
      });
      return;
    }

    const tempPassword = generateTempPassword(10);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        role: 'PATIENT',
        isActive: true,
        patient: {
          create: {
            firstName: String(firstName),
            lastName: String(lastName),
            dob: new Date(dob),
            phone: phone ? String(phone) : null,
          },
        },
      },
      include: { patient: true, doctor: true },
    });

    const loginUrl = `${frontendBase()}/login`;
    await sendEmail({
      to: normalizedEmail,
      subject: 'Your QuickDoctor account',
      html: temporaryPasswordEmail({
        firstName: String(firstName),
        email: normalizedEmail,
        tempPassword,
        loginUrl,
      }),
    });

    const patient = user.patient!;
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    const publicUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: patient.firstName,
      lastName: patient.lastName,
    };

    const result = await runVideoCheckout({
      patientId: patient.id,
      userId: user.id,
      customerEmail: normalizedEmail,
      doctorId,
      dateTime,
      notes,
      couponCode,
    });

    res.status(result.status).json({
      ...result.body,
      token,
      user: publicUser,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

/** Confirm appointment without Stripe when Stripe keys are not configured */
export const devConfirmPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  if (getStripe()) {
    res.status(400).json({ message: 'Stripe is configured — use checkout instead' });
    return;
  }

  try {
    const appointmentId = String(req.params.appointmentId);
    const userId = req.user?.id;
    const patient = await prisma.patient.findUnique({ where: { userId: userId! } });

    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, patientId: patient?.id },
    });

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    const payment = await prisma.payment.findFirst({ where: { appointmentId } });

    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    if (payment.status !== 'SUCCEEDED') {
      const result = await confirmAppointmentPayment(
        appointmentId,
        payment.id,
        payment.couponId,
        userId
      );
      if (!result.confirmed) {
        res.status(409).json({ message: result.message || 'This time slot is no longer available' });
        return;
      }
    }

    res.json({ message: 'Payment confirmed (dev mode)', appointmentId });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    res.status(503).send('Stripe webhook not configured');
    return;
  }

  const sig = req.headers['stripe-signature'];
  if (!sig || typeof sig !== 'string') {
    res.status(400).send('Missing signature');
    return;
  }

  let event: StripeWebhookEvent;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    ) as StripeWebhookEvent;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Webhook error';
    res.status(400).send(`Webhook Error: ${msg}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const appointmentId = session.metadata?.appointmentId;

    if (appointmentId) {
      const payment = await prisma.payment.findFirst({
        where: { appointmentId, stripeSessionId: session.id },
      });

      if (payment && payment.status !== 'SUCCEEDED') {
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;

        await confirmAppointmentPayment(
          appointmentId,
          payment.id,
          payment.couponId,
          undefined,
          paymentIntentId
        );
      }
    }
  }

  res.json({ received: true });
};

export const getCheckoutStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessionId = req.query.session_id as string;
    if (!sessionId) {
      res.status(400).json({ message: 'session_id required' });
      return;
    }

    let payment = await prisma.payment.findFirst({
      where: { stripeSessionId: sessionId },
      include: {
        appointment: { include: { doctor: true, patient: true } },
      },
    });

    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    if (req.user?.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
      if (!patient || payment.appointment.patientId !== patient.id) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    const stripe = getStripe();
    if (stripe && payment.status === 'PENDING' && payment.stripeSessionId) {
      const session = await stripe.checkout.sessions.retrieve(payment.stripeSessionId);
      if (session.payment_status === 'paid') {
        const appointmentId = payment.appointmentId;
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;

        await confirmAppointmentPayment(
          appointmentId,
          payment.id,
          payment.couponId,
          req.user?.id,
          paymentIntentId
        );

        payment = (await prisma.payment.findFirst({
          where: { id: payment.id },
          include: { appointment: { include: { doctor: true, patient: true } } },
        }))!;
      }
    }

    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    const slotUnavailable =
      payment.status === 'FAILED' || payment.status === 'REFUNDED'
        ? 'This time slot was just booked by someone else. If you were charged, a refund will be processed.'
        : payment.appointment.status === 'CANCELLED' && payment.status === 'SUCCEEDED'
          ? 'This time slot is no longer available.'
          : undefined;

    res.json({
      status: payment.status,
      appointment: payment.appointment,
      slotUnavailable,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

const SERVICE_TYPES: AppointmentServiceType[] = [
  'MEDICAL_CERTIFICATE',
  'PRESCRIPTION_REVIEW',
];

export const createServiceCheckout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const maintenance = await isMaintenanceBlocking(req.user?.role);
    if (maintenance.blocked) {
      res.status(503).json({ message: maintenance.message, maintenanceMode: true });
      return;
    }

    const { serviceType, serviceSlug, serviceName, payload, couponCode } = req.body;
    const userId = req.user?.id;

    if (!serviceType || !SERVICE_TYPES.includes(serviceType)) {
      res.status(400).json({ message: 'Valid serviceType is required' });
      return;
    }

    if (!serviceName || typeof serviceName !== 'string') {
      res.status(400).json({ message: 'serviceName is required' });
      return;
    }

    if (payload !== undefined && (typeof payload !== 'object' || payload === null || Array.isArray(payload))) {
      res.status(400).json({ message: 'payload must be an object' });
      return;
    }

    const patient = await prisma.patient.findUnique({ where: { userId: userId! } });
    if (!patient) {
      res.status(404).json({ message: 'Patient profile not found' });
      return;
    }

    const originalCents =
      serviceType === 'MEDICAL_CERTIFICATE'
        ? CERTIFICATE_PRICE_CENTS
        : PRESCRIPTION_REVIEW_PRICE_CENTS;

    let pricing;
    try {
      pricing = await applyCoupon(couponCode, originalCents);
    } catch (couponError: unknown) {
      res.status(400).json({
        message: couponError instanceof Error ? couponError.message : 'Invalid coupon',
      });
      return;
    }

    const amountCents = pricing.finalCents;
    const doctorId = await pickServiceDoctorId();
    const dateTime = await reserveAsyncReviewSlot(doctorId);
    const holdExpiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);

    const notes =
      serviceType === 'MEDICAL_CERTIFICATE'
        ? `Medical certificate request${serviceSlug ? `: ${serviceSlug}` : ''}`
        : `Prescription review: ${serviceName}`;

    const prepared = await prepareCheckoutAppointment({
      patientId: patient.id,
      doctorId,
      dateTime,
      notes,
      priceCents: amountCents,
      holdExpiresAt,
      serviceType,
      serviceSlug: typeof serviceSlug === 'string' ? serviceSlug : undefined,
      serviceName,
      requestPayload: payload ?? {},
    });

    const appointment = prepared.appointment;
    const checkoutReused = prepared.reused;

    const paymentData = {
      appointmentId: appointment.id,
      amountCents,
      originalAmountCents: originalCents,
      discountCents: pricing.discountCents,
      couponId: pricing.couponId || null,
      currency: 'EUR',
      status: 'PENDING' as const,
    };

    const stripe = getStripe();

    const upsertPendingPayment = async (extra?: { stripeSessionId?: string }) => {
      if (checkoutReused) {
        return prisma.payment.upsert({
          where: { appointmentId: appointment.id },
          create: { ...paymentData, ...extra },
          update: {
            ...paymentData,
            ...extra,
            paidAt: null,
            stripePaymentIntentId: null,
          },
        });
      }
      return prisma.payment.create({ data: { ...paymentData, ...extra } });
    };

    if (!stripe || amountCents < STRIPE_MIN_CENTS) {
      const payment = await upsertPendingPayment();

      if (amountCents < STRIPE_MIN_CENTS) {
        const result = await confirmAppointmentPayment(
          appointment.id,
          payment.id,
          pricing.couponId,
          userId!
        );
        if (!result.confirmed) {
          res.status(409).json({ message: result.message || 'Could not confirm request' });
          return;
        }
        res.status(201).json({
          message: amountCents === 0 ? 'Request confirmed with coupon' : 'Request confirmed',
          appointmentId: appointment.id,
          freeCheckout: true,
        });
        return;
      }

      res.status(200).json({
        message:
          'Stripe is not configured. Complete in test mode or set STRIPE_SECRET_KEY in backend/.env.',
        appointmentId: appointment.id,
        testMode: true,
        devConfirmUrl: `${frontendBase()}/dashboard/appointments?confirmDev=${appointment.id}`,
      });
      return;
    }

    const patientUser = await prisma.user.findUnique({ where: { id: userId! } });
    const productLabel =
      serviceType === 'MEDICAL_CERTIFICATE'
        ? 'Medical certificate review'
        : `Prescription review — ${serviceName}`;

    const lineDescription = pricing.discountCents
      ? `${serviceName} (coupon ${pricing.code}: -€${(pricing.discountCents / 100).toFixed(2)})`
      : 'Reviewed by an Irish-registered GP within 1 business day';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: patientUser?.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: amountCents,
            product_data: {
              name: productLabel,
              description: lineDescription,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointment.id,
        patientId: patient.id,
        doctorId,
        couponId: pricing.couponId || '',
        serviceType,
      },
      success_url: `${frontendBase()}/dashboard/appointments?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendBase()}/dashboard/appointments?payment=cancelled&appointmentId=${appointment.id}`,
    });

    await upsertPendingPayment({ stripeSessionId: session.id });

    res.status(201).json({
      checkoutUrl: session.url,
      sessionId: session.id,
      appointmentId: appointment.id,
      discountCents: pricing.discountCents,
      finalAmountCents: amountCents,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

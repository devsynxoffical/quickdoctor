import { Response, Request } from 'express';
import Stripe from 'stripe';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { getPrismaErrorMessage } from '../lib/prismaErrors';
import { finalizeConfirmedAppointment } from '../services/appointmentLifecycle';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

function getStripe() {
  if (!stripeSecret) return null;
  return new Stripe(stripeSecret);
}

const HOLD_MINUTES = 15;

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
    const { doctorId, dateTime, notes } = req.body;
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

    const amountCents = doctor.consultationFeeCents;
    const holdExpiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        dateTime: slot,
        status: 'PENDING_PAYMENT',
        notes,
        priceCents: amountCents,
        holdExpiresAt,
      },
    });

    const stripe = getStripe();

    if (!stripe) {
      await prisma.payment.create({
        data: {
          appointmentId: appointment.id,
          amountCents,
          currency: doctor.currency,
          status: 'PENDING',
        },
      });

      res.status(200).json({
        message:
          'Stripe is not configured. Complete booking in test mode or set STRIPE_SECRET_KEY in backend/.env.',
        appointmentId: appointment.id,
        testMode: true,
        devConfirmUrl: `${frontendUrl.split(',')[0].trim()}/dashboard/appointments?confirmDev=${appointment.id}`,
      });
      return;
    }

    const patientUser = await prisma.user.findUnique({ where: { id: userId! } });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: patientUser?.email,
      line_items: [
        {
          price_data: {
            currency: doctor.currency.toLowerCase(),
            unit_amount: amountCents,
            product_data: {
              name: `Video consultation with Dr. ${doctor.lastName}`,
              description: new Date(dateTime).toLocaleString(),
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId: appointment.id,
        patientId: patient.id,
        doctorId: doctor.id,
      },
      success_url: `${frontendUrl}/dashboard/appointments?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/dashboard/appointments?payment=cancelled&appointmentId=${appointment.id}`,
    });

    await prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        stripeSessionId: session.id,
        amountCents,
        currency: doctor.currency,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      checkoutUrl: session.url,
      sessionId: session.id,
      appointmentId: appointment.id,
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

    await prisma.$transaction([
      prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED', holdExpiresAt: null },
      }),
      prisma.payment.updateMany({
        where: { appointmentId },
        data: { status: 'SUCCEEDED', paidAt: new Date() },
      }),
    ]);

    await finalizeConfirmedAppointment(appointmentId, userId);

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
      await prisma.$transaction([
        prisma.payment.updateMany({
          where: { appointmentId, stripeSessionId: session.id },
          data: {
            status: 'SUCCEEDED',
            paidAt: new Date(),
            stripePaymentIntentId:
              typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent?.id,
          },
        }),
        prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: 'CONFIRMED', holdExpiresAt: null },
        }),
      ]);
      await finalizeConfirmedAppointment(appointmentId);
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
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'SUCCEEDED',
              paidAt: new Date(),
              stripePaymentIntentId:
                typeof session.payment_intent === 'string'
                  ? session.payment_intent
                  : session.payment_intent?.id,
            },
          }),
          prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'CONFIRMED', holdExpiresAt: null },
          }),
        ]);
        await finalizeConfirmedAppointment(appointmentId);
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

    res.json({
      status: payment.status,
      appointment: payment.appointment,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: getPrismaErrorMessage(error) });
  }
};

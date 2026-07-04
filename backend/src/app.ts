import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import medicalRoutes from './routes/medicalRoutes';
import adminRoutes from './routes/adminRoutes';
import specialtyRoutes from './routes/specialtyRoutes';
import doctorApplyRoutes from './routes/doctorApplyRoutes';
import publicDoctorRoutes from './routes/publicDoctorRoutes';
import doctorProfileRoutes from './routes/doctorProfileRoutes';
import paymentRoutes from './routes/paymentRoutes';
import notificationRoutes from './routes/notificationRoutes';
import cmsRoutes from './routes/cmsRoutes';
import accountRoutes from './routes/accountRoutes';
import reviewRoutes from './routes/reviewRoutes';
import { stripeWebhook } from './controllers/paymentController';
import { checkDatabaseConnection } from './config/db';

dotenv.config();

const app = express();

app.use(helmet());
const corsOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
    credentials: true,
  })
);

app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/specialties', specialtyRoutes);
app.use('/api/doctors', doctorApplyRoutes);
app.use('/api/doctors/public', publicDoctorRoutes);
app.use('/api/doctor', doctorProfileRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/health', async (_req, res) => {
  const db = await checkDatabaseConnection();
  if (!db.ok) {
    res.status(503).json({
      status: 'degraded',
      database: 'disconnected',
      hint: 'Run: cd backend && docker compose up -d && npx prisma db push && npx prisma db seed',
      error: db.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  res.json({
    status: 'ok',
    database: 'connected',
    integrations: {
      stripe: Boolean(process.env.STRIPE_SECRET_KEY),
      stripeWebhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      zoom: Boolean(
        process.env.ZOOM_ACCOUNT_ID &&
          process.env.ZOOM_CLIENT_ID &&
          process.env.ZOOM_CLIENT_SECRET
      ),
    },
    timestamp: new Date().toISOString(),
  });
});

export default app;

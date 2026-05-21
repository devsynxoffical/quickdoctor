import app from './app';
import { checkDatabaseConnection } from './config/db';
import { releaseExpiredPaymentHolds } from './services/appointmentLifecycle';

const PORT = process.env.PORT || 5000;
const HOLD_CLEANUP_MS = 5 * 60 * 1000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  const db = await checkDatabaseConnection();
  if (db.ok) {
    console.log('Database: connected');
    setInterval(async () => {
      const n = await releaseExpiredPaymentHolds();
      if (n > 0) console.log(`Released ${n} expired payment hold(s)`);
    }, HOLD_CLEANUP_MS);
  } else {
    console.warn('Database: NOT connected');
    console.warn(db.message);
    console.warn('Fix: cd backend && docker compose up -d && npx prisma db push && npx prisma db seed');
  }
});

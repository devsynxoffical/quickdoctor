import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    '[db] DATABASE_URL is missing. Copy backend/.env.example to backend/.env and set your PostgreSQL URL.'
  );
}

const pool = new pg.Pool({
  connectionString: connectionString || 'postgresql://user:password@localhost:5432/quickdoctor',
});

pool.on('error', (err) => {
  console.error('[db] PostgreSQL pool error:', err.message);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function checkDatabaseConnection(): Promise<{ ok: boolean; message?: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown database error';
    return { ok: false, message };
  }
}

export { pool };
export default prisma;

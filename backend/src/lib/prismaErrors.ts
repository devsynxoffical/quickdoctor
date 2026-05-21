export function getPrismaErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'An unexpected error occurred';
  }

  const e = error as { code?: string; message?: string };

  switch (e.code) {
    case 'P1001':
      return 'Cannot connect to PostgreSQL. Start the database (see backend/docker-compose.yml) and verify DATABASE_URL in backend/.env';
    case 'P1000':
      return 'Database authentication failed. Check username and password in DATABASE_URL';
    case 'P1003':
      return 'Database does not exist. Create it or run: docker compose up -d';
    case 'P2021':
      return 'Database tables are missing. In the backend folder run: npx prisma db push && npx prisma db seed';
    default:
      break;
  }

  if (e.message?.includes("Can't reach database server")) {
    return 'Cannot connect to PostgreSQL on localhost:5432. Run: cd backend && docker compose up -d';
  }

  return e.message || 'Database error';
}

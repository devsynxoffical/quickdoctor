const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/** Placeholder so static export builds when the API is empty or unreachable at build time. */
export const STATIC_PLACEHOLDER = '_';

export async function fetchDoctorStaticParams(): Promise<{ id: string }[]> {
  try {
    const res = await fetch(`${API_URL}/doctors/public`, { cache: 'no-store' });
    if (!res.ok) return [{ id: STATIC_PLACEHOLDER }];
    const doctors = (await res.json()) as { id: string }[];
    if (!Array.isArray(doctors) || doctors.length === 0) {
      return [{ id: STATIC_PLACEHOLDER }];
    }
    return doctors.map((d) => ({ id: String(d.id) }));
  } catch {
    return [{ id: STATIC_PLACEHOLDER }];
  }
}

export function placeholderIdParams(): { id: string }[] {
  return [{ id: STATIC_PLACEHOLDER }];
}

export function placeholderSlugParams(): { slug: string }[] {
  return [{ slug: STATIC_PLACEHOLDER }];
}

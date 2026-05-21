export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export type StoredUser = {
  id: string;
  email: string;
  role: UserRole | string;
  firstName?: string;
  lastName?: string;
};

export const BOOKING_APPOINTMENTS_PATH = '/dashboard/appointments?book=1';

export function normalizeRole(role?: string): UserRole | null {
  const r = String(role ?? '').toUpperCase();
  if (r === 'PATIENT' || r === 'DOCTOR' || r === 'ADMIN') return r;
  return null;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: StoredUser) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function isLoggedIn(): boolean {
  return Boolean(getToken() && getStoredUser());
}

export function isPatient(): boolean {
  return normalizeRole(getStoredUser()?.role) === 'PATIENT';
}

export function hasRole(role: UserRole): boolean {
  return normalizeRole(getStoredUser()?.role) === role;
}

export function getLoginUrl(redirect?: string, intent?: string): string {
  const params = new URLSearchParams();
  if (redirect) params.set('redirect', redirect);
  if (intent) params.set('intent', intent);
  const q = params.toString();
  return q ? `/login?${q}` : '/login';
}

export function getRegisterUrl(redirect?: string, intent?: string): string {
  const params = new URLSearchParams();
  if (redirect) params.set('redirect', redirect);
  if (intent) params.set('intent', intent);
  const q = params.toString();
  return q ? `/register?${q}` : '/register';
}

/** Where to send the user after a successful patient login/register. */
export function resolvePatientRedirect(redirectParam: string | null): string {
  if (redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
    return redirectParam;
  }
  return '/dashboard';
}

/** Where to send after login based on role (portals + patient redirect). */
export function resolvePostLoginPath(
  role: string | undefined,
  redirectParam: string | null
): string {
  const r = normalizeRole(role);
  if (r === 'ADMIN') return '/admin';
  if (r === 'DOCTOR') return '/doctor';
  return resolvePatientRedirect(redirectParam);
}

export function getBookingAuthUrl(currentPath?: string): string {
  const redirect = BOOKING_APPOINTMENTS_PATH;
  if (typeof window !== 'undefined' && currentPath) {
    sessionStorage.setItem('bookingReturnPath', currentPath);
  }
  return getLoginUrl(redirect, 'book');
}

import { paymentApi } from '@/lib/api';
import { getLoginUrl, getToken, normalizeRole, getStoredUser } from '@/lib/auth';

export const CERTIFICATE_PRICE_CENTS = 3000;
export const PRESCRIPTION_REVIEW_PRICE_CENTS = 2500;

export type ServiceCheckoutType = 'MEDICAL_CERTIFICATE' | 'PRESCRIPTION_REVIEW';

export type PendingServiceCheckout = {
  serviceType: ServiceCheckoutType;
  serviceSlug: string;
  serviceName: string;
  priceCents: number;
  payload: Record<string, unknown>;
};

const STORAGE_KEY = 'pendingServiceCheckout';

export function savePendingServiceCheckout(data: PendingServiceCheckout) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadPendingServiceCheckout(): PendingServiceCheckout | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingServiceCheckout;
  } catch {
    return null;
  }
}

export function clearPendingServiceCheckout() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function formatServicePrice(cents: number): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export function requirePatientLogin(redirectPath: string): boolean {
  const token = getToken();
  const role = normalizeRole(getStoredUser()?.role);
  if (token && role === 'PATIENT') return true;
  window.location.href = getLoginUrl(redirectPath, undefined);
  return false;
}

export async function completeServiceCheckout(data: PendingServiceCheckout) {
  const result = await paymentApi.serviceCheckout({
    serviceType: data.serviceType,
    serviceSlug: data.serviceSlug,
    serviceName: data.serviceName,
    payload: data.payload,
  });

  if (result.checkoutUrl) {
    clearPendingServiceCheckout();
    window.location.href = result.checkoutUrl;
    return;
  }

  if (result.freeCheckout) {
    clearPendingServiceCheckout();
    window.location.href = '/dashboard/appointments?payment=success';
    return;
  }

  if (result.testMode && result.appointmentId) {
    clearPendingServiceCheckout();
    try {
      await paymentApi.devConfirm(result.appointmentId);
      window.location.href = '/dashboard/appointments?payment=success';
    } catch {
      window.location.href = result.devConfirmUrl || '/dashboard/appointments';
    }
    return;
  }

  throw new Error(result.message || 'Could not start checkout');
}

export function beginPrescriptionCheckout(params: {
  slug: string;
  serviceName: string;
  priceCents?: number;
  payload: Record<string, unknown>;
}) {
  savePendingServiceCheckout({
    serviceType: 'PRESCRIPTION_REVIEW',
    serviceSlug: params.slug,
    serviceName: params.serviceName,
    priceCents: params.priceCents ?? PRESCRIPTION_REVIEW_PRICE_CENTS,
    payload: params.payload,
  });
  window.location.href = `/prescriptions/checkout?slug=${encodeURIComponent(params.slug)}`;
}

export function beginCertificateCheckout(params: {
  payload: Record<string, unknown>;
}) {
  savePendingServiceCheckout({
    serviceType: 'MEDICAL_CERTIFICATE',
    serviceSlug: 'medical-certificate',
    serviceName: 'Medical Certificate',
    priceCents: CERTIFICATE_PRICE_CENTS,
    payload: params.payload,
  });
  window.location.href = '/prescriptions/checkout?slug=medical-certificate';
}

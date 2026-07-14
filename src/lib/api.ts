const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const AUTH_EXEMPT = ['/auth/login', '/auth/register', '/auth/send-registration-otp', '/auth/forgot-password', '/auth/reset-password'];

export async function fetchApi<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data: unknown;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      throw new Error(text || 'Invalid response from server');
    }
  }

  if (!response.ok) {
    const msg =
      data && typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message?: string }).message)
        : 'Something went wrong';

    if (
      response.status === 401 &&
      typeof window !== 'undefined' &&
      !AUTH_EXEMPT.some((path) => endpoint.startsWith(path))
    ) {
      const { handleAuthFailure } = await import('./auth');
      handleAuthFailure();
    }

    throw new Error(msg);
  }

  return data as T;
}

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
  pendingApproval?: boolean;
  message?: string;
};

export const authApi = {
  me: () => fetchApi<{ user: AuthUser }>('/auth/me'),
  login: (credentials: { email: string; password: string }) =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (data: Record<string, unknown>) =>
    fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  sendRegistrationOtp: (email: string) =>
    fetchApi<{ message: string }>('/auth/send-registration-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  forgotPassword: (email: string) =>
    fetchApi<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    fetchApi<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    fetchApi<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export type SpecialtyCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type PublicDoctor = {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  bio?: string;
  consultationFeeCents: number;
  currency: string;
  category?: SpecialtyCategory;
  averageRating?: number | null;
  reviewCount?: number;
};

export type AppointmentRow = {
  id: string;
  dateTime: string;
  status: string;
  serviceType?: 'VIDEO_CONSULTATION' | 'MEDICAL_CERTIFICATE' | 'PRESCRIPTION_REVIEW';
  serviceSlug?: string | null;
  serviceName?: string | null;
  requestPayload?: Record<string, unknown> | null;
  needsAssignment?: boolean;
  priceCents: number;
  notes?: string;
  clinicalNotes?: string;
  zoomJoinUrlPatient?: string;
  zoomJoinUrlHost?: string;
  doctor?: PublicDoctor & { lastName?: string; firstName?: string };
  patient?: { firstName?: string; lastName?: string };
  payment?: { status: string; amountCents: number };
};

export type PrescriptionRow = {
  id: string;
  /** Present for doctor/admin views; omitted/redacted for patients. */
  medications?: string;
  dosage?: string;
  instructions?: string | null;
  items?: PrescriptionItem[] | null;
  issuedAt: string;
  pharmacyName?: string | null;
  pharmacyAddress?: string | null;
  pharmacyCounty?: string | null;
  pharmacySentAt?: string | null;
  pharmacySentBy?: string | null;
  issued?: boolean;
  sentToPharmacy?: boolean;
  appointment?: {
    id?: string;
    doctor?: {
      firstName?: string;
      lastName?: string;
      specialization?: string;
      licenseNumber?: string;
    };
    patient?: {
      firstName?: string;
      lastName?: string;
      dob?: string;
      address?: string | null;
      phone?: string | null;
    };
  };
};

export type PrescriptionItem = {
  name: string;
  dosage: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
};

export type MedicalCertificateRow = {
  id: string;
  reason: string;
  startDate: string;
  endDate: string;
  issuedAt: string;
  appointment?: {
    id?: string;
    doctor?: {
      firstName?: string;
      lastName?: string;
      licenseNumber?: string;
    };
    patient?: {
      firstName?: string;
      lastName?: string;
      dob?: string;
      address?: string | null;
      phone?: string | null;
    };
  };
};

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

export type CmsSection = {
  id: string;
  type: string;
  sortOrder: number;
  contentJson: Record<string, unknown>;
};

export type MaintenanceSettings = {
  enabled: boolean;
  message: string;
  allowAdminBypass: boolean;
};

export type CouponRow = {
  id: string;
  code: string;
  description?: string | null;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minAmountCents?: number | null;
  maxUses?: number | null;
  usedCount: number;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt: string;
};

export type CouponPreview = {
  couponId: string;
  code: string;
  originalCents: number;
  discountCents: number;
  finalCents: number;
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  pageType: string;
  seoTitle?: string;
  seoDescription?: string;
  status: string;
  publishedAt?: string;
  sections: CmsSection[];
};

export const specialtyApi = {
  list: () => fetchApi<SpecialtyCategory[]>('/specialties'),
};

export const doctorApplyApi = {
  apply: (data: Record<string, unknown>) =>
    fetchApi<{ message: string; applicationId: string; status: string }>('/doctors/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  status: () =>
    fetchApi<{
      application: {
        id: string;
        status: string;
        createdAt: string;
        specialtyCategory?: { name: string };
      };
      doctorStatus?: string;
      canAccessPortal: boolean;
    }>('/doctors/application/status'),
  checkStatus: (credentials: { email: string; password: string }) =>
    fetchApi<{
      application: {
        id: string;
        status: string;
        createdAt: string;
        specialtyCategory?: { name: string };
      };
      doctorStatus?: string;
      canAccessPortal: boolean;
      token?: string;
      pendingApproval?: boolean;
      user?: { id: string; email: string; role: string; firstName?: string; lastName?: string };
    }>('/doctors/application/status', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};

export const publicDoctorApi = {
  list: (categoryId?: string) =>
    fetchApi<PublicDoctor[]>(
      `/doctors/public${categoryId ? `?categoryId=${categoryId}` : ''}`
    ),
  get: (id: string) => fetchApi<PublicDoctor & { availability: unknown[] }>(`/doctors/public/${id}`),
  slots: (id: string, date: string) =>
    fetchApi<{ slots: string[]; consultationFeeCents: number; currency: string }>(
      `/doctors/public/${id}/slots?date=${date}`
    ),
  availableSlots: (date: string) =>
    fetchApi<{ slots: string[]; consultationFeeCents: number; currency: string }>(
      `/doctors/public/available-slots?date=${date}`
    ),
};

export const paymentApi = {
  checkout: (data: { doctorId: string; dateTime: string; notes?: string; couponCode?: string }) =>
    fetchApi<{
      checkoutUrl?: string;
      appointmentId: string;
      testMode?: boolean;
      freeCheckout?: boolean;
      devConfirmUrl?: string;
      message?: string;
      discountCents?: number;
      finalAmountCents?: number;
      maintenanceMode?: boolean;
    }>('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  autoCheckout: (data: { dateTime: string; notes?: string; couponCode?: string }) =>
    fetchApi<{
      checkoutUrl?: string;
      appointmentId: string;
      testMode?: boolean;
      freeCheckout?: boolean;
      devConfirmUrl?: string;
      message?: string;
      discountCents?: number;
      finalAmountCents?: number;
      maintenanceMode?: boolean;
    }>('/payments/auto-checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  guestCheckout: async (data: {
    doctorId: string;
    dateTime: string;
    notes?: string;
    couponCode?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dob: string;
  }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payments/guest-checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      }
    );

    const text = await response.text();
    let body: Record<string, unknown> = {};
    if (text) {
      try {
        body = JSON.parse(text) as Record<string, unknown>;
      } catch {
        throw new Error(text || 'Invalid response from server');
      }
    }

    if (response.status === 409 && body.requiresLogin === true) {
      return {
        requiresLogin: true as const,
        message: typeof body.message === 'string' ? body.message : 'Account exists',
        appointmentId: '',
        token: '',
        user: { id: '', email: '', role: '' },
      };
    }

    if (!response.ok) {
      throw new Error(
        typeof body.message === 'string' ? body.message : 'Something went wrong'
      );
    }

    return body as {
      checkoutUrl?: string;
      appointmentId: string;
      testMode?: boolean;
      freeCheckout?: boolean;
      devConfirmUrl?: string;
      message?: string;
      discountCents?: number;
      finalAmountCents?: number;
      maintenanceMode?: boolean;
      token: string;
      user: AuthUser;
      requiresLogin?: boolean;
    };
  },
  guestAutoCheckout: async (data: {
    dateTime: string;
    notes?: string;
    couponCode?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dob: string;
  }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payments/guest-auto-checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      }
    );

    const text = await response.text();
    let body: Record<string, unknown> = {};
    if (text) {
      try {
        body = JSON.parse(text) as Record<string, unknown>;
      } catch {
        throw new Error(text || 'Invalid response from server');
      }
    }

    if (response.status === 409 && body.requiresLogin === true) {
      return {
        requiresLogin: true as const,
        message: typeof body.message === 'string' ? body.message : 'Account exists',
        appointmentId: '',
        token: '',
        user: { id: '', email: '', role: '' },
      };
    }

    if (!response.ok) {
      throw new Error(
        typeof body.message === 'string' ? body.message : 'Something went wrong'
      );
    }

    return body as {
      checkoutUrl?: string;
      appointmentId: string;
      testMode?: boolean;
      freeCheckout?: boolean;
      devConfirmUrl?: string;
      message?: string;
      discountCents?: number;
      finalAmountCents?: number;
      maintenanceMode?: boolean;
      token: string;
      user: AuthUser;
      requiresLogin?: boolean;
    };
  },
  validateCoupon: (data: { code: string; amountCents: number }) =>
    fetchApi<CouponPreview>('/payments/validate-coupon', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  devConfirm: (appointmentId: string) =>
    fetchApi<{ message: string }>(`/payments/dev-confirm/${appointmentId}`, {
      method: 'POST',
    }),
  status: (sessionId: string) =>
    fetchApi<{ status: string; appointment: AppointmentRow; slotUnavailable?: string }>(
      `/payments/status?session_id=${sessionId}`
    ),
  serviceCheckout: (data: {
    serviceType: 'MEDICAL_CERTIFICATE' | 'PRESCRIPTION_REVIEW';
    serviceSlug?: string;
    serviceName: string;
    payload?: Record<string, unknown>;
    couponCode?: string;
  }) =>
    fetchApi<{
      checkoutUrl?: string;
      appointmentId: string;
      testMode?: boolean;
      freeCheckout?: boolean;
      devConfirmUrl?: string;
      message?: string;
      discountCents?: number;
      finalAmountCents?: number;
    }>('/payments/service-checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const medicalApi = {
  prescriptions: () => fetchApi<PrescriptionRow[]>('/medical/prescriptions/me'),
  certificates: () => fetchApi<MedicalCertificateRow[]>('/medical/certificates/me'),
  issuePrescription: (data: {
    appointmentId: string;
    patientId: string;
    items: PrescriptionItem[];
    instructions?: string;
    pharmacyName?: string;
    pharmacyAddress?: string;
    pharmacyCounty?: string;
  }) =>
    fetchApi<PrescriptionRow>('/medical/prescription', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  sendToPharmacy: (
    prescriptionId: string,
    data?: { pharmacyName?: string; pharmacyAddress?: string; pharmacyCounty?: string }
  ) =>
    fetchApi<PrescriptionRow>(`/medical/prescription/${prescriptionId}/send-to-pharmacy`, {
      method: 'POST',
      body: JSON.stringify({ prescriptionId, ...data }),
    }),
  issueCertificate: (data: {
    appointmentId: string;
    patientId: string;
    reason: string;
    startDate: string;
    endDate: string;
  }) =>
    fetchApi<MedicalCertificateRow>('/medical/certificate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  doctorPrescriptions: () => fetchApi<PrescriptionRow[]>('/medical/prescriptions/doctor'),
  doctorCertificates: () => fetchApi<MedicalCertificateRow[]>('/medical/certificates/doctor'),
};

export const appointmentApi = {
  getAll: () => fetchApi<AppointmentRow[]>('/appointments'),
  get: (id: string) => fetchApi<AppointmentRow & { patientId?: string; patient?: unknown }>(`/appointments/${id}`),
  getJoin: (id: string) =>
    fetchApi<{ canJoin: boolean; url: string | null; message?: string; dateTime?: string; displayName?: string }>(
      `/appointments/${id}/join`
    ),
  saveNotes: (id: string, clinicalNotes: string) =>
    fetchApi<AppointmentRow>(`/appointments/${id}/notes`, {
      method: 'PATCH',
      body: JSON.stringify({ clinicalNotes }),
    }),
  complete: (id: string) =>
    fetchApi<AppointmentRow>(`/appointments/${id}/complete`, { method: 'POST' }),
  cancelPending: (id: string) =>
    fetchApi<{ message: string }>(`/appointments/${id}/pending`, { method: 'DELETE' }),
};

export const notificationApi = {
  list: () => fetchApi<NotificationRow[]>('/notifications'),
  unreadCount: () => fetchApi<{ count: number }>('/notifications/unread-count'),
  markRead: (id: string) =>
    fetchApi<{ message: string }>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () =>
    fetchApi<{ message: string }>('/notifications/read-all', { method: 'PATCH' }),
};

export const cmsApi = {
  getPage: (slug: string) => fetchApi<CmsPage>(`/cms/pages/${slug}`),
  pageAvailability: (slug: string) =>
    fetchApi<{ status: 'PUBLISHED' | 'DRAFT' | 'MISSING' }>(`/cms/pages/${slug}/availability`),
  blogPosts: () => fetchApi<CmsPage[]>('/cms/blog'),
  navigation: (location = 'header') =>
    fetchApi<{ label: string; href: string }[]>(`/cms/navigation?location=${location}`),
  settings: () => fetchApi<Record<string, unknown>>('/cms/settings'),
};

export const cmsAdminApi = {
  pages: () => fetchApi<CmsPage[]>('/cms/admin/pages'),
  registry: () =>
    fetchApi<{
      pages: Array<{
        slug: string;
        path: string;
        title: string;
        group: string;
        id: string | null;
        status: string;
        sectionCount: number;
        updatedAt: string | null;
      }>;
      groups: string[];
    }>('/cms/admin/registry'),
  syncPages: (publish = false) =>
    fetchApi<{ message: string; created: number; skipped: number }>('/cms/admin/pages/sync', {
      method: 'POST',
      body: JSON.stringify({ publish }),
    }),
  createPage: (data: Record<string, unknown>) =>
    fetchApi<CmsPage>('/cms/admin/pages', { method: 'POST', body: JSON.stringify(data) }),
  updatePage: (id: string, data: Record<string, unknown>) =>
    fetchApi<CmsPage>(`/cms/admin/pages/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  resetTemplate: (id: string) =>
    fetchApi<CmsPage>(`/cms/admin/pages/${id}/reset-template`, { method: 'POST' }),
  deletePage: (id: string) =>
    fetchApi<{ message: string }>(`/cms/admin/pages/${id}`, { method: 'DELETE' }),
  navigation: () => fetchApi<unknown[]>('/cms/admin/navigation'),
  saveNavigation: (items: unknown[]) =>
    fetchApi<unknown[]>('/cms/admin/navigation', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),
  auditLogs: () => fetchApi<unknown[]>('/cms/admin/audit-logs'),
  getSettings: () => fetchApi<Array<{ key: string; value: unknown }>>('/cms/admin/settings'),
  saveSettings: (settings: Array<{ key: string; value: unknown }>) =>
    fetchApi<{ message: string }>('/cms/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    }),
};

export const accountApi = {
  exportData: () => fetchApi<Record<string, unknown>>('/account/export'),
  deleteAccount: (confirmEmail: string) =>
    fetchApi<{ message: string }>('/account/delete', {
      method: 'POST',
      body: JSON.stringify({ confirmEmail }),
    }),
  recordConsent: (consentType: string) =>
    fetchApi<unknown>('/account/consent', {
      method: 'POST',
      body: JSON.stringify({ consentType }),
    }),
};

export const reviewApi = {
  create: (data: { appointmentId: string; rating: number; comment?: string }) =>
    fetchApi<unknown>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  forDoctor: (doctorId: string) =>
    fetchApi<{ reviews: unknown[]; averageRating: number | null; count: number }>(
      `/reviews/doctor/${doctorId}`
    ),
};

export const doctorProfileApi = {
  get: () => fetchApi<Record<string, unknown>>('/doctor/profile'),
  update: (data: Record<string, unknown>) =>
    fetchApi<Record<string, unknown>>('/doctor/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  updateAvailability: (availability: unknown[]) =>
    fetchApi<Record<string, unknown>>('/doctor/availability', {
      method: 'PUT',
      body: JSON.stringify({ availability }),
    }),
  updateServices: (data: { priceCents: number; durationMinutes?: number }) =>
    fetchApi<Record<string, unknown>>('/doctor/services', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const adminApi = {
  applications: (status?: string) =>
    fetchApi<unknown[]>(
      `/admin/applications${status ? `?status=${status}` : ''}`
    ),
  approveApplication: (id: string) =>
    fetchApi<{ message: string }>(`/admin/applications/${id}/approve`, {
      method: 'PATCH',
    }),
  rejectApplication: (id: string, rejectionReason: string) =>
    fetchApi<{ message: string }>(`/admin/applications/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ rejectionReason }),
    }),
  categories: () => fetchApi<SpecialtyCategory[]>('/admin/categories'),
  createCategory: (data: Record<string, unknown>) =>
    fetchApi<SpecialtyCategory>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  stats: () =>
    fetchApi<{
      totalPatients: number;
      totalDoctors: number;
      totalAppointments: number;
      totalRevenue: number;
    }>('/admin/stats'),
  users: () => fetchApi<unknown[]>('/admin/users'),
  doctors: () => fetchApi<unknown[]>('/admin/doctors'),
  updatePatient: (userId: string, data: Record<string, unknown>) =>
    fetchApi<unknown>(`/admin/patients/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  updateDoctor: (doctorId: string, data: Record<string, unknown>) =>
    fetchApi<unknown>(`/admin/doctors/${doctorId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  appointments: () => fetchApi<unknown[]>('/admin/appointments'),
  assignAppointment: (appointmentId: string, doctorId: string) =>
    fetchApi<unknown>(`/admin/appointments/${appointmentId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ doctorId }),
    }),
  payments: () => fetchApi<unknown[]>('/admin/payments'),
  prescriptions: () => fetchApi<PrescriptionRow[]>('/admin/prescriptions'),
  sendPrescriptionToPharmacy: (
    prescriptionId: string,
    data?: { pharmacyName?: string; pharmacyAddress?: string; pharmacyCounty?: string }
  ) =>
    fetchApi<PrescriptionRow>(`/admin/prescriptions/${prescriptionId}/send-to-pharmacy`, {
      method: 'POST',
      body: JSON.stringify({ prescriptionId, ...data }),
    }),
  certificates: () => fetchApi<MedicalCertificateRow[]>('/admin/certificates'),
  coupons: () => fetchApi<CouponRow[]>('/admin/coupons'),
  createCoupon: (data: Record<string, unknown>) =>
    fetchApi<CouponRow>('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCoupon: (id: string, data: Record<string, unknown>) =>
    fetchApi<CouponRow>(`/admin/coupons/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteCoupon: (id: string) =>
    fetchApi<{ message: string }>(`/admin/coupons/${id}`, { method: 'DELETE' }),
  createAppointment: (data: {
    patientId: string;
    doctorId: string;
    dateTime: string;
    notes?: string;
  }) =>
    fetchApi<{ message: string; appointmentId: string }>('/admin/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

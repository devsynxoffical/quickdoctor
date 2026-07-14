import prisma from '../config/db';

export type MaintenanceSettings = {
  enabled: boolean;
  message: string;
  allowAdminBypass: boolean;
};

export type AssignmentSettings = {
  mode: 'auto' | 'manual';
};

const DEFAULT_MAINTENANCE: MaintenanceSettings = {
  enabled: false,
  message: "We're performing scheduled maintenance. Booking will resume shortly.",
  allowAdminBypass: true,
};

const DEFAULT_ASSIGNMENT: AssignmentSettings = {
  mode: 'auto',
};

export async function getMaintenanceSettings(): Promise<MaintenanceSettings> {
  const row = await prisma.cmsSiteSetting.findUnique({ where: { key: 'maintenance' } });
  if (!row?.value || typeof row.value !== 'object') return DEFAULT_MAINTENANCE;
  const v = row.value as Record<string, unknown>;
  return {
    enabled: Boolean(v.enabled),
    message: typeof v.message === 'string' ? v.message : DEFAULT_MAINTENANCE.message,
    allowAdminBypass: v.allowAdminBypass !== false,
  };
}

export async function getAssignmentSettings(): Promise<AssignmentSettings> {
  const row = await prisma.cmsSiteSetting.findUnique({ where: { key: 'assignment' } });
  if (!row?.value || typeof row.value !== 'object') return DEFAULT_ASSIGNMENT;
  const v = row.value as Record<string, unknown>;
  return {
    mode: v.mode === 'manual' ? 'manual' : 'auto',
  };
}

export async function isMaintenanceBlocking(role?: string): Promise<{
  blocked: boolean;
  message: string;
}> {
  const settings = await getMaintenanceSettings();
  if (!settings.enabled) return { blocked: false, message: '' };
  if (settings.allowAdminBypass && role === 'ADMIN') {
    return { blocked: false, message: '' };
  }
  return { blocked: true, message: settings.message };
}

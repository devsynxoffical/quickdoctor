import prisma from '../config/db';

export type MaintenanceSettings = {
  enabled: boolean;
  message: string;
  allowAdminBypass: boolean;
};

const DEFAULT_MAINTENANCE: MaintenanceSettings = {
  enabled: false,
  message: "We're performing scheduled maintenance. Booking will resume shortly.",
  allowAdminBypass: true,
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

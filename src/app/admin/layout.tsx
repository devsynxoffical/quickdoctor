"use client";

import PortalGate from '@/components/PortalGate';
import AdminLayout from '@/components/AdminLayout';

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalGate
      requiredRole="ADMIN"
      portalTitle="Admin Control Center"
      portalDescription="Enter administrator credentials to unlock the admin panel."
      accent="admin"
    >
      <AdminLayout>{children}</AdminLayout>
    </PortalGate>
  );
}

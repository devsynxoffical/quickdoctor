"use client";

import PortalGate from '@/components/PortalGate';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';

export default function DoctorPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalGate
      requiredRole="DOCTOR"
      portalTitle="Doctor Portal"
      portalDescription="Enter your doctor credentials to access consultations and prescriptions."
      accent="doctor"
    >
      <DoctorDashboardLayout>{children}</DoctorDashboardLayout>
    </PortalGate>
  );
}

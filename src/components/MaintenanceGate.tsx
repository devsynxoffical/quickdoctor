"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cmsApi, type MaintenanceSettings } from "@/lib/api";

const BYPASS_PREFIXES = [
  "/admin",
  "/login",
  "/register",
  "/maintenance",
  "/dashboard",
  "/doctor",
  "/forgot-password",
  "/reset-password",
];

function isBypassedPath(pathname: string) {
  return BYPASS_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function getStoredRole(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw) as { role?: string };
    return user.role ?? null;
  } catch {
    return null;
  }
}

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<MaintenanceSettings | null>(null);

  useEffect(() => {
    cmsApi
      .settings()
      .then((all) => {
        const raw = all.maintenance as MaintenanceSettings | undefined;
        setSettings(
          raw ?? {
            enabled: false,
            message: "We're performing scheduled maintenance. Booking will resume shortly.",
            allowAdminBypass: true,
          }
        );
      })
      .catch(() => {
        setSettings({
          enabled: false,
          message: "",
          allowAdminBypass: true,
        });
      });
  }, []);

  if (!settings?.enabled) return <>{children}</>;
  if (isBypassedPath(pathname)) return <>{children}</>;
  if (settings.allowAdminBypass && getStoredRole() === "ADMIN") return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-primary">Maintenance mode</p>
        <h1 className="mt-3 text-2xl font-black text-slate-900">We&apos;ll be back soon</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">{settings.message}</p>
        <p className="mt-6 text-sm text-slate-500">
          Existing patients and doctors can still sign in. Admins can access the control panel.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/login"
            className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm"
          >
            Sign in
          </a>
          <a
            href="/admin"
            className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm"
          >
            Admin
          </a>
        </div>
      </div>
    </div>
  );
}

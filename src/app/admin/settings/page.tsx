"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cmsAdminApi, type MaintenanceSettings } from "@/lib/api";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { Megaphone, Newspaper, Settings, Shield, Ticket, Wrench } from "lucide-react";

type AnnouncementSettings = {
  enabled: boolean;
  message: string;
  linkHref: string;
  linkLabel: string;
};

export default function AdminSettingsPage() {
  const [maintenance, setMaintenance] = useState<MaintenanceSettings>({
    enabled: false,
    message: "We're performing scheduled maintenance. Booking will resume shortly.",
    allowAdminBypass: true,
  });
  const [announcement, setAnnouncement] = useState<AnnouncementSettings>({
    enabled: false,
    message: "",
    linkHref: "",
    linkLabel: "Learn more",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingAnnounce, setSavingAnnounce] = useState(false);
  const [saved, setSaved] = useState(false);
  const [announceSaved, setAnnounceSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cmsAdminApi
      .getSettings()
      .then((rows) => {
        const row = rows.find((r) => r.key === "maintenance");
        if (row?.value) {
          const v = row.value as MaintenanceSettings;
          setMaintenance({
            enabled: Boolean(v.enabled),
            message: v.message || maintenance.message,
            allowAdminBypass: v.allowAdminBypass !== false,
          });
        }
        const aRow = rows.find((r) => r.key === "announcement");
        if (aRow?.value) {
          const v = aRow.value as Partial<AnnouncementSettings>;
          setAnnouncement({
            enabled: Boolean(v.enabled),
            message: v.message || "",
            linkHref: v.linkHref || "",
            linkLabel: v.linkLabel || "Learn more",
          });
        }
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const saveMaintenance = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await cmsAdminApi.saveSettings([{ key: "maintenance", value: maintenance }]);
      setSaved(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveAnnouncement = async () => {
    setSavingAnnounce(true);
    setError(null);
    setAnnounceSaved(false);
    try {
      await cmsAdminApi.saveSettings([{ key: "announcement", value: announcement }]);
      setAnnounceSaved(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSavingAnnounce(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-4xl font-black">System settings</h1>
        <p className="text-slate-500 mt-2">Manage announcements, maintenance mode, coupons, and your admin password.</p>
      </div>

      <div className="glass p-6 rounded-3xl">
        <ChangePasswordForm />
      </div>

      <div className="glass p-6 rounded-3xl space-y-5">
        <div className="flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-primary" />
          <div>
            <p className="font-black">Announcement bar</p>
            <p className="text-sm text-slate-500">Show a site-wide banner for discounts or important notices.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <>
            <label className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <span className="font-bold text-sm">Announcement enabled</span>
              <input
                type="checkbox"
                checked={announcement.enabled}
                onChange={(e) => setAnnouncement((a) => ({ ...a, enabled: e.target.checked }))}
                className="w-5 h-5 accent-primary"
              />
            </label>
            <textarea
              value={announcement.message}
              onChange={(e) => setAnnouncement((a) => ({ ...a, message: e.target.value }))}
              rows={2}
              placeholder="e.g. Spring offer — 10% off video consultations with code SPRING10"
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={announcement.linkHref}
                onChange={(e) => setAnnouncement((a) => ({ ...a, linkHref: e.target.value }))}
                placeholder="Optional link (e.g. /doctors)"
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              />
              <input
                value={announcement.linkLabel}
                onChange={(e) => setAnnouncement((a) => ({ ...a, linkLabel: e.target.value }))}
                placeholder="Link label"
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              />
            </div>
            {announceSaved && <p className="text-sm text-emerald-600 font-bold">Announcement saved.</p>}
            <button
              type="button"
              onClick={saveAnnouncement}
              disabled={savingAnnounce}
              className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm disabled:opacity-60"
            >
              {savingAnnounce ? "Saving…" : "Save announcement"}
            </button>
          </>
        )}
      </div>

      <div className="glass p-6 rounded-3xl space-y-5">
        <div className="flex items-center gap-3">
          <Wrench className="w-6 h-6 text-primary" />
          <div>
            <p className="font-black">Maintenance mode</p>
            <p className="text-sm text-slate-500">Show a site-wide message and block new public bookings.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <>
            <label className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <span className="font-bold text-sm">Maintenance mode enabled</span>
              <input
                type="checkbox"
                checked={maintenance.enabled}
                onChange={(e) => setMaintenance((m) => ({ ...m, enabled: e.target.checked }))}
                className="w-5 h-5 accent-primary"
              />
            </label>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400">Public message</label>
              <textarea
                value={maintenance.message}
                onChange={(e) => setMaintenance((m) => ({ ...m, message: e.target.value }))}
                rows={3}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              />
            </div>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={maintenance.allowAdminBypass}
                onChange={(e) => setMaintenance((m) => ({ ...m, allowAdminBypass: e.target.checked }))}
                className="w-4 h-4 accent-primary"
              />
              Allow admins to browse the public site while maintenance is on
            </label>

            {error && <p className="text-sm text-red-600 font-bold">{error}</p>}
            {saved && <p className="text-sm text-emerald-600 font-bold">Settings saved.</p>}

            <button
              type="button"
              onClick={saveMaintenance}
              disabled={saving}
              className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save maintenance settings"}
            </button>
          </>
        )}
      </div>

      <div className="space-y-4">
        <Link
          href="/admin/coupons"
          className="glass p-6 rounded-3xl flex items-center gap-4 hover:scale-[1.01] transition-transform"
        >
          <Ticket className="w-8 h-8 text-primary" />
          <div>
            <p className="font-black">Coupons & discounts</p>
            <p className="text-sm text-slate-500">Create promo codes for consultation bookings</p>
          </div>
        </Link>
        <Link
          href="/admin/cms"
          className="glass p-6 rounded-3xl flex items-center gap-4 hover:scale-[1.01] transition-transform"
        >
          <Newspaper className="w-8 h-8 text-primary" />
          <div>
            <p className="font-black">CMS & content</p>
            <p className="text-sm text-slate-500">Pages, blog posts, and navigation</p>
          </div>
        </Link>
        <Link
          href="/admin/categories"
          className="glass p-6 rounded-3xl flex items-center gap-4 hover:scale-[1.01] transition-transform"
        >
          <Settings className="w-8 h-8 text-secondary" />
          <div>
            <p className="font-black">Specialty categories</p>
            <p className="text-sm text-slate-500">Doctor specialties and service types</p>
          </div>
        </Link>
        <div className="glass p-6 rounded-3xl flex items-center gap-4 opacity-80">
          <Shield className="w-8 h-8 text-slate-400" />
          <div>
            <p className="font-black">API & integrations</p>
            <p className="text-sm text-slate-500">
              Stripe, Zoom, and email are configured in backend <code className="text-xs">.env</code> on the server.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

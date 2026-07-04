"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminApi, type CouponRow } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [discountValue, setDiscountValue] = useState("10");
  const [minAmount, setMinAmount] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => adminApi.coupons().then(setCoupons).catch(console.error);

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await adminApi.createCoupon({
        code,
        description: description || undefined,
        discountType,
        discountValue:
          discountType === "FIXED"
            ? Math.round(Number(discountValue) * 100)
            : Number(discountValue),
        minAmountCents: minAmount ? Math.round(Number(minAmount) * 100) : undefined,
        maxUses: maxUses ? Number(maxUses) : undefined,
        expiresAt: expiresAt || undefined,
      });
      setCode("");
      setDescription("");
      setDiscountValue("10");
      setMinAmount("");
      setMaxUses("");
      setExpiresAt("");
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create coupon");
    }
  };

  const toggleActive = async (coupon: CouponRow) => {
    try {
      await adminApi.updateCoupon(coupon.id, { isActive: !coupon.isActive });
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await adminApi.deleteCoupon(id);
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const formatDiscount = (coupon: CouponRow) =>
    coupon.discountType === "PERCENT"
      ? `${coupon.discountValue}% off`
      : `€${(coupon.discountValue / 100).toFixed(2)} off`;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">Coupons</h1>
        <p className="text-slate-500 mt-2">Patients can apply these codes when booking a consultation.</p>
      </div>

      <form onSubmit={create} className="glass p-6 rounded-3xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Coupon code (e.g. WELCOME10)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold uppercase"
          />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as "PERCENT" | "FIXED")}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold"
          >
            <option value="PERCENT">Percent off</option>
            <option value="FIXED">Fixed amount (€)</option>
          </select>
          <input
            required
            type="number"
            min={1}
            max={discountType === "PERCENT" ? 100 : undefined}
            step={discountType === "FIXED" ? "0.01" : "1"}
            placeholder={discountType === "PERCENT" ? "Percent" : "Amount €"}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
          <input
            type="number"
            min={0}
            step="0.01"
            placeholder="Min order € (optional)"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
          <input
            type="number"
            min={1}
            placeholder="Max uses (optional)"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
          <button
            type="submit"
            className="px-6 py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Create coupon
          </button>
        </div>

        {error && <p className="text-sm text-red-600 font-bold">{error}</p>}
      </form>

      <div className="grid gap-3">
        {coupons.map((coupon, i) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <p className="font-black text-lg">{coupon.code}</p>
              <p className="text-sm text-slate-500">{coupon.description || formatDiscount(coupon)}</p>
              <p className="text-xs text-slate-400 mt-1">
                Used {coupon.usedCount}
                {coupon.maxUses != null ? ` / ${coupon.maxUses}` : ""}
                {coupon.expiresAt ? ` · Expires ${new Date(coupon.expiresAt).toLocaleString()}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  coupon.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                }`}
              >
                {coupon.isActive ? "Active" : "Inactive"}
              </span>
              <button
                type="button"
                onClick={() => toggleActive(coupon)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-bold"
              >
                {coupon.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                type="button"
                onClick={() => remove(coupon.id)}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50"
                aria-label="Delete coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {coupons.length === 0 && (
          <p className="text-sm text-slate-500">No coupons yet. Create one above.</p>
        )}
      </div>
    </motion.div>
  );
}

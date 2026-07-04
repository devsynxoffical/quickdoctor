"use client";

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CreditCard, ShieldCheck, ArrowLeft } from 'lucide-react';
import {
  completeServiceCheckout,
  formatServicePrice,
  loadPendingServiceCheckout,
  requirePatientLogin,
  type PendingServiceCheckout,
} from '@/lib/serviceCheckout';

function CheckoutContent() {
  const [pending, setPending] = useState<PendingServiceCheckout | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = loadPendingServiceCheckout();
    if (!data) {
      setError('No questionnaire found. Please complete the form first.');
      return;
    }
    setPending(data);
  }, []);

  const handlePay = async () => {
    if (!pending) return;

    if (!requirePatientLogin('/prescriptions/checkout')) return;

    setPaying(true);
    setError(null);
    try {
      await completeServiceCheckout(pending);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment could not be started');
      setPaying(false);
    }
  };

  if (!pending && !error) {
    return <p className="text-slate-500 font-bold">Loading checkout…</p>;
  }

  const priceLabel = pending ? formatServicePrice(pending.priceCents) : '';
  const isCertificate = pending?.serviceType === 'MEDICAL_CERTIFICATE';

  return (
    <div className="w-full max-w-lg">
      <div className="glass rounded-[40px] p-8 md:p-10 medical-shadow">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CreditCard className="text-primary w-7 h-7" />
        </div>

        <h1 className="text-2xl font-black text-center">Secure checkout</h1>
        <p className="text-slate-500 text-center text-sm mt-2">
          {pending?.serviceName || 'Service request'}
        </p>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold">
            {error}
            <div className="mt-3">
              <Link href="/prescriptions" className="text-primary underline">
                Back to prescriptions
              </Link>
            </div>
          </div>
        )}

        {pending && (
          <>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{isCertificate ? 'Medical certificate review' : 'Prescription review'}</span>
                <span className="font-bold">{priceLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span className="font-bold">{formatServicePrice(0)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-black">
                <span>Total</span>
                <span>{priceLabel}</span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                Payment is processed securely by Stripe. An Irish-registered GP reviews your answers — usually within 1
                business day. Full refund if we cannot help.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="w-full mt-6 py-4 bg-primary text-white rounded-2xl font-black disabled:opacity-50"
            >
              {paying ? 'Redirecting to Stripe…' : `Pay ${priceLabel}`}
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              You must be signed in as a patient.{' '}
              <Link href="/register" className="text-primary font-bold">
                Create account
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function PrescriptionCheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <Link
          href="/prescriptions"
          className="max-w-lg mx-auto mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> Back to services
        </Link>
        <div className="flex justify-center">
          <Suspense fallback={<p className="text-slate-500 font-bold">Loading…</p>}>
            <CheckoutContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-black text-primary">Maintenance</h1>
        <p className="mt-4 text-slate-600">
          QuickDoctor is temporarily unavailable while we perform updates.
        </p>
        <Link href="/login" className="inline-block mt-8 px-6 py-3 bg-primary text-white rounded-2xl font-bold">
          Sign in
        </Link>
      </main>
      <Footer />
    </div>
  );
}

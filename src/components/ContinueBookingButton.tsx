"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import {
  BOOKING_APPOINTMENTS_PATH,
  getBookingAuthUrl,
  getRegisterUrl,
  isPatient,
} from '@/lib/auth';

type ContinueBookingButtonProps = {
  className?: string;
  label?: string;
  showSignUpHint?: boolean;
};

const ContinueBookingButton = ({
  className = 'w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:scale-[1.02] transition-all',
  label = 'Continue booking',
  showSignUpHint = false,
}: ContinueBookingButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (isPatient()) {
      router.push(BOOKING_APPOINTMENTS_PATH);
      return;
    }
    const path = typeof window !== 'undefined' ? window.location.pathname : undefined;
    router.push(getBookingAuthUrl(path));
  };

  return (
    <div className="w-full">
      <button type="button" onClick={handleClick} className={className}>
        {label}
        <ArrowRight className="w-4 h-4" />
      </button>
      {showSignUpHint && !isPatient() && (
        <p className="text-center text-xs text-slate-500 mt-3">
          New here?{' '}
          <button
            type="button"
            onClick={() =>
              router.push(getRegisterUrl(BOOKING_APPOINTMENTS_PATH, 'book'))
            }
            className="text-primary font-bold hover:underline"
          >
            Create a free account
          </button>
        </p>
      )}
    </div>
  );
};

export default ContinueBookingButton;

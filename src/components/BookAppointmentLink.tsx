"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  BOOKING_APPOINTMENTS_PATH,
  getLoginUrl,
  getRegisterUrl,
  isPatient,
} from '@/lib/auth';

type BookAppointmentLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

const BookAppointmentLink = ({
  className = 'w-full sm:w-auto justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-xl font-black inline-flex items-center gap-2 hover:bg-primary-dark transition-colors',
  children,
}: BookAppointmentLinkProps) => {
  const href = isPatient() ? '/doctors' : getLoginUrl(BOOKING_APPOINTMENTS_PATH, 'book');

  return (
    <Link href={href} className={className}>
      {children ?? (
        <>
          Book an Appointment <ArrowRight className="w-4 h-4" />
        </>
      )}
    </Link>
  );
};

export { getRegisterUrl, BOOKING_APPOINTMENTS_PATH };
export default BookAppointmentLink;

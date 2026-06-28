import { fetchDoctorStaticParams } from '@/lib/buildStaticParams';
import DoctorBookingClient from './DoctorBookingClient';

export async function generateStaticParams() {
  return fetchDoctorStaticParams();
}

export default function DoctorBookingPage() {
  return <DoctorBookingClient />;
}

import { fetchDoctorStaticParams } from '@/lib/buildStaticParams';
import DoctorsIdRedirectClient from './RedirectClient';

export async function generateStaticParams() {
  return fetchDoctorStaticParams();
}

export default function DoctorProfilePage() {
  return <DoctorsIdRedirectClient />;
}

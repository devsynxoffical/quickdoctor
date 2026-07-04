import PatientVideoCallClient from './PatientVideoCallClient';
import { placeholderIdParams } from '@/lib/buildStaticParams';

export function generateStaticParams() {
  return placeholderIdParams();
}

export default function PatientVideoCallPage() {
  return <PatientVideoCallClient />;
}

import { placeholderIdParams } from '@/lib/buildStaticParams';
import LegacyConsultationRedirect from './LegacyConsultationRedirect';

export function generateStaticParams() {
  return placeholderIdParams();
}

export default function LegacyConsultationPage() {
  return <LegacyConsultationRedirect />;
}

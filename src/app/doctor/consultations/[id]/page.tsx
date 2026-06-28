import { placeholderIdParams } from '@/lib/buildStaticParams';
import ConsultationRoomClient from './ConsultationRoomClient';

export async function generateStaticParams() {
  return placeholderIdParams();
}

export default function ConsultationRoomPage() {
  return <ConsultationRoomClient />;
}

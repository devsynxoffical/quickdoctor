import { placeholderSlugParams } from '@/lib/buildStaticParams';
import CmsDynamicClient from './CmsDynamicClient';

export async function generateStaticParams() {
  return placeholderSlugParams();
}

export default function CmsDynamicPage() {
  return <CmsDynamicClient />;
}

import { Prisma } from '@prisma/client';

export type PrescriptionItem = {
  name: string;
  dosage: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
};

export function normalizePrescriptionItems(body: {
  items?: unknown;
  medications?: string;
  dosage?: string;
  instructions?: string;
}): PrescriptionItem[] {
  if (Array.isArray(body.items) && body.items.length > 0) {
    return body.items
      .map((raw) => {
        const item = raw as Record<string, unknown>;
        return {
          name: String(item.name || '').trim(),
          dosage: String(item.dosage || '').trim(),
          frequency: item.frequency ? String(item.frequency).trim() : undefined,
          duration: item.duration ? String(item.duration).trim() : undefined,
          instructions: item.instructions ? String(item.instructions).trim() : undefined,
        };
      })
      .filter((item) => item.name && item.dosage);
  }

  const medications = String(body.medications || '').trim();
  const dosage = String(body.dosage || '').trim();
  if (medications && dosage) {
    return [{ name: medications, dosage, instructions: body.instructions?.trim() || undefined }];
  }

  return [];
}

export function summarizePrescriptionItems(items: PrescriptionItem[]) {
  const medications = items.map((i) => i.name).join('; ');
  const dosage = items
    .map((i) => {
      const parts = [i.dosage];
      if (i.frequency) parts.push(i.frequency);
      if (i.duration) parts.push(`for ${i.duration}`);
      return `${i.name}: ${parts.join(' · ')}`;
    })
    .join('\n');
  const instructions =
    items
      .map((i) => (i.instructions ? `${i.name}: ${i.instructions}` : ''))
      .filter(Boolean)
      .join('\n') || null;

  return {
    medications,
    dosage,
    instructions,
    items: items as unknown as Prisma.InputJsonValue,
  };
}

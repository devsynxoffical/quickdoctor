export type PrescriptionItem = {
  name: string;
  dosage: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
};

export const emptyMedicine = (): PrescriptionItem => ({
  name: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: '',
});

export function itemsFromPrescription(prescription: {
  items?: unknown;
  medications?: string;
  dosage?: string;
  instructions?: string | null;
}): PrescriptionItem[] {
  if (Array.isArray(prescription.items) && prescription.items.length > 0) {
    return (prescription.items as PrescriptionItem[]).map((item) => ({
      name: item.name || '',
      dosage: item.dosage || '',
      frequency: item.frequency || '',
      duration: item.duration || '',
      instructions: item.instructions || '',
    }));
  }
  if (prescription.medications && prescription.dosage) {
    return [
      {
        name: prescription.medications,
        dosage: prescription.dosage,
        instructions: prescription.instructions || '',
      },
    ];
  }
  return [emptyMedicine()];
}

/** Curated Irish pharmacy options for patient selection (Healthmail destination). */
export type PharmacyOption = {
  id: string;
  name: string;
  town: string;
  county: string;
};

export const IRISH_PHARMACIES: PharmacyOption[] = [
  { id: 'boots-grafton', name: 'Boots Pharmacy', town: 'Grafton Street', county: 'Dublin' },
  { id: 'boots-blanch', name: 'Boots Pharmacy', town: 'Blanchardstown', county: 'Dublin' },
  { id: 'boots-cork', name: 'Boots Pharmacy', town: 'St Patrick Street', county: 'Cork' },
  { id: 'lloyds-tallaght', name: "LloydsPharmacy", town: 'Tallaght', county: 'Dublin' },
  { id: 'lloyds-limerick', name: "LloydsPharmacy", town: 'O\'Connell Street', county: 'Limerick' },
  { id: 'allcare-galway', name: 'Allcare Pharmacy', town: 'Shop Street', county: 'Galway' },
  { id: 'allcare-waterford', name: 'Allcare Pharmacy', town: 'Broad Street', county: 'Waterford' },
  { id: 'sam-mccauley-dundrum', name: "Sam McCauley Chemists", town: 'Dundrum', county: 'Dublin' },
  { id: 'sam-mccauley-kilkenny', name: "Sam McCauley Chemists", town: 'High Street', county: 'Kilkenny' },
  { id: 'life-pharmacy-athlone', name: 'Life Pharmacy', town: 'Athlone', county: 'Westmeath' },
  { id: 'life-pharmacy-sligo', name: 'Life Pharmacy', town: 'Sligo', county: 'Sligo' },
  { id: 'mccabes-blackrock', name: "McCabe's Pharmacy", town: 'Blackrock', county: 'Dublin' },
  { id: 'mulligans-letterkenny', name: "Mulligan's Pharmacy", town: 'Letterkenny', county: 'Donegal' },
  { id: 'haven-tralee', name: 'Haven Pharmacy', town: 'Tralee', county: 'Kerry' },
  { id: 'haven-wicklow', name: 'Haven Pharmacy', town: 'Wicklow Town', county: 'Wicklow' },
  { id: 'unico-navan', name: 'Uniphar Pharmacy', town: 'Navan', county: 'Meath' },
  { id: 'totalhealth-drogheda', name: 'TotalHealth Pharmacy', town: 'Drogheda', county: 'Louth' },
  { id: 'carey-wexford', name: "Carey's Pharmacy", town: 'Wexford', county: 'Wexford' },
  { id: 'hickeys-clontarf', name: "Hickey's Pharmacy", town: 'Clontarf', county: 'Dublin' },
  { id: 'hickeys-cork', name: "Hickey's Pharmacy", town: 'Cork City', county: 'Cork' },
  { id: 'other', name: 'Other / enter details below', town: '', county: '' },
];

export function pharmacyLabel(p: PharmacyOption): string {
  if (p.id === 'other') return p.name;
  return `${p.name} — ${p.town}, ${p.county}`;
}

/** Human-readable pharmacy string for questionnaire payloads. */
export function resolvePharmacyDisplay(pharmacyId: string, customName = ''): string {
  const found = IRISH_PHARMACIES.find((p) => p.id === pharmacyId);
  if (!found) return '';
  if (found.id === 'other') return customName.trim();
  return pharmacyLabel(found);
}

/** Resolve picker selection into name/county fields for questionnaires and send-to-pharmacy. */
export function resolvePharmacySelection(
  pharmacyId: string,
  customName = ''
): { name: string; county: string; address: string } | null {
  const found = IRISH_PHARMACIES.find((p) => p.id === pharmacyId);
  if (!found) return null;
  if (found.id === 'other') {
    const name = customName.trim();
    if (!name) return null;
    return { name, county: '', address: name };
  }
  return {
    name: found.name,
    county: found.county,
    address: `${found.town}, ${found.county}`,
  };
}

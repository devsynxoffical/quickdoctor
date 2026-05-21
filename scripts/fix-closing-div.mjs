import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const wrong = String.fromCharCode(60, 47, 100, 105, 118, 62);
const right = String.fromCharCode(60, 47, 109, 111, 116, 105, 111, 110, 46, 100, 105, 118, 62);

const closeLineFixes = [
  ['src/app/admin/applications/page.tsx', [146, 150]],
  ['src/app/admin/categories/page.tsx', [78]],
  ['src/app/dashboard/page.tsx', [172]],
  ['src/app/doctor/prescriptions/page.tsx', [247]],
  ['src/app/doctor/settings/page.tsx', [67, 129]],
  ['src/app/doctors/page.tsx', [105, 107]],
  ['src/components/AdminLayout.tsx', [151]],
  ['src/components/DashboardLayout.tsx', [170]],
  ['src/components/DoctorDashboardLayout.tsx', [144]],
  ['src/components/Hero.tsx', [71]],
];

for (const [rel, lineNums] of closeLineFixes) {
  const p = path.join(root, rel);
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  for (const n of lineNums) {
    const i = n - 1;
    if (lines[i]?.includes(wrong)) {
      lines[i] = lines[i].replace(wrong, right);
    }
  }
  fs.writeFileSync(p, lines.join('\n'));
  console.log('close', rel);
}

console.log({ wrong, right });

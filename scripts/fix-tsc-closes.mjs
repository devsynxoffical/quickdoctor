import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const divClose = String.fromCharCode(60, 47, 100, 105, 118, 62);
const motionClose = String.fromCharCode(60, 47, 109, 111, 116, 105, 111, 110, 46, 100, 105, 118, 62);

const fixes = [
  ['src/app/doctors/[id]/page.tsx', 178, true],
  ['src/app/doctors/[id]/page.tsx', 206, true],
  ['src/app/doctors/page.tsx', 105, false],
  ['src/app/login/page.tsx', 156, true],
  ['src/app/login/page.tsx', 165, true],
  ['src/app/register/page.tsx', 198, true],
  ['src/app/register/page.tsx', 248, true],
  ['src/app/register/page.tsx', 316, true],
  ['src/app/register/page.tsx', 364, true],
  ['src/components/AdminLayout.tsx', 151, false],
  ['src/components/DashboardLayout.tsx', 170, false],
  ['src/components/DoctorDashboardLayout.tsx', 144, false],
  ['src/components/Hero.tsx', 71, false],
  ['src/components/PortalGate.tsx', 109, true],
  ['src/components/PortalGate.tsx', 150, true],
  ['src/components/PortalGate.tsx', 195, true],
  ['src/components/PortalGate.tsx', 216, true],
  ['src/components/PortalGate.tsx', 236, true],
  ['src/components/Services.tsx', 107, true],
  ['src/components/TrustSection.tsx', 77, false],
];

for (const [rel, n, wantMotion] of fixes) {
  const p = path.join(root, rel);
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  const i = n - 1;
  const target = wantMotion ? motionClose : divClose;
  lines[i] = lines[i].replace(divClose, target).replace(motionClose, target);
  fs.writeFileSync(p, lines.join('\n'));
  console.log(rel, n);
}

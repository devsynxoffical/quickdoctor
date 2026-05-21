import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const motionClose = String.fromCharCode(60, 47, 109, 111, 116, 105, 111, 110, 46, 100, 105, 118, 62);
const divClose = String.fromCharCode(60, 47, 100, 105, 118, 62);

const revertLines = [
  ['src/components/AdminLayout.tsx', 151],
  ['src/components/DashboardLayout.tsx', 170],
  ['src/components/DoctorDashboardLayout.tsx', 144],
  ['src/components/Hero.tsx', 71],
];

for (const [rel, n] of revertLines) {
  const p = path.join(root, rel);
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  const i = n - 1;
  if (lines[i]?.includes(motionClose)) {
    lines[i] = lines[i].replace(motionClose, divClose);
    fs.writeFileSync(p, lines.join('\n'));
    console.log('reverted', rel, n);
  }
}

// categories: motion list items
const cat = path.join(root, 'src/app/admin/categories/page.tsx');
let lines = fs.readFileSync(cat, 'utf8').split(/\r?\n/);
lines[61] = lines[61].replace(/^(\s*)<div/, '$1<motion.div');
lines[63] = lines[63].replace(/^(\s*)<div/, '$1<motion.div');
lines[74] = lines[74].replace(divClose, motionClose);
fs.writeFileSync(cat, lines.join('\n'));
console.log('categories');

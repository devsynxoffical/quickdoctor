import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const divClose = String.fromCharCode(60, 47, 100, 105, 118, 62);
const motionClose = String.fromCharCode(60, 47, 109, 111, 116, 105, 111, 110, 46, 100, 105, 118, 62);
const divOpen = String.fromCharCode(60, 100, 105, 118);

function setLine(rel, n, content) {
  const p = path.join(root, rel);
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  lines[n - 1] = content;
  fs.writeFileSync(p, lines.join('\n'));
}

function fixLine(rel, n, from, to) {
  const p = path.join(root, rel);
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  const i = n - 1;
  if (lines[i]?.includes(from)) {
    lines[i] = lines[i].replace(from, to);
    fs.writeFileSync(p, lines.join('\n'));
    console.log(rel, n);
  }
}

fixLine('src/components/TrustSection.tsx', 50, divClose, motionClose);
fixLine('src/components/TrustSection.tsx', 74, divClose, motionClose);
fixLine('src/components/TrustSection.tsx', 77, motionClose, divClose);

// doctors list cards
const doc = path.join(root, 'src/app/doctors/page.tsx');
let dl = fs.readFileSync(doc, 'utf8').split(/\r?\n/);
dl[68] = dl[68].replace(divOpen, '<motion.div');
dl[102] = dl[102].replace(divClose, motionClose);
dl[104] = dl[104].replace(motionClose, divClose);
fs.writeFileSync(doc, dl.join('\n'));
console.log('doctors');

fixLine('src/app/admin/blog/page.tsx', 102, divClose, motionClose);
fixLine('src/app/admin/blog/page.tsx', 104, motionClose, divClose);
fixLine('src/app/admin/blog/page.tsx', 183, motionClose, divClose);

fixLine('src/app/doctor/settings/page.tsx', 61, divOpen, '<motion.div');
fixLine('src/app/doctor/settings/page.tsx', 88, divOpen, '<motion.div');
fixLine('src/app/doctor/prescriptions/page.tsx', 247, motionClose, divClose);
fixLine('src/app/doctor/settings/page.tsx', 120, divClose, motionClose);

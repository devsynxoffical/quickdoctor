import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function setLine(rel, lineNum, content) {
  const p = path.join(root, rel);
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
  lines[lineNum - 1] = content;
  fs.writeFileSync(p, lines.join('\n'));
}

const m = 'motion.div';

setLine('src/app/doctor/page.tsx', 75, `             </${m}>`);

const doc = path.join(root, 'src/app/doctor/page.tsx');
let lines = fs.readFileSync(doc, 'utf8').split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('queue.map((item, i)') && lines[i + 1]?.includes('key={item.id}')) {
    lines[i + 1] = lines[i + 1].replace(/<div\b/, `<${m}`);
  }
  if (lines[i].includes('key={item.id}') && lines[i].includes('initial={{ opacity: 0, x: -20 }}')) {
    const j = i;
    for (let k = j; k < j + 35 && k < lines.length; k++) {
      if (lines[k].trim() === '</motion.div>' && k > j + 5) {
        lines[k] = `                      </${m}>`;
        break;
      }
    }
  }
}
fs.writeFileSync(doc, lines.join('\n'));

const sidebarClose = `      {active && <${m} layoutId="active" className="ml-auto"><ChevronRight className="w-4 h-4" /></${m}>}`;
setLine('src/components/AdminLayout.tsx', 21, sidebarClose);
setLine('src/components/DashboardLayout.tsx', 21, sidebarClose);
setLine('src/components/DoctorDashboardLayout.tsx', 20, sidebarClose);

console.log('patched');

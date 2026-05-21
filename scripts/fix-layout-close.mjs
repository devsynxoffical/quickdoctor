import fs from 'fs';

const files = [
  'src/components/AdminLayout.tsx',
  'src/components/DashboardLayout.tsx',
  'src/components/DoctorDashboardLayout.tsx',
];

const wrong = '</div>}';
const right = '</motion.div>}';
const needle = 'w-4 h-4" />';

for (const rel of files) {
  const p = new URL(`../${rel}`, import.meta.url);
  let s = fs.readFileSync(p, 'utf8');
  const target = needle + wrong;
  if (s.includes(target)) {
    s = s.replaceAll(target, needle + right);
    fs.writeFileSync(p, s);
    console.log('fixed', rel);
  } else {
    console.log('skip', rel, s.includes(needle + right) ? 'already ok' : 'pattern not found');
  }
}

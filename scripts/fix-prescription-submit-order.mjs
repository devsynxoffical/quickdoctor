#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = path.join(process.cwd(), 'src/app/prescriptions');

function cleanup(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  const original = src;

  src = src.replace(
    /\n  const submitPrescriptionRequest = \(\) => \{\n    beginPrescriptionCheckout\(\{[\s\S]*?\n    \}\);\n  \};\n\n(?=  const \[)/,
    '\n'
  );

  if (src !== original) {
    fs.writeFileSync(filePath, src);
    return true;
  }
  return false;
}

let n = 0;
for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === 'checkout') continue;
  const pagePath = path.join(ROOT, entry.name, 'page.tsx');
  if (fs.existsSync(pagePath) && cleanup(pagePath)) {
    n++;
    console.log('Cleaned', entry.name);
  }
}
console.log(`Removed ${n} duplicate early submit handlers.`);

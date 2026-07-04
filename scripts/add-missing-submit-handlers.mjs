#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = path.join(process.cwd(), 'src/app/prescriptions');

function titleCase(slug) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function extractStateVars(src) {
  return [...src.matchAll(/const \[(\w+), set\w+\] = useState/g)]
    .map((m) => m[1])
    .filter(
      (v) =>
        ![
          'loading',
          'error',
          'submitted',
          'requestSubmitted',
          'showQuestionnaire',
          'currentStep',
          'questionStep',
          'open',
        ].includes(v)
    );
}

function ensureImport(src) {
  if (src.includes("beginPrescriptionCheckout")) return src;
  const firstImport = src.match(/^import .+;$/m);
  if (!firstImport) return src;
  const insertAt = src.indexOf(firstImport[0]) + firstImport[0].length;
  return (
    src.slice(0, insertAt) +
    "\nimport { beginPrescriptionCheckout } from '@/lib/serviceCheckout';" +
    src.slice(insertAt)
  );
}

function patch(filePath, slug) {
  let src = fs.readFileSync(filePath, 'utf8');
  if (!src.includes('submitPrescriptionRequest')) return false;
  if (src.includes('const submitPrescriptionRequest = () =>')) return false;

  const stateVars = extractStateVars(src);
  if (!stateVars.length) return false;

  src = ensureImport(src);
  const payloadLines = stateVars.map((v) => `      ${v},`).join('\n');
  const fn = `  const submitPrescriptionRequest = () => {
    beginPrescriptionCheckout({
      slug: '${slug}',
      serviceName: '${titleCase(slug).replace(/'/g, "\\'")}',
      payload: {
${payloadLines}
      },
    });
  };

`;

  const returnIdx = src.search(/\n  return \(/);
  if (returnIdx === -1) return false;
  src = src.slice(0, returnIdx + 1) + fn + src.slice(returnIdx + 1);
  fs.writeFileSync(filePath, src);
  return true;
}

let n = 0;
for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === 'checkout') continue;
  const pagePath = path.join(ROOT, entry.name, 'page.tsx');
  if (fs.existsSync(pagePath) && patch(pagePath, entry.name)) {
    n++;
    console.log('Added handler', entry.name);
  }
}
console.log(`Added ${n} handlers.`);

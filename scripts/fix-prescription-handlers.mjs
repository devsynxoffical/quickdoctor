#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = path.join(process.cwd(), 'src/app/prescriptions');

function titleCase(slug) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function extractStateVars(src, fromIndex = 0) {
  return [...src.slice(fromIndex).matchAll(/const \[(\w+), set\w+\] = useState/g)]
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

function buildHandler(slug, stateVars) {
  const payloadLines = stateVars.map((v) => `      ${v},`).join('\n');
  return `  const submitPrescriptionRequest = () => {
    beginPrescriptionCheckout({
      slug: '${slug}',
      serviceName: '${titleCase(slug).replace(/'/g, "\\'")}',
      payload: {
${payloadLines}
      },
    });
  };

`;
}

function cleanupAccordion(src) {
  return src.replace(
    /(const \[open, setOpen\] = useState\(false\);\n)  const submitPrescriptionRequest = \(\) => \{\n    beginPrescriptionCheckout\(\{[\s\S]*?\n    \}\);\n  \};\n\n  return \(/g,
    '$1  return ('
  );
}

function patch(filePath, slug) {
  let src = fs.readFileSync(filePath, 'utf8');
  if (!src.includes('submitPrescriptionRequest')) return false;

  src = cleanupAccordion(src);

  const mainIdx = src.indexOf('export default function');
  if (mainIdx === -1) return false;

  const mainSlice = src.slice(mainIdx);
  if (mainSlice.includes('const submitPrescriptionRequest = () =>')) {
    fs.writeFileSync(filePath, src);
    return true;
  }

  const stateVars = extractStateVars(mainSlice);
  if (!stateVars.length) return false;

  if (!src.includes("beginPrescriptionCheckout")) {
    const firstImport = src.match(/^import .+;$/m);
    if (firstImport) {
      const insertAt = src.indexOf(firstImport[0]) + firstImport[0].length;
      src =
        src.slice(0, insertAt) +
        "\nimport { beginPrescriptionCheckout } from '@/lib/serviceCheckout';" +
        src.slice(insertAt);
    }
  }

  const relMain = src.slice(mainIdx);
  const returnMatch = relMain.match(/\n  return \(/);
  if (!returnMatch || returnMatch.index === undefined) return false;

  const absReturn = mainIdx + returnMatch.index + 1;
  src = src.slice(0, absReturn) + buildHandler(slug, stateVars) + src.slice(absReturn);
  fs.writeFileSync(filePath, src);
  return true;
}

let n = 0;
for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === 'checkout') continue;
  const pagePath = path.join(ROOT, entry.name, 'page.tsx');
  if (fs.existsSync(pagePath) && patch(pagePath, entry.name)) {
    n++;
    console.log('Fixed', entry.name);
  }
}
console.log(`Fixed ${n} files.`);

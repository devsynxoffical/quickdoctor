#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = path.join(process.cwd(), 'src/app/prescriptions');

function titleCase(slug) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function extractStateVars(src) {
  const stateMatches = [...src.matchAll(/const \[(\w+), set\w+\] = useState/g)];
  return stateMatches
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
          'paying',
          'otpLoading',
          'otpSent',
          'info',
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

function buildSubmitFn(slug, stateVars, fnName = 'submitPrescriptionRequest') {
  const serviceName = titleCase(slug).replace(/'/g, "\\'");
  const payloadLines = stateVars.map((v) => `      ${v},`).join('\n');
  return `  const ${fnName} = () => {
    beginPrescriptionCheckout({
      slug: '${slug}',
      serviceName: '${serviceName}',
      payload: {
${payloadLines}
      },
    });
  };`;
}

function patchFile(filePath, slug) {
  let src = fs.readFileSync(filePath, 'utf8');
  if (src.includes('beginPrescriptionCheckout(') && src.includes('submitPrescriptionRequest')) {
    return false;
  }

  const stateVars = extractStateVars(src);
  if (!stateVars.length) {
    console.warn(`Skip ${slug}: no state vars`);
    return false;
  }

  let changed = false;
  src = ensureImport(src);

  if (src.includes('const submitQuestionnaire = () => {') && !src.includes('beginPrescriptionCheckout({')) {
    src = src.replace(
      /const submitQuestionnaire = \(\) => \{[\s\S]*?\n  \};/,
      buildSubmitFn(slug, stateVars, 'submitQuestionnaire')
    );
    changed = true;
  }

  if (src.includes('const submitForm = () => {') && !src.match(/beginPrescriptionCheckout\(/)) {
    src = src.replace(
      /const submitForm = \(\) => \{[\s\S]*?\n  \};/,
      buildSubmitFn(slug, stateVars, 'submitForm')
    );
    changed = true;
  }

  if (!src.includes('const submitPrescriptionRequest = () => {')) {
    const hookAnchor = src.match(/export default function \w+\(\) \{\s*\n/);
    if (hookAnchor) {
      const insertAt = src.indexOf(hookAnchor[0]) + hookAnchor[0].length;
      src = src.slice(0, insertAt) + buildSubmitFn(slug, stateVars) + '\n\n' + src.slice(insertAt);
      changed = true;
    }
  }

  if (src.includes('onClick={() => setSubmitted(true)}')) {
    src = src.replace(/onClick=\{\(\) => setSubmitted\(true\)\}/g, 'onClick={submitPrescriptionRequest}');
    changed = true;
  }

  if (src.includes('onClick={() => setRequestSubmitted(true)}')) {
    src = src.replace(/onClick=\{\(\) => setRequestSubmitted\(true\)\}/g, 'onClick={submitPrescriptionRequest}');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, src);
  }
  return changed;
}

const entries = fs.readdirSync(ROOT, { withFileTypes: true });
let patched = 0;

for (const entry of entries) {
  if (!entry.isDirectory() || entry.name === 'checkout') continue;
  const pagePath = path.join(ROOT, entry.name, 'page.tsx');
  if (!fs.existsSync(pagePath)) continue;
  if (patchFile(pagePath, entry.name)) {
    patched++;
    console.log(`Patched ${entry.name}`);
  }
}

console.log(`Done. Patched ${patched} pages.`);

#!/usr/bin/env node
/**
 * Generate QuickDoctor-User-Manual.pdf from markdown.
 * Usage: node docs/client/generate-pdf.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mdPath = join(__dirname, 'QuickDoctor-User-Manual.md');
const cssPath = join(__dirname, 'pdf-style.css');
const htmlPath = join(__dirname, 'QuickDoctor-User-Manual-print.html');
const pdfPath = join(__dirname, 'QuickDoctor-User-Manual.pdf');

const md = readFileSync(mdPath, 'utf8');
const css = readFileSync(cssPath, 'utf8');

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fmt(s) {
  return esc(s)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function inlineMd(text) {
  let html = '';
  let inTable = false;
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) { html += '</ul>'; inUl = false; }
    if (inOl) { html += '</ol>'; inOl = false; }
  };

  for (const line of text.split('\n')) {
    if (line.startsWith('# QuickDoctor')) continue;
    if (line.startsWith('## Table of Contents')) continue;

    if (line.startsWith('## ')) {
      closeLists();
      if (inTable) { html += '</table>'; inTable = false; }
      html += `<h2>${esc(line.slice(3))}</h2>`;
      continue;
    }
    if (line.startsWith('### ')) { closeLists(); html += `<h3>${esc(line.slice(4))}</h3>`; continue; }
    if (line.startsWith('#### ')) { closeLists(); html += `<h4>${esc(line.slice(5))}</h4>`; continue; }
    if (line.trim() === '---') { closeLists(); html += '<hr>'; continue; }

    if (line.startsWith('|')) {
      closeLists();
      if (line.includes('---')) continue;
      const cells = line.split('|').slice(1, -1).map((c) => fmt(c.trim()));
      if (!inTable) {
        html += '<table><tr>' + cells.map((c) => `<th>${c}</th>`).join('') + '</tr>';
        inTable = true;
      } else {
        html += '<tr>' + cells.map((c) => `<td>${c}</td>`).join('') + '</tr>';
      }
      continue;
    } else if (inTable) { html += '</table>'; inTable = false; }

    if (line.startsWith('- ')) {
      if (inOl) { html += '</ol>'; inOl = false; }
      if (!inUl) { html += '<ul>'; inUl = true; }
      html += `<li>${fmt(line.slice(2))}</li>`;
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (!inOl) { html += '<ol>'; inOl = true; }
      html += `<li>${fmt(line.replace(/^\d+\.\s/, ''))}</li>`;
      continue;
    }

    closeLists();
    if (line.trim() === '' || line.startsWith('*End of document*')) continue;
    html += `<p>${fmt(line)}</p>`;
  }
  closeLists();
  if (inTable) html += '</table>';
  return html;
}

const bodyStart = md.indexOf('## 1. Introduction');
const bodyMd = bodyStart > 0 ? md.slice(bodyStart) : md;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>QuickDoctor User Manual</title>
<style>
@page { size: A4; margin: 18mm 16mm; }
${css}
.cover { text-align:center; padding:60px 20px 30px; page-break-after:always; }
.cover h1 { border:none; font-size:30pt; margin-bottom:8px; }
.cover .sub { font-size:16pt; font-weight:700; color:#334155; }
.cover .meta { color:#64748b; margin-top:20px; line-height:1.8; }
</style>
</head>
<body>
<div class="cover">
  <h1>QuickDoctor</h1>
  <p class="sub">Complete User Manual</p>
  <p class="meta">https://quickdoctor.ie<br>Version 1.0 · July 2026<br><br>For Patients, Doctors &amp; Administrators</p>
</div>
${inlineMd(bodyMd)}
</body>
</html>`;

writeFileSync(htmlPath, html);
console.log('Wrote', htmlPath);

const chromePaths = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
];

const chrome = chromePaths.find(existsSync);
if (chrome) {
  execSync(
    `"${chrome}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file://${htmlPath}"`,
    { stdio: 'inherit' }
  );
  console.log('PDF created:', pdfPath);
} else {
  console.log('Chrome not found. Open QuickDoctor-User-Manual-print.html → Print → Save as PDF');
  process.exit(1);
}

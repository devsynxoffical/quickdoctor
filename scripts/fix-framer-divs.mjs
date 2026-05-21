import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

const motionProps = /\b(initial|animate|exit|transition|whileHover|whileTap|whileFocus|layoutId|layout)=\{?/;

function fixFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  if (!src.includes('framer-motion') && !src.includes("from 'motion")) return false;
  if (!motionProps.test(src)) return false;

  const lines = src.split(/\r?\n/);
  const stack = [];
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const openDiv = line.match(/^(\s*)<div(\s|>)/);
    const openMotion = line.match(/^(\s*)<motion\.div(\s|>)/);
    const closeDiv = line.match(/^(\s*)<\/motion.div>\s*$/);
    const closeMotion = line.match(/^(\s*)<\/motion\.motion.div>\s*$/);

    if (openMotion) {
      let j = i;
      let chunk = lines[j];
      while (!chunk.includes('>') && j < lines.length - 1) {
        j++;
        chunk += '\n' + lines[j];
      }
      if (motionProps.test(chunk)) {
        stack.push({ indent: openMotion[1], line: i, isMotion: true });
      }
    } else if (openDiv) {
      let j = i;
      let chunk = lines[j];
      while (!chunk.includes('>') && j < lines.length - 1) {
        j++;
        chunk += '\n' + lines[j];
      }
      if (motionProps.test(chunk)) {
        const indent = openDiv[1];
        lines[i] = line.replace(/^(\s*)<div/, '$1<motion.div');
        stack.push({ indent, line: i, isMotion: true });
        changed = true;
      }
    } else if (closeDiv && stack.length) {
      const top = stack[stack.length - 1];
      if (top.isMotion) {
        lines[i] = line.replace('</motion.div>', '</motion.div>');
        stack.pop();
        changed = true;
      }
    } else if (closeMotion) {
      if (stack.length) stack.pop();
    } else if (line.match(/^(\s*)<\/div>\s*$/) && stack.length) {
      const top = stack[stack.length - 1];
      if (top.isMotion && top.indent === line.match(/^(\s*)/)[1]) {
        lines[i] = line.replace('</motion.div>', '</motion.div>');
        stack.pop();
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('fixed', path.relative(root, filePath));
  }
  return changed;
}

let n = 0;
for (const f of walk(root)) {
  if (fixFile(f)) n++;
}
console.log(`done, ${n} files`);

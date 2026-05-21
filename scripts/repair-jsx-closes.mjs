import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
const motionProps = /\b(initial|animate|exit|transition|whileHover|whileTap|whileFocus|layoutId|layout)=/;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

function tagChunk(lines, start) {
  let i = start;
  let chunk = lines[i];
  while (!chunk.includes('>') && !chunk.trim().endsWith('/>') && i < lines.length - 1) {
    i++;
    chunk += '\n' + lines[i];
  }
  return { chunk, end: i };
}

function repair(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const stack = [];
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const openMatch = line.match(/^(\s*)<(motion\.div|div)(\s|>|\/)/);
    if (openMatch && !line.trim().endsWith('/>')) {
      const { chunk, end } = tagChunk(lines, i);
      const tag = openMatch[2];
      const needsMotion = tag === 'motion.div' || motionProps.test(chunk);
      if (needsMotion && tag === 'div') {
        lines[i] = line.replace(/^(\s*)<div\b/, '$1<motion.div');
        changed = true;
      }
      stack.push({ needsMotion });
      i = end;
      continue;
    }

    const closeMatch = line.match(/^(\s*)<\/(motion\.div|div)>\s*$/);
    if (closeMatch && stack.length) {
      const top = stack.pop();
      if (top.needsMotion && closeMatch[2] === 'div') {
        lines[i] = `${closeMatch[1]}</motion.div>`;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('repaired', path.relative(root, filePath));
  }
}

for (const f of walk(root)) repair(f);
console.log('done');

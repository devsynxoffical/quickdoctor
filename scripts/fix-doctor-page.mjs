import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = path.join(root, 'src/app/doctor/page.tsx');
let s = fs.readFileSync(p, 'utf8');

// Close stat motion.div cards
s = s.replace(
  /(\{React\.createElement\(stat\.icon[\s\S]*?<\/div>\n)(\s+<\/div>\n\s+\)\)\}\))/,
  '$1$2'.replace('</motion.div>\n           ))}', '</motion.div>\n           ))}')
);

s = s.replace(
  '             </motion.div>\n           ))}\n        </motion.div>\n\n        <motion.div className="grid',
  '             </motion.div>\n           ))}\n        </motion.div>\n\n        <motion.div className="grid'
);

// Simpler: fix known bad close after stat cards
s = s.replace(
  `{React.createElement(stat.icon, { className: "w-6 h-6" })}\n                </motion.div>\n             </motion.div>`,
  `{React.createElement(stat.icon, { className: "w-6 h-6" })}\n                </motion.div>\n             </motion.div>`
);

// Queue cards: div with initial -> motion.div
s = s.replace(
  `queue.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}`,
  `queue.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}`
);

s = s.replace(
  `queue.map((item, i) => (
                      <motion.div
                        key={item.id}`,
  `queue.map((item, i) => (
                      <motion.div
                        key={item.id}`
);

// If still div with initial in queue
s = s.replace(
  /queue\.map\(\(item, i\) => \(\s*<div\s+key=\{item\.id\}/,
  'queue.map((item, i) => (\n                      <motion.div\n                        key={item.id}'
);

fs.writeFileSync(p, s);
console.log('doctor page patched');

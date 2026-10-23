const fs = require('fs');
const path = require('path');
const glob = require('glob');
const root = path.resolve('docs/TeamApollo');
const htmls = glob.sync('**/*.html', { cwd: root });
htmls.forEach(rel => {
  const p = path.join(root, rel);
  let t = fs.readFileSync(p, 'utf8');
  const before = t;
  t = t.replace(/<script([^>]*?)type=["']text\/babel["']([^>]*?)src=["']([^"']+)\.jsx["']([^>]*)><\/script>/gi,
    (m, a1, a2, src, a3) => `<script${a1}${a2}src="${src}.js" defer></script>`);
  t = t.replace(/ data-presets=["'][^"']+["']/g, '');
  if (t !== before) {
    fs.writeFileSync(p, t, 'utf8');
    console.log('rewrote', rel);
  }
});

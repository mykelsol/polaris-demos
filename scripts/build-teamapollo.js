const { transformFileSync } = require('@babel/core');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const root = path.resolve('docs/TeamApollo');
const files = glob.sync('**/*.jsx', { cwd: root });
files.forEach(rel => {
  const inPath = path.join(root, rel);
  const outPath = path.join(root, rel.replace(/\.jsx$/i, '.js'));
  const { code } = transformFileSync(inPath, { configFile: path.resolve('babel.config.json') });
  fs.writeFileSync(outPath, code, 'utf8');
  console.log('built', rel, '->', path.relative(root, outPath));
});

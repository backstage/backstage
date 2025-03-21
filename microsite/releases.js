const fs = require('fs');
const path = require('path');

const docsDir = path.resolve(__dirname, '../docs');

exports.releases = fs
  .readdirSync(path.resolve(docsDir, 'releases'))
  .filter(doc => doc.match(/^v\d+\.\d+\.\d+\.md$/))
  .map(doc => doc.replace(/\.md$/, ''))
  .sort((a, b) => {
    // Semver sort
    const aVal = a
      .slice(1)
      .split('.')
      .reduce((acc, val) => acc * 1000 + parseInt(val), 0);
    const bVal = b
      .slice(1)
      .split('.')
      .reduce((acc, val) => acc * 1000 + parseInt(val), 0);
    return bVal - aVal;
  });

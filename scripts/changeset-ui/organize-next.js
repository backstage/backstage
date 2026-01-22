#!/usr/bin/env node
/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Create readline interface for user input
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask a question and return the answer
 */
function question(rl, prompt) {
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      resolve(answer);
    });
  });
}

/**
 * Main function
 */
async function main() {
  console.log('\n📦 Release Unreleased Changes\n');

  const nextPath = path.join(
    __dirname,
    '../../docs-ui/src/utils/changelogs/next.ts',
  );

  // Check if next.ts exists
  if (!fs.existsSync(nextPath)) {
    console.log('✓ No unreleased changes found (next.ts does not exist)\n');
    return;
  }

  // Read next.ts to count entries
  const nextContent = fs.readFileSync(nextPath, 'utf-8');
  const entryCount = (nextContent.match(/{\s*components:/g) || []).length;

  if (entryCount === 0) {
    console.log('✓ No entries in next.ts\n');
    return;
  }

  console.log(
    `Found ${entryCount} unreleased ${
      entryCount === 1 ? 'entry' : 'entries'
    } in next.ts\n`,
  );

  // Ask for version
  const rl = createInterface();
  const version = await question(
    rl,
    'Enter the version to release (e.g., 0.12.0): ',
  );
  rl.close();

  if (!version.match(/^\d+\.\d+\.\d+$/)) {
    console.error('\n❌ Invalid version format. Use X.Y.Z (e.g., 0.12.0)\n');
    process.exit(1);
  }

  // Update next.ts content
  const varName = `changelog_${version.replace(/\./g, '_')}`;
  const updatedContent = nextContent
    .replace(/export const changelogNext/g, `export const ${varName}`)
    .replace(/version: 'next'/g, `version: '${version}'`);

  // Write to new versioned file
  const versionedPath = path.join(
    __dirname,
    `../../docs-ui/src/utils/changelogs/v${version}.ts`,
  );
  fs.writeFileSync(versionedPath, updatedContent, 'utf-8');
  console.log(
    `\n✅ Created v${version}.ts with ${entryCount} ${
      entryCount === 1 ? 'entry' : 'entries'
    }`,
  );

  // Delete next.ts
  fs.unlinkSync(nextPath);
  console.log('   Deleted next.ts');

  // Update changelog.ts
  const changelogPath = path.join(
    __dirname,
    '../../docs-ui/src/utils/changelog.ts',
  );
  let changelogContent = fs.readFileSync(changelogPath, 'utf-8');

  changelogContent = changelogContent
    .replace(
      /import { changelogNext } from '.\/changelogs\/next';/,
      `import { ${varName} } from './changelogs/v${version}';`,
    )
    .replace(/\.\.\.changelogNext,/, `...${varName},`);

  fs.writeFileSync(changelogPath, changelogContent, 'utf-8');
  console.log('   Updated changelog.ts');

  console.log('\n📝 Next steps:');
  console.log('   1. Review the files');
  console.log(
    `   2. Add PR numbers to entries in v${version}.ts (add prs: ['12345'] field)`,
  );
  console.log('   3. Commit the changes');
  console.log(`\n   git add docs-ui/src/utils/changelogs/v${version}.ts`);
  console.log('   git add docs-ui/src/utils/changelog.ts');
  console.log(`   git commit -m "Release UI v${version}"\n`);
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

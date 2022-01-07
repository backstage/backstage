#!/usr/bin/env node
/*
 * Copyright 2022 The Backstage Authors
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

const { promises: fs } = require('fs');
const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');

const execFile = promisify(execFileCb);

// Parses package.json files and returns the package names
async function getPackagesNames(files) {
  const names = [];
  for (const file of files) {
    const data = JSON.parse(await fs.readFile(file, 'utf8'));
    names.push(data.name);
  }
  return names;
}

async function createChangeset(fileName, commitMessage, packages) {
  const pkgs = packages.map(pkg => `'${pkg}': patch`).join('\n');
  const message = commitMessage.replace(/(b|B)ump ([a-z-]+)/, 'Bump `$2`');
  const body = `---\n${pkgs}\n---\n\n${message}`;
  await fs.writeFile(fileName, body);
}

async function runPlain(cmd, ...args) {
  try {
    const { stdout } = await execFile(cmd, args, { shell: true });
    return stdout.trim();
  } catch (error) {
    if (error.stderr) {
      process.stderr.write(error.stderr);
    }
    if (!error.code) {
      throw error;
    }
    throw new Error(
      `Command '${[cmd, ...args].join(' ')}' failed with code ${error.code}`,
    );
  }
}

async function main() {
  const branch = await runPlain('git', 'branch', '--show-current');
  if (!branch.startsWith('dependabot/')) {
    console.log('Not a dependabot branch');
    return;
  }

  const diffFiles = await runPlain('git', 'diff', '--name-only', 'HEAD~1');
  if (diffFiles.includes('.changeset')) {
    console.log('Changeset already exists');
    return;
  }
  const files = diffFiles
    .split('\n')
    .filter(file => file !== 'package.json') // skip root package.json
    .filter(file => file.includes('package.json'));

  if (!files.length) {
    console.log('no package.json changes, skipping');
    return;
  }

  const packageNames = await getPackagesNames(files);
  const shortHash = await runPlain('git', 'rev-parse', '--short', 'HEAD');
  const fileName = `.changeset/dependabot-${shortHash.trim()}.md`;
  const commitMessage = await runPlain(
    'git',
    'show',
    '--pretty=format:%s',
    '-s',
    'HEAD',
  );
  await createChangeset(fileName, commitMessage, packageNames);
  await runPlain('git', 'add', fileName);
  await runPlain('git', 'commit', '-C', 'HEAD', '--amend', '--no-edit');
  await runPlain('git', 'push', '--force');
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});

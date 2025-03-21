#!/usr/bin/env node
/* eslint-disable @backstage/no-undeclared-imports */
/*
 * Copyright 2020 The Backstage Authors
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

// This script is used to verify that the branch that we're patching is correct, and that we're not patching branches like master

const { execFile: execFileCb } = require('child_process');
const { resolve: resolvePath } = require('path');
const { promises: fs } = require('fs');
const { promisify } = require('util');
const semver = require('semver');

const baseRef = process.env.GITHUB_BASE_REF || 'master';

const execFile = promisify(execFileCb);

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
  process.cwd(resolvePath(__dirname, '..'));

  const oldContent = await runPlain(
    'git',
    'show',
    `origin/${baseRef}:package.json`,
  );

  const { version: oldVersion } = JSON.parse(oldContent);
  const { version: newVersion } = JSON.parse(
    await fs.readFile('package.json', 'utf8'),
  );

  if (oldVersion === newVersion) {
    return;
  }

  const versionDiff = semver.diff(oldVersion, newVersion);
  if (baseRef === 'master' && versionDiff === 'patch') {
    throw new Error('Refusing to release a patch bump on the master branch');
  }
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});

#!/usr/bin/env node
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

/* eslint-disable @backstage/no-undeclared-imports */

const { execFile: execFileCb } = require('child_process');
const { resolve: resolvePath, dirname: dirnamePath } = require('path');
const { promisify } = require('util');

const execFile = promisify(execFileCb);

async function findLockFiles() {
  const projectRoot = resolvePath(__dirname, '..');

  let files = process.argv.slice(2).filter(arg => !arg.startsWith('--'));

  for (const argumentFile of files) {
    if (!argumentFile.match(/(?:^|[\/\\])yarn.lock$/)) {
      throw new Error(`Not a yarn.lock file path argument: "${argumentFile}"`);
    }
  }

  if (!files.length) {
    // List all lock files that are in the root or in an immediate subdirectory
    files = ['yarn.lock', 'microsite/yarn.lock'];
  }

  return files.map(file => ({
    fileRelativeToProjectRoot: file,
    directoryRelativeToProjectRoot: dirnamePath(file),
    directoryAbsolute: resolvePath(projectRoot, dirnamePath(file)),
  }));
}

async function main() {
  const lockFiles = await findLockFiles();

  let fix = false;
  for (const arg of process.argv) {
    if (arg.startsWith('--')) {
      if (arg === '--fix') {
        fix = true;
      } else {
        throw new Error(`Unknown argument ${arg}`);
      }
    }
  }

  for (const lockFile of lockFiles) {
    console.log('Checking lock file', lockFile.fileRelativeToProjectRoot);

    let stdout;
    let stderr;
    let failed;

    try {
      const result = await execFile(
        'yarn',
        ['dedupe', ...(fix ? [] : ['--check'])],
        {
          shell: true,
          cwd: lockFile.directoryAbsolute,
        },
      );
      stdout = result.stdout?.trim();
      stderr = result.stderr?.trim();
      failed = false;
    } catch (error) {
      stdout = error.stdout?.trim();
      stderr = error.stderr?.trim();
      failed = true;
    }

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error(stderr);
    }

    if (failed) {
      if (!fix) {
        const command = `yarn${
          lockFile.directoryRelativeToProjectRoot === '.'
            ? ''
            : ` --cwd ${lockFile.directoryRelativeToProjectRoot}`
        } dedupe`;
        const padding = ' '.repeat(Math.max(0, 85 - 6 - command.length));
        console.error('');
        console.error(
          '*************************************************************************************',
        );
        console.error(
          '* You have duplicate versions of some packages in a yarn.lock file.                 *',
        );
        console.error(
          '* To solve this, run the following command from the project root and commit all     *',
        );
        console.log(
          '* yarn.lock changes.                                                                *',
        );
        console.log(
          '*                                                                                   *',
        );
        console.log(`*   ${command}${padding} *`);
        console.error(
          '*************************************************************************************',
        );
        console.error('');
      }

      process.exit(1);
    }
  }
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});

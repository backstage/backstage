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

const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');

const execFile = promisify(execFileCb);

async function main() {
  try {
    const { stdout } = await execFile('yarn', ['dedupe', '--check'], {
      shell: true,
    });
    console.log(stdout);
  } catch (error) {
    const stdout = error.stdout?.trim();
    const stderr = error.stderr?.trim();

    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.error(stderr);
    }

    console.error('');
    console.error(
      '*************************************************************************************',
    );
    console.error(
      '* You have duplicate versions of some packages in the yarn.lock file.               *',
    );
    console.error(
      '* To solve this, run `yarn dedupe` and commit all yarn.lock changes.                *',
    );
    console.error(
      '*************************************************************************************',
    );
    console.error('');

    process.exit(1);
  }
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});

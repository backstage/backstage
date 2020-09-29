#!/usr/bin/env node

/*
 * Copyright 2020 Spotify AB
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
const { execSync, spawnSync } = require('child_process');
const path = require('path');

const validMDFilesCommand = 'git ls-files | ./node_modules/.bin/shx grep ".md"';

const inheritStdIo = {
  stdio: 'inherit',
};

// xargs is not supported by shx.
if (process.platform === 'win32') {
  try {
    // get list of all md files except in directories of gitignore.
    let filesToLint = execSync(validMDFilesCommand, {
      stdio: ['ignore', 'pipe', 'inherit'],
    });

    // set all file(s) path as absolute path
    filesToLint = filesToLint
      .toString()
      .split('\n')
      .map(filepath => (filepath ? path.join(process.cwd(), filepath) : null))
      .filter(Boolean);

    spawnSync('vale', filesToLint, inheritStdIo);
  } catch (e) {
    process.exit(1);
  }
} else {
  // use xargs
  try {
    execSync(`${validMDFilesCommand} | xargs vale`, inheritStdIo);
  } catch (e) {
    process.exit(1);
  }
}

#!/usr/bin/env node
/*
 * Copyright 2024 The Backstage Authors
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

// This switches all `workspace:^` dependencies in the project to instead use `workspace:*`
// This is used for next releases in order to avoid the `^` range that is otherwise likely to cause issues.
// For example, a `^0.5.0-next.0` range will match `0.5.0-next.0`, `0.5.0-next.1`, and even `0.5.2`.
// This can often lead to issues as there might be breaking changes across these versions, and in practice
// it will only be possible to install the most recent release without a lot of hassle.

const fs = require('fs-extra');
const { getPackages } = require('@manypkg/get-packages');
const { resolve } = require('path');

const depTypes = ['dependencies', 'devDependencies', 'peerDependencies'];

async function main() {
  const rootPath = resolve(__dirname, '..');
  const { packages } = await getPackages(rootPath);

  for (const pkg of packages) {
    let changed = false;
    for (const depType of depTypes) {
      const deps = pkg.packageJson[depType];
      if (deps) {
        for (const depName of Object.keys(deps)) {
          if (deps[depName] === 'workspace:^') {
            deps[depName] = 'workspace:*';
            changed = true;
          }
        }
      }
    }

    if (changed) {
      await fs.writeJson(resolve(pkg.dir, 'package.json'), pkg.packageJson, {
        spaces: 2,
      });
    }
  }
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});

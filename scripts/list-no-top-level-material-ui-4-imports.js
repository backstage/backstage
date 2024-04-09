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

const fs = require('fs-extra');
const { getPackages } = require('@manypkg/get-packages');
const { resolve, join } = require('path');

async function main() {
  const rootPath = resolve(__dirname, '..');
  const { packages } = await getPackages(rootPath);

  for (const pkg of packages) {
    pkgRole = pkg.packageJson.backstage?.role;
    if (pkgRole === 'frontend-plugin' || pkgRole === 'web-library') {
      const depKeys = Object.keys(pkg.packageJson.dependencies);
      if (depKeys.findIndex(d => d.includes('@material-ui')) !== -1) {
        const eslintrcPath = join(pkg.dir, '.eslintrc.js');
        const targetEslintrc = (await fs.readFile(eslintrcPath)).toString();
        if (
          !targetEslintrc.includes(
            "'@backstage/no-top-level-material-ui-4-imports': 'error'",
          )
        ) {
          console.log(pkg.packageJson.name);
        }
      }
    }
  }
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});

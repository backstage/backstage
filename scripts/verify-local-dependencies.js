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

const fs = require('fs-extra');
const { getPackages } = require('@manypkg/get-packages');
const { resolve: resolvePath, join: joinPath } = require('path');

/**
 * This script checks that all local package dependencies within the repo
 * point to the correct version ranges.
 *
 * It can be run with a `--fix` flag to a automatically fix any issues.
 */

const depTypes = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

async function main(args) {
  const shouldFix = args.includes('--fix');
  const rootPath = resolvePath(__dirname, '..');
  const { packages } = await getPackages(rootPath);

  let hadErrors = false;

  const pkgMap = new Map(packages.map(pkg => [pkg.packageJson.name, pkg]));

  for (const pkg of packages) {
    let fixed = false;

    for (const depType of depTypes) {
      const deps = pkg.packageJson[depType];

      for (const [dep, range] of Object.entries(deps || {})) {
        if (range === '' || range.startsWith('link:')) {
          continue;
        }
        const localPackage = pkgMap.get(dep);
        if (localPackage && range !== 'workspace:^') {
          hadErrors = true;
          console.log(
            `Local dependency from ${pkg.packageJson.name} to ${dep} should have a workspace range`,
          );

          fixed = true;
          pkg.packageJson[depType][dep] = 'workspace:^';
        }
      }
    }

    if (shouldFix && fixed) {
      await fs.writeJson(joinPath(pkg.dir, 'package.json'), pkg.packageJson, {
        spaces: 2,
      });
    }
  }

  if (!shouldFix && hadErrors) {
    console.error();
    console.error('At least one package has an invalid local dependency');
    console.error(
      'Run `node scripts/verify-local-dependencies.js --fix` to fix',
    );

    process.exit(2);
  }
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});

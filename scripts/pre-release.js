#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
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

const fs = require('fs-extra');
const semver = require('semver');
const { getPackages } = require('@manypkg/get-packages');
const path = require('path');

const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
];

/*

Shipping to main TODO:

- [] Document emergency release flow
- [x] Workflow that triggers releases of `release-*-patch` branches
- [x] Branch protection of `release-*-patch` branches
- [x] Bring release.js + patched.json into the main repo
- [] profit


*/

async function main() {
  const patchedJsonPath = path.resolve('.changeset', 'patched.json');
  const { currentReleaseVersion } = await fs.readJSON(patchedJsonPath);
  if (Object.keys(currentReleaseVersion).length === 0) {
    console.log('No currentReleaseVersion overrides found, skipping.');
    return;
  }

  const { packages } = await getPackages(path.resolve('.'));
  console.log('packages', packages);

  const pendingVersionBumps = new Map();

  for (const [name, version] of Object.entries(currentReleaseVersion)) {
    const pkg = packages.find(p => p.packageJson.name === name);
    if (!pkg) {
      throw new Error(`Package ${name} not found`);
    }

    if (!semver.valid(version)) {
      throw new Error(`Invalid base version ${version} for package ${name}`);
    }

    const currentVersion = semver.parse(pkg.packageJson.version);
    const targetVersion = semver.parse(version).inc('patch');
    targetVersion.prerelease = currentVersion.prerelease;

    const targetVersionString = targetVersion.format();
    pendingVersionBumps.set(name, {
      targetVersion: targetVersionString,
      targetRange: `^${targetVersionString}`,
    });
  }

  console.log('DEBUG: pendingVersionBumps =', pendingVersionBumps);

  for (const { dir, packageJson } of packages) {
    let hasChanges = false;

    if (pendingVersionBumps.has(packageJson.name)) {
      packageJson.version = pendingVersionBumps.get(
        packageJson.name,
      ).targetVersion;
      hasChanges = true;
    }

    for (const depType of DEPENDENCY_TYPES) {
      const deps = packageJson[depType];
      for (const depName of Object.keys(deps ?? {})) {
        const currentRange = deps[depName];

        if (pendingVersionBumps.has(depName)) {
          const pendingBump = pendingVersionBumps.get(depName);
          console.log(
            `DEBUG: replacing ${depName} ${currentRange} with ${pendingBump.targetRange} in ${depType} of ${packageJson.name}`,
          );
          deps[depName] = pendingBump.targetRange;
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      console.log('writing package', packageJson.name);
      await fs.writeJSON(path.resolve(dir, 'package.json'), packageJson, {
        spaces: 2,
      });
    }
  }

  await fs.writeJSON(
    patchedJsonPath,
    { currentReleaseVersion: {} },
    { spaces: 2 },
  );
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});

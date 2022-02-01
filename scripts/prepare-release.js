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
const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');

const execFile = promisify(execFileCb);

// All of these are considered to be main-line release branches
const MAIN_BRANCHES = ['master', 'origin/master', 'changeset-release/master'];

const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
];

/**
 * Bumps up the versions of packages to account for
 * the base versions that are set in .changeset/patched.json.
 * This may be needed when we have made emergency releases.
 */
async function updatePatchVersions() {
  const patchedJsonPath = path.resolve('.changeset', 'patched.json');
  const { currentReleaseVersion } = await fs.readJson(patchedJsonPath);
  if (Object.keys(currentReleaseVersion).length === 0) {
    console.log('No currentReleaseVersion overrides found, skipping.');
    return;
  }

  const { packages } = await getPackages(path.resolve('.'));

  const pendingVersionBumps = new Map();

  for (const [name, version] of Object.entries(currentReleaseVersion)) {
    const pkg = packages.find(p => p.packageJson.name === name);
    if (!pkg) {
      throw new Error(`Package ${name} not found`);
    }

    if (!semver.valid(version)) {
      throw new Error(`Invalid base version ${version} for package ${name}`);
    }

    let targetVersion = version;

    // If we're currently in a pre-release we need to manually execute the
    // patch bump up to the next version. And we also need to make sure we
    // resume the releases at the same pre-release tag.
    const currentPrerelease = semver.prerelease(pkg.packageJson.version);
    if (currentPrerelease) {
      const parsed = targetVersion.parse(version);
      parsed.inc('patch');
      parsed.prerelease = currentPrerelease;
      targetVersion = parsed.format();
    }

    pendingVersionBumps.set(name, {
      targetVersion,
      targetRange: `^${targetVersion}`,
    });
  }

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
        if (currentRange === '*') {
          continue;
        }

        if (pendingVersionBumps.has(depName)) {
          const pendingBump = pendingVersionBumps.get(depName);
          console.log(
            `Replacing ${depName} ${currentRange} with ${pendingBump.targetRange} in ${depType} of ${packageJson.name}`,
          );
          deps[depName] = pendingBump.targetRange;
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      await fs.writeJson(path.resolve(dir, 'package.json'), packageJson, {
        spaces: 2,
        encoding: 'utf8',
      });
    }
  }

  await fs.writeJSON(
    patchedJsonPath,
    { currentReleaseVersion: {} },
    { spaces: 2, encoding: 'utf8' },
  );
}

/**
 * Returns the mode and tag that is currently set
 * in the .changeset/pre.json file
 */
async function getPreInfo(rootPath) {
  const pre = path.join(rootPath, '.changeset', 'pre.json');
  if (!(await fs.pathExists(pre))) {
    return { mode: undefined, tag: undefined };
  }

  const { mode, tag } = await fs.readJson(pre);
  return { mode, tag };
}

/**
 * Bumps the release version in the root package.json.
 *
 * This takes into account whether we're in pre-release mode or on a patch branch.
 */
async function updateBackstageReleaseVersion() {
  const rootPath = path.resolve(__dirname, '..');
  const branchName = await execFile(
    'git',
    ['rev-parse', '--abbrev-ref', 'HEAD'],
    { shell: true },
  ).then(({ stdout }) => stdout.trim());
  const { mode: preMode, tag: preTag } = await getPreInfo(rootPath);

  const packagePath = path.join(rootPath, 'package.json');
  const package = await fs.readJson(packagePath);
  const { version: currentVersion } = package;

  let nextVersion;
  if (MAIN_BRANCHES.includes(branchName)) {
    if (preMode === 'pre') {
      if (semver.prerelease(currentVersion)) {
        nextVersion = semver.inc(currentVersion, 'pre', preTag);
      } else {
        nextVersion = semver.inc(currentVersion, 'preminor', preTag);
      }
    } else if (preMode === 'exit') {
      nextVersion = semver.inc(currentVersion, 'patch');
    } else {
      nextVersion = semver.inc(currentVersion, 'minor');
    }
  } else {
    if (preMode) {
      throw new Error(`Unexpected pre mode ${preMode} on branch ${branchName}`);
    }
    nextVersion = semver.inc(currentVersion, 'patch');
  }

  await fs.writeJson(
    packagePath,
    {
      ...package,
      version: nextVersion,
    },
    { spaces: 2, encoding: 'utf8' },
  );
}

async function main() {
  await updatePatchVersions();
  await updateBackstageReleaseVersion();
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});

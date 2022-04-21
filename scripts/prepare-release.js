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

// This prefix is used for patch branches, followed by the release version
// For example, `patch/v1.2.0`
const PATCH_BRANCH_PREFIX = 'patch/v';

const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
];

/**
 * Finds the current stable release version of the repo, looking at
 * the current commit and backwards, finding the first commit were a
 * stable version is present.
 */
async function findCurrentReleaseVersion(repo) {
  const rootPkgPath = path.resolve(repo.root.dir, 'package.json');
  const pkg = await fs.readJson(rootPkgPath);

  if (!semver.prerelease(pkg.version)) {
    return pkg.version;
  }

  const { stdout: revListStr } = await execFile('git', [
    'rev-list',
    'HEAD',
    '--',
    'package.json',
  ]);
  const revList = revListStr.trim().split(/\r?\n/);

  for (const rev of revList) {
    const { stdout: pkgJsonStr } = await execFile('git', [
      'show',
      `${rev}:package.json`,
    ]);
    if (pkgJsonStr) {
      const pkgJson = JSON.parse(pkgJsonStr);
      if (!semver.prerelease(pkgJson.version)) {
        return pkgJson.version;
      }
    }
  }

  throw new Error('No stable release found');
}

/**
 * Finds the tip of the patch branch of a given release version.
 * Returns undefined if no patch branch exists.
 */
async function findTipOfPatchBranch(repo, release) {
  try {
    await execFile('git', ['fetch', 'origin', PATCH_BRANCH_PREFIX + release], {
      shell: true,
      cwd: repo.root.dir,
    });
  } catch (error) {
    if (error.stderr?.match(/fatal: couldn't find remote ref/i)) {
      return undefined;
    }
    throw error;
  }
  const { stdout: refStr } = await execFile('git', ['rev-parse', 'FETCH_HEAD']);
  return refStr.trim();
}

/**
 * Returns a map of packages to their versions for any package version
 * in <ref> that does not match the current version in the working directory.
 */
async function detectPatchVersionsBetweenRefs(repo, baseRef, ref) {
  const patchVersions = new Map();

  for (const pkg of repo.packages) {
    const pkgJsonPath = path.join(
      path.relative(repo.root.dir, pkg.dir),
      'package.json',
    );
    try {
      const { stdout: basePkgJsonStr } = await execFile('git', [
        'show',
        `${baseRef}:${pkgJsonPath}`,
      ]);

      const { stdout: pkgJsonStr } = await execFile('git', [
        'show',
        `${ref}:${pkgJsonPath}`,
      ]);
      if (basePkgJsonStr && pkgJsonStr) {
        const basePkgJson = JSON.parse(basePkgJsonStr);
        const releasePkgJson = JSON.parse(pkgJsonStr);

        if (releasePkgJson.private) {
          continue;
        }
        if (releasePkgJson.name !== basePkgJson.name) {
          throw new Error(
            `Mismatched package name at ${pkg.dir}, ${releasePkgJson.name} !== ${basePkgJson.name}`,
          );
        }
        if (releasePkgJson.version !== basePkgJson.version) {
          patchVersions.set(basePkgJson.name, releasePkgJson.version);
        }
      }
    } catch (error) {
      if (
        error.stderr?.match(/^fatal: Path .* exists on disk, but not in .*$/im)
      ) {
        console.log(`Skipping new package ${pkg.packageJson.name}`);
        continue;
      }
      throw error;
    }
  }

  return patchVersions;
}

/**
 * Bumps up the versions of packages to account for
 * the base versions that are set in .changeset/patched.json.
 * This may be needed when we have made emergency releases.
 */
async function applyPatchVersions(repo, patchVersions) {
  const pendingVersionBumps = new Map();

  for (const [name, patchVersion] of patchVersions) {
    const pkg = repo.packages.find(p => p.packageJson.name === name);
    if (!pkg) {
      throw new Error(`Package ${name} not found`);
    }

    if (!semver.valid(patchVersion)) {
      throw new Error(
        `Invalid base version ${patchVersion} for package ${name}`,
      );
    }

    if (semver.gte(pkg.packageJson.version, patchVersion)) {
      console.log(
        `No need to bump ${name} ${pkg.packageJson.version} is already ahead of ${patchVersion}`,
      );
      continue;
    }

    let targetVersion = patchVersion;

    // If we're currently in a pre-release we need to manually execute the
    // patch bump up to the next version. And we also need to make sure we
    // resume the releases at the same pre-release tag.
    const currentPrerelease = semver.prerelease(pkg.packageJson.version);
    if (currentPrerelease) {
      const parsed = semver.parse(targetVersion);
      parsed.inc('patch');
      parsed.prerelease = currentPrerelease;
      targetVersion = parsed.format();
    }

    pendingVersionBumps.set(name, {
      targetVersion,
      targetRange: `^${targetVersion}`,
    });
  }

  for (const { dir, packageJson } of [repo.root, ...repo.packages]) {
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
        if (currentRange === '*' || currentRange === '') {
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
}

/**
 * Detects any patched packages version since the most recent release on
 * the main branch, and then bumps all packages in the repo accordingly.
 */
async function updatePackageVersions(repo) {
  const currentRelease = await findCurrentReleaseVersion(repo);
  console.log(`Current release version: ${currentRelease}`);

  const patchRef = await findTipOfPatchBranch(repo, currentRelease);
  if (patchRef) {
    console.log(`Tip of the patch branch: ${patchRef}`);

    const patchVersions = await detectPatchVersionsBetweenRefs(
      repo,
      `v${currentRelease}`,
      patchRef,
    );
    if (patchVersions.size > 0) {
      console.log(
        `Found ${patchVersions.size} packages that were patched since the last release`,
      );
      for (const [name, version] of patchVersions) {
        console.log(`  ${name}: ${version}`);
      }

      await applyPatchVersions(repo, patchVersions);
    } else {
      console.log('No packages were patched since the last release');
    }
  } else {
    console.log('No patch branch found');
  }
}

/**
 * Returns the mode and tag that is currently set
 * in the .changeset/pre.json file
 */
async function getPreInfo(repo) {
  const pre = path.join(repo.root.dir, '.changeset', 'pre.json');
  if (!(await fs.pathExists(pre))) {
    return { mode: undefined, tag: undefined };
  }

  const { mode, tag } = await fs.readJson(pre);
  return { mode, tag };
}

/**
 * Returns the name of the current git branch
 */
async function getCurrentBranch(repo) {
  const { stdout } = await execFile(
    'git',
    ['rev-parse', '--abbrev-ref', 'HEAD'],
    { cwd: repo.root.dir, shell: true },
  );
  return stdout.trim();
}

/**
 * Bumps the release version in the root package.json.
 *
 * This takes into account whether we're in pre-release mode or on a patch branch.
 */
async function updateBackstageReleaseVersion(repo, type) {
  const { mode: preMode, tag: preTag } = await getPreInfo(repo);

  const { version: currentVersion } = repo.root.packageJson;

  let nextVersion;
  if (type === 'minor') {
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
  } else if (type === 'patch') {
    if (preMode) {
      throw new Error(`Unexpected pre mode ${preMode} on current branch`);
    }
    nextVersion = semver.inc(currentVersion, 'patch');
  }

  await fs.writeJson(
    path.join(repo.root.dir, 'package.json'),
    {
      ...repo.root.packageJson,
      version: nextVersion,
    },
    { spaces: 2, encoding: 'utf8' },
  );
}

async function main() {
  const repo = await getPackages(__dirname);
  const branchName = await getCurrentBranch(repo);
  const isMainBranch = MAIN_BRANCHES.includes(branchName);

  console.log(`Current branch: ${branchName}`);
  if (isMainBranch) {
    console.log('Main release, updating package versions');
    await updatePackageVersions(repo);
  }

  await updateBackstageReleaseVersion(repo, isMainBranch ? 'minor' : 'patch');
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});

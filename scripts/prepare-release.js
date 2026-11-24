#!/usr/bin/env node
/* eslint-disable @backstage/no-undeclared-imports */
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
const path = require('node:path');
const { execFile: execFileCb } = require('node:child_process');
const { promisify } = require('node:util');
const { default: parseChangeset } = require('@changesets/parse');

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
 * Fetches all patch branches and returns the release version that each of them
 * patches, along with the ref that points to the tip of the branch.
 */
async function findPatchBranches(repo) {
  const remotePrefix = `refs/remotes/origin/${PATCH_BRANCH_PREFIX}`;
  await execFile(
    'git',
    [
      'fetch',
      '--prune',
      'origin',
      `+refs/heads/${PATCH_BRANCH_PREFIX}*:${remotePrefix}*`,
    ],
    { cwd: repo.root.dir },
  );
  const { stdout } = await execFile(
    'git',
    ['for-each-ref', '--format=%(refname)', `${remotePrefix}*`],
    { cwd: repo.root.dir },
  );

  const branches = [];
  for (const ref of stdout.split(/\r?\n/).filter(Boolean)) {
    const release = ref.slice(remotePrefix.length);
    if (semver.valid(release)) {
      branches.push({ release, ref });
    } else {
      console.log(`Ignoring patch branch with an invalid version: ${ref}`);
    }
  }
  return branches;
}

/**
 * Returns a map of package names to versions, for every package in the current
 * workspace whose version on a patch branch differs from the one in the release
 * that the branch patches. This includes packages that were added on the patch
 * branch, since they were then first published from it.
 */
async function detectPatchVersions(repo, release, ref) {
  const packagesByPath = new Map(
    repo.packages.map(pkg => [
      path.posix.join(
        path.relative(repo.root.dir, pkg.dir).split(path.sep).join('/'),
        'package.json',
      ),
      pkg,
    ]),
  );

  // Only the package.json files that changed on the branch are read, which
  // keeps this fast even with many patch branches and a partial clone.
  const diffArgs = [
    '--no-renames',
    '--diff-filter=AM',
    `v${release}`,
    ref,
    '--',
    ':(glob)**/package.json',
  ];
  const { stdout: diffStr } = await execFile(
    'git',
    ['diff', '--name-status', ...diffArgs],
    { cwd: repo.root.dir },
  );

  // In a partial clone, each read below would otherwise fetch its blob from
  // the remote one by one. Diffing the contents fetches them all in one batch.
  await execFile('git', ['diff', '--numstat', ...diffArgs], {
    cwd: repo.root.dir,
  });

  const readPackageJson = async (rev, pkgJsonPath) => {
    const args = ['show', `${rev}:${pkgJsonPath}`];
    const { stdout } = await execFile('git', args, { cwd: repo.root.dir });
    return JSON.parse(stdout);
  };

  const patchVersions = new Map();
  for (const line of diffStr.split(/\r?\n/).filter(Boolean)) {
    const [status, pkgJsonPath] = line.split('\t');
    const pkg = packagesByPath.get(pkgJsonPath);
    if (!pkg) {
      continue;
    }

    const patchPkgJson = await readPackageJson(ref, pkgJsonPath);
    if (patchPkgJson.private) {
      continue;
    }
    if (patchPkgJson.name !== pkg.packageJson.name) {
      console.log(
        `Ignoring ${patchPkgJson.name} on ${ref}, a different package now lives at ${pkgJsonPath}`,
      );
      continue;
    }
    if (status === 'M') {
      const basePkgJson = await readPackageJson(`v${release}`, pkgJsonPath);
      if (basePkgJson.version === patchPkgJson.version) {
        continue;
      }
    }
    patchVersions.set(patchPkgJson.name, patchPkgJson.version);
  }

  return patchVersions;
}

/**
 * Bumps up the versions of packages to account for versions that have been
 * published from patch branches.
 *
 * A patch from the current release line is built from the same release that
 * the main branch is based on, so we catch up to it. A patch from an older release line is a
 * different build, with that line's dependencies, so we move past it even if
 * we are at the same version. Otherwise `^` ranges in apps on the current
 * release would resolve to the older line's build.
 */
async function applyPatchVersions(repo, patchVersions) {
  const pendingVersionBumps = new Map();

  for (const [name, patch] of patchVersions) {
    const pkg = repo.packages.find(p => p.packageJson.name === name);
    if (!pkg) {
      throw new Error(`Package ${name} not found`);
    }

    if (!semver.valid(patch.version)) {
      throw new Error(
        `Invalid base version ${patch.version} for package ${name}`,
      );
    }

    const isAhead = patch.fromOlderRelease
      ? semver.gt(pkg.packageJson.version, patch.version)
      : semver.gte(pkg.packageJson.version, patch.version);
    if (isAhead) {
      console.log(
        `No need to bump ${name} ${pkg.packageJson.version} is already ahead of ${patch.version}`,
      );
      continue;
    }

    let targetVersion = patch.version;

    // If we're currently in a pre-release we need to manually execute the
    // patch bump up to the next version. And we also need to make sure we
    // resume the releases at the same pre-release tag.
    const currentPrerelease = semver.prerelease(pkg.packageJson.version);
    if (currentPrerelease) {
      const parsed = semver.parse(targetVersion);
      parsed.inc('patch');
      parsed.prerelease = currentPrerelease;
      targetVersion = parsed.format();
    } else if (patch.fromOlderRelease) {
      targetVersion = semver.inc(targetVersion, 'patch');
    }

    pendingVersionBumps.set(name, {
      targetVersion,
      targetRange: `^${targetVersion}`,
      changelogMessage: patch.fromOlderRelease
        ? 'Bumped version to move past a patch release from an older release line.'
        : 'Bumped version to account for a patch release.',
    });
  }

  for (const { dir, packageJson } of [repo.root, ...repo.packages]) {
    let hasChanges = false;

    if (pendingVersionBumps.has(packageJson.name)) {
      const { targetVersion, changelogMessage } = pendingVersionBumps.get(
        packageJson.name,
      );
      packageJson.version = targetVersion;
      const changelogPath = path.resolve(dir, 'CHANGELOG.md');
      const changelog = await fs.readFile(changelogPath, 'utf8');
      const titleEnd = changelog.indexOf('\n');
      if (titleEnd === -1) {
        throw new Error(`Invalid changelog for ${packageJson.name}`);
      }
      const entry = `\n## ${targetVersion}\n\n### Patch Changes\n\n- ${changelogMessage}\n`;
      await fs.writeFile(
        changelogPath,
        `${changelog.slice(0, titleEnd + 1)}${entry}${changelog.slice(
          titleEnd + 1,
        )}`,
      );
      hasChanges = true;
    }

    for (const depType of DEPENDENCY_TYPES) {
      const deps = packageJson[depType];
      for (const depName of Object.keys(deps ?? {})) {
        const currentRange = deps[depName];
        if (
          currentRange === '*' ||
          currentRange === '' ||
          currentRange.startsWith('workspace:')
        ) {
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
 * Detects any package versions that have been published from patch branches,
 * and then bumps all packages in the repo accordingly. This includes the patch
 * branches of older release lines, since a fix that is backported to an older
 * line can be published with a version that is ahead of the current one.
 */
async function updatePackageVersions(repo) {
  const currentRelease = await findCurrentReleaseVersion(repo);
  console.log(`Current release version: ${currentRelease}`);

  const patchVersions = new Map();
  for (const { release, ref } of await findPatchBranches(repo)) {
    const fromOlderRelease = semver.lt(release, currentRelease);
    const branchVersions = await detectPatchVersions(repo, release, ref);
    for (const [name, version] of branchVersions) {
      console.log(`Found ${name}@${version} on ${ref}`);
      const known = patchVersions.get(name);
      if (!known || semver.gt(version, known.version)) {
        patchVersions.set(name, { version, fromOlderRelease });
      } else if (semver.eq(version, known.version) && fromOlderRelease) {
        // Moving past the version is always safe, catching up to it is not
        known.fromOlderRelease = true;
      }
    }
  }

  if (patchVersions.size > 0) {
    await applyPatchVersions(repo, patchVersions);
  } else {
    console.log('No patched packages found on any patch branch');
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

/**
 * Ensures that the changesets include a version bump of create-app otherwise
 * generates a new patch changeset for create-app.
 */
async function ensureCreateAppChangeset() {
  const changesetPath = path.resolve(__dirname, '../.changeset');
  const fileNames = await fs.readdir(changesetPath);
  const changesetNames = fileNames.filter(
    name => name.endsWith('.md') && name !== 'README.md',
  );

  const changesets = await Promise.all(
    changesetNames.map(async name => {
      const content = await fs.readFile(path.join(changesetPath, name), 'utf8');
      return { name, ...parseChangeset(content) };
    }),
  );

  const excludeList = [];
  const prePath = path.resolve(changesetPath, 'pre.json');
  if (await fs.pathExists(prePath)) {
    const data = await fs.readJSON(prePath);
    // Only exclude changesets in pre-release mode.
    if (data.mode === 'pre') {
      excludeList.push(...data.changesets.map(name => `${name}.md`));
    }
  }

  const hasCreateAppChanges = changesets
    .filter(({ name }) => !excludeList.includes(name))
    .some(changeset =>
      changeset.releases.some(
        release => release.name === '@backstage/create-app',
      ),
    );

  if (hasCreateAppChanges) {
    console.log(
      'Contains create-app changeset, no need to create additional changeset',
    );
    return;
  }
  const ts = Math.round(new Date().getTime() / 1000);
  const fileName = `create-app-${ts}.md`;
  console.log(`Creating ${fileName}`);
  const data = `---
'@backstage/create-app': patch
---\n
Bumped create-app version.\n`;
  await fs.writeFile(path.join(changesetPath, fileName), data);
}

async function main() {
  const repo = await getPackages(__dirname);
  const branchName = await getCurrentBranch(repo);
  const isMainBranch = MAIN_BRANCHES.includes(branchName);

  console.log(`Current branch: ${branchName}`);
  if (isMainBranch) {
    console.log('Main release, updating package versions');
    await updatePackageVersions(repo);
    await ensureCreateAppChangeset();
  }

  await updateBackstageReleaseVersion(repo, isMainBranch ? 'minor' : 'patch');
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});

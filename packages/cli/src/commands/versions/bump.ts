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

import fs from 'fs-extra';
import semver from 'semver';
import { resolve as resolvePath } from 'path';
import { run } from '../../lib/run';
import { paths } from '../../lib/paths';
import {
  mapDependencies,
  fetchPackageInfo,
  Lockfile,
} from '../../lib/versioning';
import { includedFilter, forbiddenDuplicatesFilter } from './lint';

const DEP_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

type PkgVersionInfo = {
  range: string;
  name: string;
  location: string;
};

export default async () => {
  const lockfilePath = paths.resolveTargetRoot('yarn.lock');
  const lockfile = await Lockfile.load(lockfilePath);

  const findTargetVersion = createVersionFinder();

  // First we discover all Backstage dependencies within our own repo
  const dependencyMap = await mapDependencies(paths.targetDir);

  // Next check with the package registry to see which dependency ranges we need to bump
  const versionBumps = new Map<string, PkgVersionInfo[]>();
  // Track package versions that we want to remove from yarn.lock in order to trigger a bump
  const unlocked = Array<{ name: string; range: string; target: string }>();
  await workerThreads(16, dependencyMap.entries(), async ([name, pkgs]) => {
    const target = await findTargetVersion(name);

    for (const pkg of pkgs) {
      if (semver.satisfies(target, pkg.range)) {
        if (semver.minVersion(pkg.range)?.version !== target) {
          unlocked.push({ name, range: pkg.range, target });
        }

        continue;
      }
      versionBumps.set(
        pkg.name,
        (versionBumps.get(pkg.name) ?? []).concat({
          name,
          location: pkg.location,
          range: `^${target}`, // TODO(Rugvip): Option to use something else than ^?
        }),
      );
    }
  });

  // Check for updates of transitive backstage dependencies
  await workerThreads(16, lockfile.keys(), async name => {
    // Only check @backstage packages and friends, we don't want this to do a full update of all deps
    if (!includedFilter(name)) {
      return;
    }

    const target = await findTargetVersion(name);

    for (const entry of lockfile.get(name) ?? []) {
      // Ignore lockfile entries that don't satisfy the version range, since
      // these can't cause the package to be locked to an older version
      if (!semver.satisfies(target, entry.range)) {
        continue;
      }
      // Unlock all entries that are within range but on the old version
      unlocked.push({ name, range: entry.range, target });
    }
  });

  console.log();

  // Write all discovered version bumps to package.json in this repo
  if (versionBumps.size === 0 && unlocked.length === 0) {
    console.log('All Backstage packages are up to date!');
  } else {
    console.log('Some packages are outdated, updating');
    console.log();

    if (unlocked.length > 0) {
      const removed = new Set<string>();
      for (const { name, range, target } of unlocked) {
        // Don't bother removing lockfile entries if they're already on the correct version
        const existingEntry = lockfile.get(name)?.find(e => e.range === range);
        if (existingEntry?.version === target) {
          continue;
        }
        const key = JSON.stringify({ name, range });
        if (!removed.has(key)) {
          removed.add(key);
          console.log(
            `Removing lockfile entry for ${name}@${range} to bump to ${target}`,
          );
          lockfile.remove(name, range);
        }
      }
      await lockfile.save();
    }

    await workerThreads(16, versionBumps.entries(), async ([name, deps]) => {
      const pkgPath = resolvePath(deps[0].location, 'package.json');
      const pkgJson = await fs.readJson(pkgPath);

      for (const dep of deps) {
        console.log(`Bumping ${dep.name} in ${name} to ${dep.range}`);

        for (const depType of DEP_TYPES) {
          if (depType in pkgJson && dep.name in pkgJson[depType]) {
            pkgJson[depType][dep.name] = dep.range;
          }
        }
      }

      await fs.writeJson(pkgPath, pkgJson, { spaces: 2 });
    });

    console.log();
    console.log("Running 'yarn install' to install new versions");
    console.log();
    await run('yarn', ['install']);
  }

  console.log();

  // Finally we make sure the new lockfile doesn't have any duplicates
  const dedupLockfile = await Lockfile.load(lockfilePath);
  const result = dedupLockfile.analyze({
    filter: includedFilter,
  });

  if (result.newVersions.length > 0) {
    throw new Error('Duplicate versions present after package bump');
  }

  const forbiddenNewRanges = result.newRanges.filter(({ name }) =>
    forbiddenDuplicatesFilter(name),
  );
  if (forbiddenNewRanges.length > 0) {
    throw new Error(
      `Version bump failed for ${forbiddenNewRanges
        .map(i => i.name)
        .join(', ')}`,
    );
  }
};

function createVersionFinder() {
  const found = new Map<string, string>();

  return async function findTargetVersion(name: string) {
    const existing = found.get(name);
    if (existing) {
      return existing;
    }

    console.log(`Checking for updates of ${name}`);
    const info = await fetchPackageInfo(name);
    const latest = info['dist-tags'].latest;
    if (!latest) {
      throw new Error(`No latest version found for ${name}`);
    }
    found.set(name, latest);
    return latest;
  };
}

async function workerThreads<T>(
  count: number,
  items: IterableIterator<T>,
  fn: (item: T) => Promise<void>,
) {
  const queue = Array.from(items);

  async function pop() {
    const item = queue.pop();
    if (!item) {
      return;
    }

    await fn(item);
    await pop();
  }

  return Promise.all(
    Array(count)
      .fill(0)
      .map(() => pop()),
  );
}

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

  // First we discover all Backstage dependencies within our own repo
  const dependencyMap = await mapDependencies(paths.targetDir);

  // Next check with the package registry to see which dependency ranges we need to bump
  const versionBumps = new Map<string, PkgVersionInfo[]>();
  // Track package versions that we want to remove from yarn.lock in order to trigger a bump
  const unlocked = Array<{ name: string; range: string; latest: string }>();
  await workerThreads(16, dependencyMap.entries(), async ([name, pkgs]) => {
    console.log(`Checking for updates of ${name}`);
    const info = await fetchPackageInfo(name);
    const latest = info['dist-tags'].latest;
    if (!latest) {
      throw new Error(`No latest version found for ${name}`);
    }

    for (const pkg of pkgs) {
      if (semver.satisfies(latest, pkg.range)) {
        if (semver.minVersion(pkg.range)?.version !== latest) {
          unlocked.push({ name, range: pkg.range, latest });
        }
        continue;
      }
      versionBumps.set(
        pkg.name,
        (versionBumps.get(pkg.name) ?? []).concat({
          name,
          location: pkg.location,
          range: `^${latest}`, // TODO(Rugvip): Option to use something else than ^?
        }),
      );
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
      const lockfile = await Lockfile.load(lockfilePath);
      for (const { name, range, latest } of unlocked) {
        // Don't bother removing lockfile entries if they're already on the correct version
        const existingEntry = lockfile.get(name)?.find(e => e.range === range);
        if (existingEntry?.version === latest) {
          continue;
        }
        console.log(
          `Removing lockfile entry for ${name}@${range} to bump to ${latest}`,
        );
        lockfile.remove(name, range);
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
  const lockfile = await Lockfile.load(lockfilePath);
  const result = lockfile.analyze({
    filter: includedFilter,
  });

  if (result.newVersions.length > 0) {
    console.log();
    console.log('Removing duplicate dependencies from yarn.lock');
    lockfile.replaceVersions(result.newVersions);
    await lockfile.save();

    console.log(
      "Running 'yarn install' to remove duplicates from node_modules",
    );
    console.log();
    await run('yarn', ['install']);

    console.log();
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

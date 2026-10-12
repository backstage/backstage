/*
 * Copyright 2026 The Backstage Authors
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

// @ts-check

const { execFileSync } = require('node:child_process');
const { depFields, getAddFlagForDepsField } = require('./importPolicies');

/**
 * Looks up the most common version range for a dependency if it already exists in the repo.
 * @param {string} name
 * @param {string} flag
 * @param {import('./getPackages').PackageMap} packages
 * @returns {string}
 */
function addVersionQuery(name, flag, packages) {
  const rangeCounts = new Map();

  for (const pkg of packages.list) {
    const deps =
      flag === '--dev'
        ? pkg.packageJson.devDependencies
        : flag === '--peer'
        ? pkg.packageJson.peerDependencies
        : pkg.packageJson.dependencies;
    const range = deps?.[name];
    if (range) {
      rangeCounts.set(range, (rangeCounts.get(range) ?? 0) + 1);
    }
  }

  const mostCommonRange = [...rangeCounts.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];
  return mostCommonRange ? `${name}@${mostCommonRange}` : name;
}

/**
 * Add missing package imports.
 * @param {Array<{name: string, flag: string}>} toAdd
 * @param {import('./getPackages').PackageMap} packages
 * @param {import('./getPackages').ExtendedPackage} localPkg
 */
function addMissingImports(toAdd, packages, localPkg) {
  /** @type Record<string, Set<string>> */
  const byFlag = {};

  for (const { name, flag } of toAdd) {
    byFlag[flag] ??= new Set();
    byFlag[flag].add(name);
  }

  for (const name of byFlag[''] ?? []) {
    byFlag['--dev']?.delete(name);
  }
  for (const name of byFlag['--peer'] ?? []) {
    byFlag['']?.delete(name);
    byFlag['--dev']?.delete(name);
  }

  for (const [flag, names] of Object.entries(byFlag)) {
    const namesWithQuery = [...names].map(name =>
      addVersionQuery(name, flag, packages),
    );

    // Crafted directives can request malicious packages, as can package.json itself.
    execFileSync('yarn', ['add', ...(flag ? [flag] : []), ...namesWithQuery], {
      cwd: localPkg.dir,
      stdio: 'inherit',
    });
  }
}

/**
 * Removes dependency entries pointing to inlined workspace packages.
 * @param {Array<{pkg: import('./getPackages').ExtendedPackage}>} toInline
 * @param {import('./getPackages').ExtendedPackage} localPkg
 */
function removeInlineImports(toInline, localPkg) {
  /** @type Set<string> */
  const toRemove = new Set();

  for (const { pkg } of toInline) {
    const name = pkg.packageJson.name;
    for (const depType of Object.values(depFields)) {
      if (localPkg.packageJson[depType]?.[name]) {
        toRemove.add(name);
      }
    }
  }
  if (toRemove.size > 0) {
    execFileSync('yarn', ['remove', ...toRemove], {
      cwd: localPkg.dir,
      stdio: 'inherit',
    });
  }
}

/**
 * Adds dependencies that are not properly forwarded from inline dependencies.
 * @param {Array<{pkg: import('./getPackages').ExtendedPackage}>} toInline
 * @param {import('./getPackages').ExtendedPackage} localPkg
 */
function addForwardedInlineImports(toInline, localPkg) {
  const declaredProdDeps = new Set([
    ...Object.keys(localPkg.packageJson.dependencies ?? {}),
    ...Object.keys(localPkg.packageJson.peerDependencies ?? {}),
    localPkg.packageJson.name,
  ]);
  /** @type {Map<string, Map<string, string>>} */
  const byFlagByName = new Map();

  for (const { pkg } of toInline) {
    for (const depType of /** @type {const} */ ([
      'dependencies',
      'peerDependencies',
    ])) {
      for (const [depName, depQuery] of Object.entries(
        pkg.packageJson[depType] ?? {},
      )) {
        if (!declaredProdDeps.has(depName)) {
          const flag = getAddFlagForDepsField(depType).trim();
          const byName = byFlagByName.get(flag);
          if (byName) {
            const query = byName.get(depName);
            if (query && query !== depQuery) {
              throw new Error(
                `Conflicting dependency queries for inlined package dep ${depName}, got ${query} and ${depQuery}`,
              );
            }
            byName.set(depName, depQuery);
          } else {
            byFlagByName.set(flag, new Map([[depName, depQuery]]));
          }
        }
      }
    }
  }

  for (const [flag, byName] of byFlagByName) {
    const namesWithQuery = [...byName.entries()].map(
      ([name, query]) => `${name}@${query}`,
    );
    execFileSync('yarn', ['add', ...(flag ? [flag] : []), ...namesWithQuery], {
      cwd: localPkg.dir,
      stdio: 'inherit',
    });
  }
}

module.exports = {
  addMissingImports,
  removeInlineImports,
  addForwardedInlineImports,
};

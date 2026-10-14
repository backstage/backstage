/*
 * Copyright 2025 The Backstage Authors
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

const path = require('node:path');
const manypkg = require('@manypkg/get-packages');

/**
 * @typedef ExtendedPackage
 * @type {import('@manypkg/get-packages').Package & { packageJson: { exports?: Record<string, string>, files?: Array<string>, backstage?: { inline?: boolean, role?: string, pluginId?: string } }}} packageJson
 */

/**
 * @typedef PackageMap
 * @type object
 *
 * @property {ExtendedPackage} root
 * @property {ExtendedPackage[]} list
 * @property {Map<string, ExtendedPackage>} map
 * @property {() => void} clearCache
 * @property {(path: string) => ExtendedPackage | undefined} byPath
 */

// Cache workspace metadata by the lookup directory so linting multiple workspaces in one process stays isolated.
module.exports = (function () {
  /** @type {Map<string, {result: PackageMap, loadedAt: number}>} */
  const cache = new Map();

  /** @returns {PackageMap | undefined} */
  return function getPackages(/** @type {string} */ dir) {
    const key = path.resolve(dir);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.loadedAt <= 5000) {
      return cached.result;
    }

    const packages = manypkg.getPackagesSync(dir);
    if (!packages?.rootPackage) {
      cache.delete(key);
      return undefined;
    }

    const byDir = new Map(packages.packages.map(pkg => [pkg.dir, pkg]));
    // Lookups are cached per directory, since byPath is called for every
    // linted file and often for every import within those files
    /** @type {Map<string, ExtendedPackage | undefined>} */
    const dirCache = new Map();

    /** @type {PackageMap} */
    const result = {
      map: new Map(packages.packages.map(pkg => [pkg.packageJson.name, pkg])),
      list: packages.packages,
      root: packages.rootPackage,
      byPath(filePath) {
        const resolved = path.resolve(filePath);
        // The path may point directly at a package directory
        const ownPkg = byDir.get(resolved);
        if (ownPkg) {
          return ownPkg;
        }
        const start = path.dirname(resolved);
        if (dirCache.has(start)) {
          return dirCache.get(start);
        }
        // Walk up towards the filesystem root to find the nearest package
        let pkg;
        for (let d = start; ; d = path.dirname(d)) {
          pkg = byDir.get(d);
          if (pkg || d === path.dirname(d)) {
            break;
          }
        }
        dirCache.set(start, pkg);
        return pkg;
      },
      clearCache() {
        cache.clear();
      },
    };
    cache.set(key, { result, loadedAt: Date.now() });
    return result;
  };
})();

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

    /** @type {PackageMap} */
    const result = {
      map: new Map(packages.packages.map(pkg => [pkg.packageJson.name, pkg])),
      list: packages.packages,
      root: packages.rootPackage,
      byPath(filePath) {
        return packages.packages.find(
          pkg => !path.relative(pkg.dir, filePath).startsWith('..'),
        );
      },
      clearCache() {
        cache.clear();
      },
    };
    cache.set(key, { result, loadedAt: Date.now() });
    return result;
  };
})();

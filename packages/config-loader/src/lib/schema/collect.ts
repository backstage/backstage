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
import {
  resolve as resolvePath,
  relative as relativePath,
  dirname,
} from 'path';
import { ConfigSchemaPackageEntry } from './types';

type Item = {
  name: string;
  parentPath?: string;
};

const req =
  typeof __non_webpack_require__ === 'undefined'
    ? require
    : __non_webpack_require__;

/**
 * This collects all known config schemas across all dependencies of the app.
 */
export async function collectConfigSchemas(
  packageNames: string[],
): Promise<ConfigSchemaPackageEntry[]> {
  const visitedPackages = new Set<string>();
  const schemas = Array<ConfigSchemaPackageEntry>();
  const currentDir = process.cwd();

  async function processItem({ name, parentPath }: Item) {
    // Ensures that we only process each package once. We don't bother with
    // loading in schemas from duplicates of different versions, as that's not
    // supported by Backstage right now anyway. We may want to change that in
    // the future though, if it for example becomes possible to load in two
    // different versions of e.g. @backstage/core at once.
    if (visitedPackages.has(name)) {
      return;
    }
    visitedPackages.add(name);

    const pkgPath = req.resolve(
      `${name}/package.json`,
      parentPath && {
        paths: [parentPath],
      },
    );

    const pkg = await fs.readJson(pkgPath);
    const depNames = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ];

    // TODO(Rugvip): Trying this out to avoid having to traverse the full dependency graph,
    //               since that's pretty slow. We probably need a better way to determine when
    //               we've left the Backstage ecosystem, but this will do for now.
    const hasSchema = 'configSchema' in pkg;
    const hasBackstageDep = depNames.some(_ => _.startsWith('@backstage/'));
    if (!hasSchema && !hasBackstageDep) {
      return;
    }
    if (hasSchema) {
      if (typeof pkg.configSchema === 'string') {
        if (!pkg.configSchema.endsWith('.json')) {
          throw new Error(
            `Config schema files must be .json, got ${pkg.configSchema}`,
          );
        }
        const value = await fs.readJson(
          resolvePath(dirname(pkgPath), pkg.configSchema),
        );
        schemas.push({
          value,
          path: relativePath(currentDir, pkgPath),
        });
      } else {
        schemas.push({
          value: pkg.configSchema,
          path: relativePath(currentDir, pkgPath),
        });
      }
    }

    await Promise.all(
      depNames.map(name => processItem({ name, parentPath: pkgPath })),
    );
  }

  await Promise.all(packageNames.map(name => processItem({ name })));

  return schemas;
}

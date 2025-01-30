/*
 * Copyright 2020 The Backstage Authors
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
import { EOL } from 'os';
import {
  resolve as resolvePath,
  relative as relativePath,
  dirname,
  sep,
} from 'path';
import { ConfigSchemaPackageEntry } from './types';
import { JsonObject } from '@backstage/types';
import { assertError } from '@backstage/errors';

type Item = {
  name?: string;
  parentPath?: string;
  packagePath?: string;
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
  packagePaths: string[],
): Promise<ConfigSchemaPackageEntry[]> {
  const schemas = new Array<ConfigSchemaPackageEntry>();
  const tsSchemaPaths = new Array<{ packageName: string; path: string }>();
  const visitedPackageVersions = new Map<string, Set<string>>(); // pkgName: [versions...]

  const currentDir = await fs.realpath(process.cwd());

  async function processItem(item: Item) {
    let pkgPath = item.packagePath;

    if (pkgPath) {
      const pkgExists = await fs.pathExists(pkgPath);
      if (!pkgExists) {
        return;
      }
    } else if (item.name) {
      const { name, parentPath } = item;

      try {
        pkgPath = req.resolve(
          `${name}/package.json`,
          parentPath && {
            paths: [parentPath],
          },
        );
      } catch {
        // We can somewhat safely ignore packages that don't export package.json,
        // as they are likely not part of the Backstage ecosystem anyway.
      }
    }
    if (!pkgPath) {
      return;
    }

    const pkg = await fs.readJson(pkgPath);

    // Ensures that we only process the same version of each package once.
    let versions = visitedPackageVersions.get(pkg.name);
    if (versions?.has(pkg.version)) {
      return;
    }
    if (!versions) {
      versions = new Set();
      visitedPackageVersions.set(pkg.name, versions);
    }
    versions.add(pkg.version);

    const depNames = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.optionalDependencies ?? {}),
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
        const isJson = pkg.configSchema.endsWith('.json');
        const isDts = pkg.configSchema.endsWith('.d.ts');
        if (!isJson && !isDts) {
          throw new Error(
            `Config schema files must be .json or .d.ts, got ${pkg.configSchema}`,
          );
        }
        if (isDts) {
          tsSchemaPaths.push({
            path: relativePath(
              currentDir,
              resolvePath(dirname(pkgPath), pkg.configSchema),
            ),
            packageName: pkg.name,
          });
        } else {
          const path = resolvePath(dirname(pkgPath), pkg.configSchema);
          const value = await fs.readJson(path);
          schemas.push({
            packageName: pkg.name,
            value,
            path: relativePath(currentDir, path),
          });
        }
      } else {
        schemas.push({
          packageName: pkg.name,
          value: pkg.configSchema,
          path: relativePath(currentDir, pkgPath),
        });
      }
    }

    await Promise.all(
      depNames.map(depName =>
        processItem({ name: depName, parentPath: pkgPath }),
      ),
    );
  }

  await Promise.all([
    ...packageNames.map(name => processItem({ name, parentPath: currentDir })),
    ...packagePaths.map(path => processItem({ name: path, packagePath: path })),
  ]);

  const tsSchemas = await compileTsSchemas(tsSchemaPaths);
  const allSchemas = schemas.concat(tsSchemas);

  const hasBackendDefaults = allSchemas.some(
    ({ packageName }) => packageName === '@backstage/backend-defaults',
  );

  if (hasBackendDefaults) {
    // We filter out backend-common schemas here to avoid issues with
    // schema merging over different versions of the same schema.
    // led to issues such as https://github.com/backstage/backstage/issues/28170
    return allSchemas.filter(
      ({ packageName }) => packageName !== '@backstage/backend-common',
    );
  }

  return allSchemas;
}

// This handles the support of TypeScript .d.ts config schema declarations.
// We collect all typescript schema definition and compile them all in one go.
// This is much faster than compiling them separately.
async function compileTsSchemas(
  entries: { path: string; packageName: string }[],
) {
  if (entries.length === 0) {
    return [];
  }

  // Lazy loaded, because this brings up all of TypeScript and we don't
  // want that eagerly loaded in tests
  const { getProgramFromFiles, buildGenerator } =
    require('typescript-json-schema') as typeof import('typescript-json-schema');

  const program = getProgramFromFiles(
    entries.map(({ path }) => path),
    {
      incremental: false,
      isolatedModules: true,
      lib: ['ES5'], // Skipping most libs speeds processing up a lot, we just need the primitive types anyway
      noEmit: true,
      noResolve: true,
      skipLibCheck: true, // Skipping lib checks speeds things up
      skipDefaultLibCheck: true,
      strict: true,
      typeRoots: [], // Do not include any additional types
      types: [],
    },
  );

  const tsSchemas = entries.map(({ path, packageName }) => {
    let value;
    try {
      const generator = buildGenerator(
        program,
        // This enables the use of these tags in TSDoc comments
        {
          required: true,
          validationKeywords: ['visibility', 'deepVisibility', 'deprecated'],
        },
        [path.split(sep).join('/')], // Unix paths are expected for all OSes here
      );

      // All schemas should export a `Config` symbol
      value = generator?.getSchemaForSymbol('Config') as JsonObject | null;

      // This makes sure that no additional symbols are defined in the schema. We don't allow
      // this because they share a global namespace and will be merged together, leading to
      // unpredictable behavior.
      const userSymbols = new Set(generator?.getUserSymbols());
      userSymbols.delete('Config');
      if (userSymbols.size !== 0) {
        const names = Array.from(userSymbols).join("', '");
        throw new Error(
          `Invalid configuration schema in ${path}, additional symbol definitions are not allowed, found '${names}'`,
        );
      }

      // This makes sure that no unsupported types are used in the schema, for example `Record<,>`.
      // The generator will extract these as a schema reference, which will in turn be broken for our usage.
      const reffedDefs = Object.keys(generator?.ReffedDefinitions ?? {});
      if (reffedDefs.length !== 0) {
        const lines = reffedDefs.join(`${EOL}  `);
        throw new Error(
          `Invalid configuration schema in ${path}, the following definitions are not supported:${EOL}${EOL}  ${lines}`,
        );
      }
    } catch (error) {
      assertError(error);
      if (error.message !== 'type Config not found') {
        throw error;
      }
    }

    if (!value) {
      throw new Error(`Invalid schema in ${path}, missing Config export`);
    }
    return { path, value, packageName };
  });

  return tsSchemas;
}

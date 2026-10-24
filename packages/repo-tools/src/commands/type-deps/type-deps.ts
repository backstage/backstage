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

import fs from 'node:fs';
import { resolve as resolvePath } from 'node:path';
// Cba polluting root package.json, we'll have this
// eslint-disable-next-line @backstage/no-undeclared-imports
import chalk from 'chalk';
import { getPackages, Package } from '@manypkg/get-packages';
import { getPackageExportDetails } from '../../lib/getPackageExportDetails';

type TypeDepsOptions = {
  allowEmpty?: boolean;
};

export default async (opts: TypeDepsOptions = {}) => {
  const { packages } = await getPackages(resolvePath('.'));

  let hadErrors = false;
  let checkedAny = false;
  const unbuilt: string[] = [];

  for (const pkg of packages) {
    if (!hasPublishedTypes(pkg)) {
      continue;
    }
    if (!fs.existsSync(resolvePath(pkg.dir, 'dist/index.d.ts'))) {
      unbuilt.push(pkg.packageJson.name);
      continue;
    }

    checkedAny = true;
    const { errors } = await checkTypes(pkg);
    if (errors.length) {
      hadErrors = true;
      console.error(
        `Incorrect type dependencies in ${chalk.yellow(pkg.packageJson.name)}:`,
      );
      for (const error of errors) {
        if (error.name === 'WrongDepError') {
          console.error(
            `  Move from ${chalk.red(error.from)} to ${chalk.green(
              error.to,
            )}: ${chalk.cyan(error.dep)}`,
          );
        } else if (error.name === 'MissingDepError') {
          console.error(
            `  Missing a type dependency: ${chalk.cyan(error.dep)}`,
          );
        } else {
          console.error(`  Unknown error, ${chalk.red(error)}`);
        }
      }
    }
  }

  if (unbuilt.length) {
    const shown = unbuilt.slice(0, 10).join(', ');
    const rest = unbuilt.length > 10 ? ` and ${unbuilt.length - 10} more` : '';
    console.error(
      `Skipped ${unbuilt.length} package(s) with no type declarations in dist: ${shown}${rest}`,
    );
  }

  if (hadErrors) {
    console.error();
    console.error(
      chalk.red('At least one package had incorrect type dependencies'),
    );

    process.exit(2);
  }

  if (!checkedAny && !opts.allowEmpty) {
    console.error();
    console.error(
      chalk.red(
        'No packages were checked for type dependencies. Build the packages first, or pass --allow-empty if there is nothing to check.',
      ),
    );

    process.exit(2);
  }
};

type PackageJsonWithTypes = {
  packageJson: {
    types?: string;
  };
};
function hasPublishedTypes(pkg: Package & PackageJsonWithTypes) {
  return !pkg.packageJson.private && !!pkg.packageJson.types;
}

/**
 * Read a declaration file and recursively follow all relative imports and
 * re-exports, collecting the source content of each file encountered.
 */
function collectDeclSources(entryPath: string): string[] {
  const visited = new Set<string>();
  const sources: string[] = [];

  function visit(filePath: string) {
    const resolved = resolvePath(filePath);
    if (visited.has(resolved)) {
      return;
    }
    visited.add(resolved);

    // Handle .js -> .d.ts extension mapping used by declaration chunk files
    let actualPath = resolved;
    if (!fs.existsSync(actualPath)) {
      actualPath = resolved.replace(/\.js$/, '.d.ts');
    }
    if (!fs.existsSync(actualPath)) {
      return;
    }

    const src = fs.readFileSync(actualPath, 'utf8');
    sources.push(src);

    // Follow relative imports and re-exports into chunk files
    const relativeRefs = (
      src.match(/^(?:import|export) .* from '\..*';$/gm) || []
    )
      .map(match => match.match(/from '(.*)'/)?.[1] ?? '')
      .filter(n => n.startsWith('.'));

    const dir = resolvePath(actualPath, '..');
    for (const ref of relativeRefs) {
      visit(resolvePath(dir, ref));
    }
  }

  visit(entryPath);
  return sources;
}

function findAllDeps(declSrc: string) {
  const importedDeps = (declSrc.match(/^import .* from '.*';$/gm) || [])
    .map(match => match.match(/from '(.*)'/)?.[1] ?? '')
    .filter(n => !n.startsWith('.'));
  const referencedDeps = (
    declSrc.match(/^\/\/\/ <reference types=".*" \/>$/gm) || []
  )
    .map(match => match.match(/types="(.*)"/)?.[1] ?? '')
    .filter(n => !n.startsWith('.'))
    // We allow references to these without an explicit dependency.
    .filter(n => !['node', 'react'].includes(n));

  // Detect ambient global type namespaces (e.g. jest.Mocked, jest.MockInstance)
  // that are used in type positions but don't appear as explicit imports.
  // Strip comments first to avoid false positives from JSDoc examples.
  const strippedSrc = declSrc
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
  const ambientDeps: string[] = [];
  if (/\bjest\.\w/.test(strippedSrc)) {
    ambientDeps.push('jest');
  }

  return Array.from(
    new Set([...importedDeps, ...referencedDeps, ...ambientDeps]),
  );
}

/**
 * Scan index.d.ts for imports and return errors for any dependency that's
 * missing or incorrect in package.json
 */
function checkTypes(pkg: Package) {
  const allDeps = getPackageExportDetails(pkg.packageJson).flatMap(exp => {
    const entryPath = resolvePath(pkg.dir, 'dist', exp.distPath);
    return collectDeclSources(entryPath).flatMap(src => findAllDeps(src));
  });
  const deps = Array.from(new Set(allDeps));

  const errors = [];
  const typeDeps = [];
  for (let dep of deps) {
    if (dep.endsWith('/*')) {
      dep = dep.slice(0, -2);
    }
    try {
      const typeDep = findTypesPackage(dep, pkg);
      if (typeDep) {
        typeDeps.push(typeDep);
      }
    } catch (error) {
      errors.push(error);
    }
  }

  errors.push(...findTypeDepErrors(typeDeps, pkg));

  return { errors };
}

/**
 * Find the package used for types. This assumes that types are working is a package
 * can be resolved, it doesn't do any checking of presence of types inside the dep.
 */
function findTypesPackage(dep: string, pkg: Package) {
  try {
    require.resolve(`@types/${dep}/package.json`, { paths: [pkg.dir] });
    return `@types/${dep}`;
  } catch {
    try {
      require.resolve(dep, { paths: [pkg.dir] });
      return undefined;
    } catch {
      try {
        // Some type-only modules don't have a working main field, so try resolving package.json too
        require.resolve(`${dep}/package.json`, { paths: [pkg.dir] });
        return undefined;
      } catch {
        try {
          // Check if it's just a .d.ts file
          require.resolve(`${dep}.d.ts`, { paths: [pkg.dir] });
          return undefined;
        } catch {
          // And finally a naive lookup of the file directly, in case `require.resolve` fails us due to "exports"
          if (fs.existsSync(resolvePath(pkg.dir, `node_modules/${dep}.d.ts`))) {
            return undefined;
          }
          if (
            fs.existsSync(
              resolvePath(pkg.dir, `../../node_modules/${dep}.d.ts`),
            )
          ) {
            return undefined;
          }
          throw mkErr('MissingDepError', `No types for ${dep}`, { dep });
        }
      }
    }
  }
}

/**
 * Figures out what type dependencies are missing, or should be moved between dep types
 */
function findTypeDepErrors(typeDeps: string[], pkg: Package) {
  const devDeps = mkTypeDepSet(pkg.packageJson.devDependencies);
  const deps = mkTypeDepSet({
    ...pkg.packageJson.dependencies,
    ...pkg.packageJson.peerDependencies,
  });

  const errors = [];
  for (const typeDep of typeDeps) {
    if (!deps.has(typeDep)) {
      if (devDeps.has(typeDep)) {
        errors.push(
          mkErr('WrongDepError', `Should be dep ${typeDep}`, {
            dep: typeDep,
            from: 'devDependencies',
            to: 'dependencies',
          }),
        );
      } else {
        errors.push(
          mkErr('MissingDepError', `No types for ${typeDep}`, {
            dep: typeDep,
          }),
        );
      }
    } else {
      deps.delete(typeDep);
    }
  }

  for (const dep of deps) {
    // Allow implicit declarations of these dependencies. For some packages, they may
    //  not be declared as a `reference types="..."` or `import ... from '@types/...'
    //  in the declaration file.
    // Example being app-visualizer, it exports a plugin which comes from `@backstage/frontend-plugin-api`,
    //  the react types come from that package, but are not explicitly declared in the declaration file.
    if (['@types/react'].includes(dep)) {
      continue;
    }
    errors.push(
      mkErr('WrongDepError', `Should be dev dep ${dep}`, {
        dep,
        from: 'dependencies',
        to: 'devDependencies',
      }),
    );
  }

  return errors;
}

function mkTypeDepSet(deps: Record<string, string> | undefined) {
  const typeDeps = Object.keys(deps || {}).filter(n => n.startsWith('@types/'));
  return new Set(typeDeps);
}

function mkErr(name: string, msg: string, extra: Record<string, string>) {
  const error = new Error(msg);
  error.name = name;
  Object.assign(error, extra);
  return error;
}

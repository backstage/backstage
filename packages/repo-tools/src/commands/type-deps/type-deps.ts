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

import fs from 'fs';
import { resolve as resolvePath } from 'path';
// Cba polluting root package.json, we'll have this
// eslint-disable-next-line @backstage/no-undeclared-imports
import chalk from 'chalk';
import { getPackages, Package } from '@manypkg/get-packages';
import { getPackageExportNames } from '../../lib/entryPoints';

export default async () => {
  const { packages } = await getPackages(resolvePath('.'));

  let hadErrors = false;

  for (const pkg of packages) {
    if (!shouldCheckTypes(pkg)) {
      continue;
    }
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

  if (hadErrors) {
    console.error();
    console.error(
      chalk.red('At least one package had incorrect type dependencies'),
    );

    process.exit(2);
  }
};

type PackageJsonWithTypes = {
  packageJson: {
    types?: string;
  };
};
function shouldCheckTypes(pkg: Package & PackageJsonWithTypes) {
  return (
    !pkg.packageJson.private &&
    pkg.packageJson.types &&
    fs.existsSync(resolvePath(pkg.dir, 'dist/index.d.ts'))
  );
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
  return Array.from(new Set([...importedDeps, ...referencedDeps]));
}

/**
 * Scan index.d.ts for imports and return errors for any dependency that's
 * missing or incorrect in package.json
 */
function checkTypes(pkg: Package) {
  const entryPointNames = getPackageExportNames(pkg.packageJson) ?? ['index'];

  const allDeps = entryPointNames.flatMap(name => {
    const typeDecl = fs.readFileSync(
      resolvePath(pkg.dir, `dist/${name}.d.ts`),
      'utf8',
    );
    return findAllDeps(typeDecl);
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

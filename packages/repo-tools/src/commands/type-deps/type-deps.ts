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
import { createRequire } from 'node:module';
import {
  isAbsolute,
  relative as relativePath,
  resolve as resolvePath,
  sep,
} from 'node:path';
// Cba polluting root package.json, we'll have this
// eslint-disable-next-line @backstage/no-undeclared-imports
import chalk from 'chalk';
import { getPackages, Package } from '@manypkg/get-packages';
import { getPackageExportDetails } from '../../lib/getPackageExportDetails';
import * as ts from 'typescript';

export default async () => {
  const { packages, root } = await getPackages(resolvePath('.'));

  let hadErrors = false;
  let checkedCount = 0;

  for (const pkg of packages) {
    if (!shouldCheckTypes(pkg)) {
      continue;
    }
    checkedCount += 1;
    const { errors } = await checkTypes(pkg, root.dir);
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

  if (checkedCount === 0) {
    console.error(
      chalk.red(
        'No packages with built type declarations were found, make sure to build all packages before checking type dependencies',
      ),
    );

    process.exit(1);
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

const moduleResolutionOptions = {
  moduleResolution: ts.ModuleResolutionKind.Bundler,
};
function shouldCheckTypes(pkg: Package & PackageJsonWithTypes) {
  return (
    !pkg.packageJson.private &&
    pkg.packageJson.types &&
    fs.existsSync(resolvePath(pkg.dir, 'dist/index.d.ts'))
  );
}

/**
 * Read a declaration file and recursively follow all relative imports and
 * re-exports, collecting the external module specifiers referenced by each
 * file encountered.
 */
function collectDeclDeps(entryPath: string): string[] {
  const visited = new Set<string>();
  const deps: string[] = [];

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
    const specifiers = parseModuleSpecifiers(actualPath, src);
    deps.push(...findAllDeps(src, specifiers));

    // Follow relative imports and re-exports into chunk files, letting
    // TypeScript resolve the .js/.cjs/.mjs and directory forms to their
    // declaration files
    for (const ref of specifiers) {
      if (!ref.startsWith('.')) {
        continue;
      }
      const resolution = ts.resolveModuleName(
        ref,
        actualPath,
        moduleResolutionOptions,
        ts.sys,
      );
      visit(
        resolution.resolvedModule?.resolvedFileName ??
          resolvePath(actualPath, '..', ref),
      );
    }
  }

  visit(entryPath);
  return deps;
}

/**
 * Parse a declaration file and return every module specifier it references:
 * imports, re-exports, `import()` types, `import = require()` declarations,
 * and ambient module declarations.
 */
function parseModuleSpecifiers(filePath: string, src: string): string[] {
  const sourceFile = ts.createSourceFile(
    filePath,
    src,
    ts.ScriptTarget.Latest,
    true,
  );
  const specifiers: string[] = [];

  const visit = (node: ts.Node): void => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text);
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference) &&
      ts.isStringLiteral(node.moduleReference.expression)
    ) {
      specifiers.push(node.moduleReference.expression.text);
    } else if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteral(node.argument.literal)
    ) {
      specifiers.push(node.argument.literal.text);
    } else if (ts.isModuleDeclaration(node) && ts.isStringLiteral(node.name)) {
      specifiers.push(node.name.text);
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return specifiers;
}

function findAllDeps(declSrc: string, specifiers: string[]) {
  const importedDeps = specifiers.filter(n => !n.startsWith('.'));
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
function checkTypes(pkg: Package, root: string) {
  const allDeps = getPackageExportDetails(pkg.packageJson).flatMap(exp => {
    const entryPath = resolvePath(pkg.dir, 'dist', exp.distPath);
    return collectDeclDeps(entryPath);
  });
  const deps = Array.from(new Set(allDeps));

  const errors = [];
  const typeDeps = [];
  for (let dep of deps) {
    if (dep.endsWith('/*')) {
      dep = dep.slice(0, -2);
    }
    try {
      const typeDep = findTypesPackage(dep, pkg, root);
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
 * Find the package used for types. This assumes that types are working if a
 * package can be resolved. For specifiers that `require.resolve` cannot see,
 * e.g. ESM-only packages, TypeScript itself is asked to resolve the types as
 * a last resort before the dependency is reported as missing.
 */
function findTypesPackage(dep: string, pkg: Package, root: string) {
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
          // And finally, ask TypeScript itself whether it finds type
          // declarations for the specifier, in case `require.resolve` fails
          // us due to "exports": ESM-only packages may expose no "require"
          // or "default" export condition, so require.resolve fails even
          // though the dependency is installed and its types work. This
          // applies the same exports, typesVersions and types condition
          // rules that a build of the package would. The resolved file must
          // be declarations rather than plain JavaScript, and must be inside
          // the repo root, so that packages installed outside the repo
          // can't mask a missing dependency.
          const resolution = ts.resolveModuleName(
            dep,
            resolvePath(pkg.dir, 'index.d.ts'),
            moduleResolutionOptions,
            ts.sys,
          );
          const resolvedFile = resolution.resolvedModule?.resolvedFileName;
          const realRoot = fs.realpathSync(root);
          const relFile = resolvedFile
            ? relativePath(realRoot, resolvedFile)
            : '..';
          if (
            resolvedFile &&
            /\.(d\.)?[cm]?ts$/.test(resolvedFile) &&
            !relFile.startsWith('..') &&
            !isAbsolute(relFile)
          ) {
            return undefined;
          }
          // Some type-only modules ship a bare .d.ts file next to the
          // specifier path, which the exports gate can also hide. Search the
          // node_modules directories that Node itself would search for the
          // package, limited to the repo root.
          const segments = dep.split('/');
          const packageName = segments[0].startsWith('@')
            ? segments.slice(0, 2).join('/')
            : segments[0];
          const searchPaths =
            createRequire(resolvePath(pkg.dir, 'package.json')).resolve.paths(
              packageName,
            ) || [];
          for (const searchDir of searchPaths) {
            if (!fs.existsSync(searchDir)) {
              continue;
            }
            const relDir = relativePath(realRoot, fs.realpathSync(searchDir));
            if (
              relDir === '..' ||
              relDir.startsWith(`..${sep}`) ||
              isAbsolute(relDir)
            ) {
              continue;
            }
            if (fs.existsSync(resolvePath(searchDir, `${dep}.d.ts`))) {
              return undefined;
            }
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

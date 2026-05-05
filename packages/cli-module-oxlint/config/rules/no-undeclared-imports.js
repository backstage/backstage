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
const getPackages = require('../lib/getPackages');
const visitImports = require('../lib/visitImports');
const { resolveCwd, resolveFilePath } = require('../lib/resolveContext');

const depFields = /** @type {const} */ ({
  dep: 'dependencies',
  dev: 'devDependencies',
  peer: 'peerDependencies',
});

/**
 * Checks whether a module path corresponds to a dev-only file (test, story,
 * mock, or anything outside `src/`). Replaces the original minimatch-based
 * `devModulePatterns` with simple string checks for clarity and performance.
 *
 * @param {string} modulePath - File path relative to the package root.
 * @returns {boolean}
 */
function isDevModulePath(modulePath) {
  const normalized = modulePath.replace(/\\/g, '/');

  // Anything outside src/ is considered dev
  if (!normalized.startsWith('src/')) {
    return true;
  }

  const parts = normalized.split('/');
  const filename = parts[parts.length - 1];

  if (filename.includes('.test.') || filename.includes('.stories.')) {
    return true;
  }
  if (parts.includes('__testUtils__') || parts.includes('__mocks__')) {
    return true;
  }
  if (filename.startsWith('setupTests.')) {
    return true;
  }

  return false;
}

/**
 * Determines the expected dependency type for an import based on the
 * package's `backstage.role` and the file location.
 *
 * @param {any} localPkg - The package.json contents of the importing package.
 * @param {string} impPath - The imported package name.
 * @param {string} modulePath - File path relative to the package root.
 * @returns {'dep' | 'dev' | 'peer'}
 */
function getExpectedDepType(localPkg, impPath, modulePath) {
  const role = localPkg?.backstage?.role;

  // Some package roles have known dependency types
  switch (role) {
    case 'common-library':
    case 'web-library':
    case 'frontend-plugin':
    case 'frontend-plugin-module':
    case 'node-library':
    case 'backend-plugin':
    case 'backend-plugin-module':
      switch (impPath) {
        case 'react':
        case 'react-dom':
        case 'react-router':
        case 'react-router-dom':
          return 'peer';
      }
      break;
    case 'cli':
    case 'frontend':
    case 'backend':
    default:
      break;
  }

  if (isDevModulePath(modulePath)) {
    return 'dev';
  }
  return 'dep';
}

/**
 * Checks whether a dependency is declared in the expected dependency field.
 *
 * @param {import('@manypkg/get-packages').Package['packageJson']} pkg
 * @param {string} name
 * @param {ReturnType<typeof getExpectedDepType>} expectedType
 * @returns {{oldDepsField?: string, depsField: string} | undefined}
 */
function findConflict(pkg, name, expectedType) {
  const isDep = pkg.dependencies?.[name];
  const isDevDep = pkg.devDependencies?.[name];
  const isPeerDep = pkg.peerDependencies?.[name];
  const depsField = depFields[expectedType];

  if (expectedType === 'dep' && !isDep && !isPeerDep) {
    const oldDepsField = isDevDep ? depFields.dev : undefined;
    return { oldDepsField, depsField };
  } else if (expectedType === 'dev' && !isDevDep && !isDep && !isPeerDep) {
    return { oldDepsField: undefined, depsField };
  } else if (expectedType === 'peer' && !isPeerDep) {
    const oldDepsField = isDep
      ? depFields.dep
      : isDevDep
      ? depFields.dev
      : undefined;

    return { oldDepsField, depsField };
  }
  return undefined;
}

/**
 * Returns the `yarn add` flag for a dependency field.
 *
 * @param {string} depsField
 * @returns {string}
 */
function getAddFlagForDepsField(depsField) {
  switch (depsField) {
    case depFields.dep:
      return '';
    case depFields.dev:
      return ' --dev';
    case depFields.peer:
      return ' --peer';
    default:
      return '';
  }
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      undeclared:
        "{{ packageName }} must be declared in {{ depsField }} of {{ packageJsonPath }}, run 'yarn --cwd {{ packagePath }} add{{ addFlag }} {{ packageName }}' from the project root.",
      switch:
        '{{ packageName }} is declared in {{ oldDepsField }}, but should be moved to {{ depsField }} in {{ packageJsonPath }}.',
      inlineDirect:
        'The dependency on the inline package {{ packageName }} must not be declared in package dependencies.',
      inlineMissing:
        'Each production dependency from the inline package {{ packageName }} must be re-declared by this package, the following dependencies are missing: {{ missingDeps }}',
    },
    docs: {
      description:
        'Forbid imports of external packages that have not been declared in the appropriate dependencies field in `package.json`.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/cli-module-oxlint/docs/rules/no-undeclared-imports.md',
    },
  },
  createOnce(context) {
    let packages;
    let filePath;
    let localPkg;

    return {
      before() {
        packages = getPackages(resolveCwd(context));
        filePath = resolveFilePath(context);
        localPkg = packages?.byPath(filePath);
      },
      ...visitImports(context, (node, imp) => {
        if (!packages || !localPkg) {
          return;
        }

        // Skip type imports, builtins, local imports, and directives
        if (
          imp.kind === 'type' ||
          imp.type === 'builtin' ||
          imp.type === 'local' ||
          imp.type === 'directive'
        ) {
          return;
        }

        // Handle imports of inline packages
        if (
          imp.type === 'internal' &&
          imp.package.packageJson.backstage?.inline
        ) {
          for (const depType of Object.values(depFields)) {
            if (localPkg.packageJson[depType]?.[imp.packageName]) {
              context.report({
                node,
                messageId: 'inlineDirect',
                data: {
                  packageName: imp.packageName,
                },
              });
              return;
            }
          }

          const missingDeps = [];
          const declaredProdDeps = new Set([
            ...Object.keys(localPkg.packageJson.dependencies ?? {}),
            ...Object.keys(localPkg.packageJson.peerDependencies ?? {}),
            localPkg.packageJson.name, // include self
          ]);
          for (const depType of /** @type {const} */ ([
            'dependencies',
            'peerDependencies',
          ])) {
            for (const depName of Object.keys(
              imp.package.packageJson[depType] ?? {},
            )) {
              if (!declaredProdDeps.has(depName)) {
                missingDeps.push(depName);
              }
            }
          }

          if (missingDeps.length > 0) {
            context.report({
              node,
              messageId: 'inlineMissing',
              data: {
                packageName: imp.packageName,
                missingDeps: missingDeps.join(', '),
              },
            });
          }

          return;
        }

        // Skip self-imports
        if (imp.packageName === localPkg.packageJson.name) {
          return;
        }

        const modulePath = path.relative(localPkg.dir, filePath);
        const expectedType = getExpectedDepType(
          localPkg.packageJson,
          imp.packageName,
          modulePath,
        );

        const conflict = findConflict(
          localPkg.packageJson,
          imp.packageName,
          expectedType,
        );

        if (conflict) {
          try {
            const fullImport = imp.path
              ? `${imp.packageName}/${imp.path}`
              : imp.packageName;
            require.resolve(fullImport, {
              paths: [localPkg.dir],
            });
          } catch {
            // If the dependency doesn't resolve then it's likely a type import, ignore
            return;
          }

          const packagePath = path.relative(packages.root.dir, localPkg.dir);
          const packageJsonPath = path.join(packagePath, 'package.json');

          context.report({
            node,
            messageId: conflict.oldDepsField ? 'switch' : 'undeclared',
            data: {
              ...conflict,
              packagePath,
              addFlag: getAddFlagForDepsField(conflict.depsField),
              packageName: imp.packageName,
              packageJsonPath,
            },
          });
        }
      }),
    };
  },
};

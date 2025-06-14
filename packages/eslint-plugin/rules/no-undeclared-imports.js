/*
 * Copyright 2023 The Backstage Authors
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

const path = require('path');
const getPackageMap = require('../lib/getPackages');
const visitImports = require('../lib/visitImports');
const minimatch = require('minimatch');
const { execFileSync } = require('child_process');

const depFields = /** @type {const} */ ({
  dep: 'dependencies',
  dev: 'devDependencies',
  peer: 'peerDependencies',
});

const devModulePatterns = [
  new minimatch.Minimatch('!src/**'),
  new minimatch.Minimatch('src/**/*.test.*'),
  new minimatch.Minimatch('src/**/*.stories.*'),
  new minimatch.Minimatch('src/**/__testUtils__/**'),
  new minimatch.Minimatch('src/**/__mocks__/**'),
  new minimatch.Minimatch('src/setupTests.*'),
];

function getExpectedDepType(
  /** @type {any} */ localPkg,
  /** @type {string} */ impPath,
  /** @type {string} */ modulePath,
) {
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

  for (const pattern of devModulePatterns) {
    if (pattern.match(modulePath)) {
      return 'dev';
    }
  }
  return 'dep';
}

/**
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
 * @param {string} depsField
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

/**
 * Looks up the most common version range for a dependency if it already exists in the repo.
 *
 * @param {string} name
 * @param {string} flag
 * @param {getPackageMap.PackageMap} packages
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
  if (!mostCommonRange) {
    return name;
  }
  return `${name}@${mostCommonRange}`;
}

/**
 * Add missing package imports
 * @param {Array<{name: string, flag: string, node: import('estree').Node}>} toAdd
 * @param {import('../lib/getPackages').PackageMap} packages
 * @param {import('../lib/getPackages').ExtendedPackage} localPkg
 */
function addMissingImports(toAdd, packages, localPkg) {
  /** @type Record<string, Set<string>> */
  const byFlag = {};

  for (const { name, flag } of toAdd) {
    byFlag[flag] = byFlag[flag] ?? new Set();
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
    // Look up existing version queries in the repo for the same dependency
    const namesWithQuery = [...names].map(name =>
      addVersionQuery(name, flag, packages),
    );

    // The security implication of this is a bit interesting, as crafted add-import
    // directives could be used to install malicious packages. However, the same is true
    // for adding malicious packages to package.json, so there's no significant difference.
    execFileSync('yarn', ['add', ...(flag ? [flag] : []), ...namesWithQuery], {
      cwd: localPkg.dir,
      stdio: 'inherit',
    });
  }
}

/**
 * Removes dependency entries pointing to inlined workspace packages.
 * @param {Array<{pkg: import('../lib/getPackages').ExtendedPackage, node: import('estree').Node}>} toInline
 * @param {import('../lib/getPackages').ExtendedPackage} localPkg
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
 * @param {Array<{pkg: import('../lib/getPackages').ExtendedPackage, node: import('estree').Node}>} toInline
 * @param {import('../lib/getPackages').ExtendedPackage} localPkg
 */
function addForwardedInlineImports(toInline, localPkg) {
  const declaredProdDeps = new Set([
    ...Object.keys(localPkg.packageJson.dependencies ?? {}),
    ...Object.keys(localPkg.packageJson.peerDependencies ?? {}),
    localPkg.packageJson.name, // include self
  ]);

  /** @type Map<string, Map<string, string>> */
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
          const flag = getAddFlagForDepsField(depType);
          const byName = byFlagByName.get(flag);
          if (byName) {
            const query = byName.get(depName);
            if (query && query !== depQuery) {
              throw new Error(
                `Conflicting dependency queries for inlined package dep ${depName}, got ${query} and ${depQuery}`,
              );
            } else {
              byName.set(depName, depQuery);
            }
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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    messages: {
      undeclared:
        "{{ packageName }} must be declared in {{ depsField }} of {{ packageJsonPath }}, run 'yarn --cwd {{ packagePath }} add{{ addFlag }} {{ packageName }}' from the project root.",
      switch:
        '{{ packageName }} is declared in {{ oldDepsField }}, but should be moved to {{ depsField }} in {{ packageJsonPath }}.',
      switchBack: 'Switch back to import declaration',
      inlineDirect: `The dependency on the inline package {{ packageName }} must not be declared in package dependencies.`,
      inlineMissing: `Each production dependency from the inline package {{ packageName }} must be re-declared by this package, the following dependencies are missing: {{ missingDeps }}`,
    },
    docs: {
      description:
        'Forbid imports of external packages that have not been declared in the appropriate dependencies field in `package.json`.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-undeclared-imports.md',
    },
  },
  create(context) {
    const packages = getPackageMap(context.getCwd());
    if (!packages) {
      return {};
    }
    const filePath = context.getPhysicalFilename
      ? context.getPhysicalFilename()
      : context.getFilename();

    const localPkg = packages.byPath(filePath);
    if (!localPkg) {
      return {};
    }

    /** @type Array<{name: string, flag: string, node: import('estree').Node}> */
    const importsToAdd = [];

    /** @type Array<{pkg: import('../lib/getPackages').ExtendedPackage, node: import('estree').Node}> */
    const importsToInline = [];

    return {
      // All missing imports that we detect are collected as we traverse, and then we use
      // the program exit to execute all install directives that have been found.
      ['Program:exit']() {
        if (importsToAdd.length > 0) {
          addMissingImports(importsToAdd, packages, localPkg);

          packages.clearCache();
          // This switches all import directives back to the original import.
          for (const added of importsToAdd) {
            context.report({
              node: added.node,
              messageId: 'switchBack',
              fix(fixer) {
                return fixer.replaceText(added.node, `'${added.name}'`);
              },
            });
          }
          importsToAdd.length = 0;
        }

        if (importsToInline.length > 0) {
          removeInlineImports(importsToInline, localPkg);
          addForwardedInlineImports(importsToInline, localPkg);

          packages.clearCache();
          for (const inlined of importsToInline) {
            context.report({
              node: inlined.node,
              messageId: 'switchBack',
              fix(fixer) {
                return fixer.replaceText(
                  inlined.node,
                  `'${inlined.pkg.packageJson.name}'`,
                );
              },
            });
          }
          importsToInline.length = 0;
        }
      },
      ...visitImports(context, (node, imp) => {
        // We leave checking of type imports to the repo-tools check,
        // and we skip builtins and local imports
        if (
          imp.kind === 'type' ||
          imp.type === 'builtin' ||
          imp.type === 'local'
        ) {
          return;
        }

        // Any import directive that is found is collected for processing later
        if (imp.type === 'directive') {
          const [, directive, ...args] = imp.path.split(':');

          if (directive === 'add-import') {
            const [type, name] = args;
            if (!name.match(/^(@[-\w\.~]+\/)?[-\w\.~]*$/i)) {
              throw new Error(
                `Invalid package name to add as dependency: '${name}'`,
              );
            }

            importsToAdd.push({
              flag: getAddFlagForDepsField(type).trim(),
              name,
              node: imp.node,
            });
          }

          if (directive === 'inline-imports') {
            const [name] = args;
            const pkg = packages.map.get(name);
            if (!pkg) {
              throw new Error(`Unexpectedly missing inline package: ${name}`);
            }

            importsToInline.push({
              pkg: pkg,
              node: imp.node,
            });
          }

          return;
        }

        // Importing an internal inlined package, whose imports are inlined too
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
                fix: fixer => {
                  return fixer.replaceText(
                    imp.node,
                    `'directive:inline-imports:${imp.packageName}'`,
                  );
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
              fix: fixer => {
                return fixer.replaceText(
                  imp.node,
                  `'directive:inline-imports:${imp.packageName}'`,
                );
              },
            });
          }

          return;
        }

        // We skip imports for the package itself
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
              packageJsonPath: packageJsonPath,
            },
            // This fix callback is always executed, regardless of whether linting is run with
            // fixes enabled or not. There is no way to determine if fixes are being applied, so
            // instead our fix will replace the import with a directive that will be picked up
            // on the next run. When ESLint applies fixes all rules are re-run to make sure the fixes
            // applied correctly, which means that these directives will be picked up, executed,
            // and switched back to the original import immediately.
            // This is not true for all editor integrations. For example, VSCode translates there fixes
            // to native editor commands, and does not re-run ESLint. This means that the import directive
            // will end up in source code, and the import directive fix needs to be applied manually too.
            // There is to my knowledge no way around this that doesn't get very hacky, so it will do for now.
            fix: conflict.oldDepsField
              ? undefined
              : fixer => {
                  return fixer.replaceText(
                    imp.node,
                    `'directive:add-import:${conflict.depsField}:${imp.packageName}'`,
                  );
                },
          });
        }
      }),
    };
  },
};

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

/// <reference types="node" />
// @ts-check

const path = require('node:path');
const getPackages = require('../lib/getPackages');
const visitImports = require('../lib/visitImports');
const {
  depFields,
  getExpectedDepType,
  findDependencyConflict: findConflict,
  getAddFlagForDepsField,
} = require('../lib/importPolicies');
const {
  addMissingImports,
  removeInlineImports,
  addForwardedInlineImports,
} = require('../lib/importActions');

/** @type {Parameters<import('oxlint/plugins-dev').RuleTester['run']>[1]} */
module.exports = {
  meta: {
    type: 'problem',
    // Existing directives are restorable; ordinary dependency findings aren't fixable.
    fixable: 'code',
    messages: {
      switchBack: 'Switch back to import declaration',
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
    /** @type {ReturnType<typeof getPackages>} */
    let packages;
    let filePath = '';
    /** @type {import('../lib/getPackages.js').ExtendedPackage | undefined} */
    let localPkg;
    /** @type {Array<{name: string, flag: string, node: NonNullable<Parameters<typeof context.report>[0]['node']>}>} */
    let importsToAdd = [];
    /** @type {Array<{pkg: import('../lib/getPackages.js').ExtendedPackage, node: NonNullable<Parameters<typeof context.report>[0]['node']>}>} */
    let importsToInline = [];

    return {
      before() {
        packages = getPackages(context.cwd);
        filePath = context.physicalFilename;
        localPkg = packages?.byPath(filePath);
        importsToAdd = [];
        importsToInline = [];
      },
      'Program:exit'() {
        if (!packages || !localPkg) {
          return;
        }

        if (importsToAdd.length > 0) {
          addMissingImports(importsToAdd, packages, localPkg);
          packages.clearCache();
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
        if (!packages || !localPkg) {
          return;
        }

        if (
          imp.kind === 'type' ||
          imp.type === 'builtin' ||
          imp.type === 'local'
        ) {
          return;
        }

        if (imp.type === 'directive') {
          const [, directive, ...args] = imp.path.split(':');
          if (directive === 'add-import') {
            const [type, name] = args;
            if (!name.match(/^(@[-\w.~]+\/)?[-\w.~]*$/i)) {
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
            importsToInline.push({ pkg, node: imp.node });
          }
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

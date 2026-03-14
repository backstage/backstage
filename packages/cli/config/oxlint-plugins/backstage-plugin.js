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

const { builtinModules } = require('node:module');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const manypkg = require('@manypkg/get-packages');
const { Minimatch } = require('minimatch');

// ─── Shared Helper: getPackageMap ───────────────────────────────────────────

const getPackageMap = (() => {
  let result = undefined;
  let lastLoadAt = 0;

  return function getPackages(dir) {
    if (result) {
      if (Date.now() - lastLoadAt > 5000) {
        result = undefined;
      } else {
        return result;
      }
    }
    const packages = manypkg.getPackagesSync(dir);
    if (!packages) {
      return undefined;
    }
    result = {
      map: new Map(packages.packages.map(pkg => [pkg.packageJson.name, pkg])),
      list: packages.packages,
      root: packages.root,
      byPath(filePath) {
        return packages.packages.find(
          pkg => !path.relative(pkg.dir, filePath).startsWith('..'),
        );
      },
      clearCache() {
        result = undefined;
      },
    };
    lastLoadAt = Date.now();
    return result;
  };
})();

// ─── Shared Helper: getFilePath / getCwd ────────────────────────────────────

function getFilePath(context) {
  if (context.getPhysicalFilename) {
    return context.getPhysicalFilename();
  }
  if (context.physicalFilename) {
    return context.physicalFilename;
  }
  if (context.getFilename) {
    return context.getFilename();
  }
  return context.filename;
}

function getCwd(context) {
  if (context.getCwd) {
    return context.getCwd();
  }
  return context.cwd;
}

// ─── Shared Helper: classifyImport / visitImports ───────────────────────────

function getImportInfo(node) {
  let pathNode;

  if (node.type === 'CallExpression') {
    if (
      node.callee.type === 'Identifier' &&
      node.callee.name === 'require' &&
      node.arguments.length === 1
    ) {
      pathNode = node.arguments[0];
    }
  } else {
    pathNode = node.source;
  }

  if (pathNode?.type !== 'Literal') {
    return undefined;
  }
  if (typeof pathNode.value !== 'string') {
    return undefined;
  }

  return {
    path: pathNode.value,
    node: pathNode,
    kind: node.importKind ?? 'value',
  };
}

function visitImports(context, visitor) {
  function visit(node) {
    const packages = getPackageMap(getCwd(context));
    if (!packages) {
      return;
    }

    const info = getImportInfo(node);
    if (!info) {
      return;
    }

    if (info.path[0] === '.') {
      visitor(node, { type: 'local', ...info });
      return;
    }

    if (info.path.startsWith('directive:')) {
      visitor(node, { type: 'directive', ...info });
      return;
    }

    const pathParts = info.path.split('/');

    let packageName;
    let subPath;
    if (info.path[0] === '@') {
      packageName = pathParts.slice(0, 2).join('/');
      subPath = pathParts.slice(2).join('/');
    } else {
      packageName = pathParts[0];
      subPath = pathParts.slice(1).join('/');
    }

    const pkg = packages.map.get(packageName);
    if (!pkg) {
      if (
        packageName.startsWith('node:') ||
        builtinModules.includes(packageName)
      ) {
        visitor(node, {
          type: 'builtin',
          kind: info.kind,
          node: info.node,
          path: subPath,
          packageName,
        });
        return;
      }

      visitor(node, {
        type: 'external',
        kind: info.kind,
        node: info.node,
        path: subPath,
        packageName,
      });
      return;
    }

    visitor(node, {
      type: 'internal',
      kind: info.kind,
      node: info.node,
      path: subPath,
      package: pkg,
      packageName,
    });
  }

  return {
    ImportDeclaration: visit,
    ExportAllDeclaration: visit,
    ExportNamedDeclaration: visit,
    ImportExpression: visit,
    CallExpression: visit,
  };
}

// ─── no-undeclared-imports helpers ──────────────────────────────────────────

const depFields = {
  dep: 'dependencies',
  dev: 'devDependencies',
  peer: 'peerDependencies',
};

const devModulePatterns = [
  new Minimatch('!src/**'),
  new Minimatch('src/**/*.test.*'),
  new Minimatch('src/**/*.stories.*'),
  new Minimatch('src/**/__testUtils__/**'),
  new Minimatch('src/**/__mocks__/**'),
  new Minimatch('src/setupTests.*'),
];

function getExpectedDepType(localPkgJson, impPath, modulePath) {
  const role = localPkgJson?.backstage?.role;
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
        default:
          break;
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
    let oldDepsField;
    if (isDep) {
      oldDepsField = depFields.dep;
    } else if (isDevDep) {
      oldDepsField = depFields.dev;
    }
    return { oldDepsField, depsField };
  }
  return undefined;
}

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

function addVersionQuery(name, flag, packages) {
  const rangeCounts = new Map();

  for (const pkg of packages.list) {
    let deps;
    if (flag === '--dev') {
      deps = pkg.packageJson.devDependencies;
    } else if (flag === '--peer') {
      deps = pkg.packageJson.peerDependencies;
    } else {
      deps = pkg.packageJson.dependencies;
    }
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

function addMissingImports(toAdd, packages, localPkg) {
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
    const namesWithQuery = [...names].map(name =>
      addVersionQuery(name, flag, packages),
    );

    try {
      execFileSync(
        'yarn',
        ['add', ...(flag ? [flag] : []), ...namesWithQuery],
        {
          cwd: localPkg.dir,
          stdio: 'inherit',
        },
      );
    } catch (err) {
      console.error(`Failed to add dependencies: ${err.message ?? err}`);
    }
  }
}

function removeInlineImports(toInline, localPkg) {
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
    try {
      execFileSync('yarn', ['remove', ...toRemove], {
        cwd: localPkg.dir,
        stdio: 'inherit',
      });
    } catch (err) {
      console.error(`Failed to remove dependencies: ${err.message ?? err}`);
    }
  }
}

function addForwardedInlineImports(toInline, localPkg) {
  const declaredProdDeps = new Set([
    ...Object.keys(localPkg.packageJson.dependencies ?? {}),
    ...Object.keys(localPkg.packageJson.peerDependencies ?? {}),
    localPkg.packageJson.name,
  ]);

  const byFlagByName = new Map();

  for (const { pkg } of toInline) {
    for (const depType of ['dependencies', 'peerDependencies']) {
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
    try {
      execFileSync(
        'yarn',
        ['add', ...(flag ? [flag] : []), ...namesWithQuery],
        {
          cwd: localPkg.dir,
          stdio: 'inherit',
        },
      );
    } catch (err) {
      console.error(
        `Failed to add forwarded dependencies: ${err.message ?? err}`,
      );
    }
  }
}

// ─── no-top-level-material-ui-4-imports helpers ─────────────────────────────

const KNOWN_STYLES = [
  'hexToRgb',
  'rgbToHex',
  'hslToRgb',
  'decomposeColor',
  'recomposeColor',
  'getContrastRatio',
  'getLuminance',
  'emphasize',
  'fade',
  'alpha',
  'darken',
  'lighten',
  'easing',
  'duration',
  'createTheme',
  'unstable_createMuiStrictModeTheme',
  'createMuiTheme',
  'ThemeOptions',
  'Theme',
  'Direction',
  'PaletteColorOptions',
  'SimplePaletteColorOptions',
  'createStyles',
  'TypographyStyle',
  'TypographyVariant',
  'makeStyles',
  'responsiveFontSizes',
  'ComponentsPropsList',
  'useTheme',
  'withStyles',
  'WithStyles',
  'StyleRules',
  'StyleRulesCallback',
  'StyledComponentProps',
  'withTheme',
  'WithTheme',
  'styled',
  'ComponentCreator',
  'StyledProps',
  'createGenerateClassName',
  'jssPreset',
  'ServerStyleSheets',
  'StylesProvider',
  'MuiThemeProvider',
  'ThemeProvider',
  'ThemeProviderProps',
];

function importSpecifiersFilter(specifier) {
  return (
    specifier.type === 'ImportSpecifier' &&
    specifier.imported.type !== 'Literal'
  );
}

function getNamedImportValue(values) {
  return values.alias
    ? `${values.value} as ${values.alias}`
    : `${values.value}`;
}

// ─── no-mixed-plugin-imports helpers ────────────────────────────────────────

const roleRules = [
  {
    sourceRole: ['frontend-plugin', 'web-library'],
    targetRole: [
      'backend-plugin',
      'node-library',
      'backend-plugin-module',
      'frontend-plugin',
    ],
  },
  {
    sourceRole: ['backend-plugin', 'node-library', 'backend-plugin-module'],
    targetRole: ['frontend-plugin', 'web-library', 'backend-plugin'],
  },
  {
    sourceRole: ['common-library'],
    targetRole: [
      'frontend-plugin',
      'web-library',
      'backend-plugin',
      'node-library',
      'backend-plugin-module',
    ],
  },
];

function matchesPattern(pattern, filePath) {
  return new Minimatch(pattern).match(filePath);
}

// ─── Plugin Export ──────────────────────────────────────────────────────────

module.exports = {
  meta: { name: 'backstage' },
  rules: {
    // ── Rule 1: no-forbidden-package-imports ────────────────────────────
    'no-forbidden-package-imports': {
      meta: {
        type: 'problem',
        messages: {
          forbidden: '{{packageName}} does not export {{subPath}}',
        },
      },
      createOnce(context) {
        return visitImports(context, (node, imp) => {
          if (imp.type !== 'internal') {
            return;
          }
          if (!imp.path) {
            return;
          }

          const exp = imp.package.packageJson.exports;
          if (exp && (exp[imp.path] || exp[`./${imp.path}`])) {
            return;
          }
          if (!exp) {
            const files = imp.package.packageJson.files;
            if (
              !files ||
              files.some(f => !f.startsWith('dist') && imp.path.startsWith(f))
            ) {
              return;
            }
            if (imp.path === 'package.json') {
              return;
            }
          }

          context.report({
            node: node,
            messageId: 'forbidden',
            data: {
              packageName: imp.package.packageJson.name || imp.package.dir,
              subPath: imp.path,
            },
          });
        });
      },
    },

    // ── Rule 2: no-relative-monorepo-imports ────────────────────────────
    'no-relative-monorepo-imports': {
      meta: {
        type: 'problem',
        messages: {
          outside:
            'Import of {{path}} is outside of any known monorepo package',
          forbidden:
            "Relative imports of monorepo packages are forbidden, use '{{newImport}}' instead",
        },
      },
      createOnce(context) {
        let packages;
        let filePath;
        let localPkg;

        return {
          before() {
            packages = getPackageMap(getCwd(context));
            filePath = getFilePath(context);
            localPkg = packages?.byPath(filePath);
          },
          ...visitImports(context, (node, imp) => {
            if (!localPkg) {
              return;
            }
            if (imp.type !== 'local') {
              return;
            }

            const target = path.resolve(path.dirname(filePath), imp.path);
            if (!path.relative(localPkg.dir, target).startsWith('..')) {
              return;
            }

            const targetPkg = packages.byPath(target);
            if (!targetPkg) {
              context.report({
                node: node,
                messageId: 'outside',
                data: {
                  path: target,
                },
              });
              return;
            }

            const targetPath = path.relative(targetPkg.dir, target);
            const targetName = targetPkg.packageJson.name ?? '<unknown>';
            context.report({
              node: node,
              messageId: 'forbidden',
              data: {
                newImport: targetPath
                  ? `${targetName}/${targetPath}`
                  : targetName,
              },
            });
          }),
        };
      },
    },

    // ── Rule 3: no-undeclared-imports ────────────────────────────────────
    'no-undeclared-imports': {
      meta: {
        type: 'problem',
        fixable: 'code',
        messages: {
          undeclared:
            "{{ packageName }} must be declared in {{ depsField }} of {{ packageJsonPath }}, run 'yarn --cwd {{ packagePath }} add{{ addFlag }} {{ packageName }}' from the project root.",
          switch:
            '{{ packageName }} is declared in {{ oldDepsField }}, but should be moved to {{ depsField }} in {{ packageJsonPath }}.',
          switchBack: 'Switch back to import declaration',
          inlineDirect:
            'The dependency on the inline package {{ packageName }} must not be declared in package dependencies.',
          inlineMissing:
            'Each production dependency from the inline package {{ packageName }} must be re-declared by this package, the following dependencies are missing: {{ missingDeps }}',
        },
      },
      createOnce(context) {
        let packages;
        let filePath;
        let localPkg;
        let importsToAdd;
        let importsToInline;

        const importVisitors = visitImports(context, (node, imp) => {
          if (!packages || !localPkg) {
            return;
          }

          // Skip type imports, builtins, and local imports
          if (
            imp.kind === 'type' ||
            imp.type === 'builtin' ||
            imp.type === 'local'
          ) {
            return;
          }

          // Handle directives (add-import, inline-imports)
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

              importsToInline.push({
                pkg: pkg,
                node: imp.node,
              });
            }

            return;
          }

          // Internal inlined package
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
              localPkg.packageJson.name,
            ]);
            for (const depType of ['dependencies', 'peerDependencies']) {
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
                packageJsonPath: packageJsonPath,
              },
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
        });

        return {
          before() {
            packages = getPackageMap(getCwd(context));
            filePath = getFilePath(context);
            localPkg = packages?.byPath(filePath);
            importsToAdd = [];
            importsToInline = [];
          },
          ...importVisitors,
          ['Program:exit']() {
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
        };
      },
    },

    // ── Rule 4: no-mixed-plugin-imports ─────────────────────────────────
    'no-mixed-plugin-imports': {
      meta: {
        type: 'problem',
        hasSuggestions: true,
        messages: {
          forbidden:
            '{{sourcePackage}} ({{sourceRole}}) uses forbidden import from {{targetPackage}} ({{targetRole}}).',
          useSamePluginId:
            'Import of {{targetPackage}} ({{targetRole}}) from {{sourceRole}} is forbidden unless you are overriding the plugin, in which case the `backstage.pluginId` in {{sourcePackage}}/package.json must be the same as in {{targetPackage}}',
          useReactPlugin:
            'Use web library {{targetPackage}}-react or common library instead.',
          useNodePlugin:
            'Use node library {{targetPackage}}-node or common library instead.',
          useCommonPlugin:
            'Use common library {{targetPackage}}-common instead.',
          removeImport:
            'Remove this import to avoid mixed plugin imports. Fix the code by refactoring it to use the correct plugin type.',
        },
        schema: [
          {
            type: 'object',
            properties: {
              excludedTargetPackages: {
                type: 'array',
                items: { type: 'string' },
                uniqueItems: true,
              },
              excludedFiles: {
                type: 'array',
                items: { type: 'string' },
                uniqueItems: true,
              },
              includedFiles: {
                type: 'array',
                items: { type: 'string' },
                uniqueItems: true,
              },
            },
            additionalProperties: false,
          },
        ],
      },
      createOnce(context) {
        let pkg;
        let filePath;
        let ignoreTargetPackages;

        return {
          before() {
            const packages = getPackageMap(getCwd(context));
            filePath = getFilePath(context);
            pkg = packages?.byPath(filePath);
            if (!packages || !pkg) {
              return false;
            }

            const options = context.options?.[0] || {};
            ignoreTargetPackages = options.excludedTargetPackages || [];
            const excludePatterns = options.excludedFiles || [];
            const includePatterns = options.includedFiles || ['**/src/**'];

            if (
              !includePatterns.some(pattern =>
                matchesPattern(pattern, filePath),
              ) ||
              excludePatterns.some(pattern => matchesPattern(pattern, filePath))
            ) {
              return false;
            }

            return undefined;
          },
          ...visitImports(context, (node, imp) => {
            if (!pkg) {
              return;
            }
            if (imp.type !== 'internal') {
              return;
            }

            const targetPackage = imp.package;
            const targetName = targetPackage?.packageJson.name;
            const sourceName = pkg.packageJson.name;
            if (sourceName === targetName) {
              return;
            }

            const sourceRole = pkg.packageJson.backstage?.role;
            const sourcePluginId = pkg.packageJson.backstage?.pluginId;
            const targetRole = targetPackage.packageJson.backstage?.role;
            const targetPluginId =
              targetPackage.packageJson.backstage?.pluginId;
            if (!sourceRole || !targetRole) {
              return;
            }

            // Allow frontend plugins to import from other frontend plugins with same pluginId (NFS)
            if (
              sourceRole === 'frontend-plugin' &&
              targetRole === 'frontend-plugin' &&
              sourcePluginId &&
              targetPluginId &&
              sourcePluginId === targetPluginId
            ) {
              return;
            }

            if (
              roleRules.some(
                rule =>
                  rule.sourceRole.includes(sourceRole) &&
                  rule.targetRole.includes(targetRole) &&
                  !ignoreTargetPackages.includes(targetName),
              )
            ) {
              const suggest = [];

              if (
                (sourceRole === 'frontend-plugin' ||
                  sourceRole === 'web-library') &&
                targetRole === 'frontend-plugin'
              ) {
                suggest.push({
                  messageId: 'useSamePluginId',
                  data: {
                    targetPackage: targetName,
                    targetRole: targetRole,
                    sourcePackage: sourceName,
                    sourceRole: sourceRole,
                  },
                  fix(_fixer) {
                    // Not fixable, just a suggestion
                  },
                });
                suggest.push({
                  messageId: 'useReactPlugin',
                  data: {
                    targetPackage: targetName,
                  },
                  fix(fixer) {
                    const source =
                      context.sourceCode || context.getSourceCode();
                    const nodeSource = source.getText(imp.node);
                    const newImport = nodeSource.replace(/'$/, "-react'");
                    return fixer.replaceText(imp.node, newImport);
                  },
                });
                suggest.push({
                  messageId: 'useCommonPlugin',
                  data: {
                    targetPackage: targetName,
                  },
                  fix(fixer) {
                    const source =
                      context.sourceCode || context.getSourceCode();
                    const nodeSource = source.getText(imp.node);
                    const newImport = nodeSource.replace(/'$/, "-common'");
                    return fixer.replaceText(imp.node, newImport);
                  },
                });
              } else if (
                (sourceRole === 'backend-plugin' ||
                  sourceRole === 'backend-plugin-module') &&
                targetRole === 'backend-plugin'
              ) {
                suggest.push({
                  messageId: 'useNodePlugin',
                  data: {
                    targetPackage: targetName,
                  },
                  fix(fixer) {
                    const source =
                      context.sourceCode || context.getSourceCode();
                    const nodeSource = source.getText(imp.node);
                    const newImport = nodeSource.replace(
                      /-backend'$/,
                      "-node'",
                    );
                    return fixer.replaceText(imp.node, newImport);
                  },
                });
                suggest.push({
                  messageId: 'useCommonPlugin',
                  data: {
                    targetPackage: targetName,
                  },
                  fix(fixer) {
                    const source =
                      context.sourceCode || context.getSourceCode();
                    const nodeSource = source.getText(imp.node);
                    const newImport = nodeSource.replace(
                      /-backend'$/,
                      "-common'",
                    );
                    return fixer.replaceText(imp.node, newImport);
                  },
                });
              } else {
                suggest.push({
                  messageId: 'removeImport',
                  fix(_fixer) {
                    // Not fixable, just a suggestion
                  },
                });
              }

              context.report({
                node: node,
                messageId: 'forbidden',
                data: {
                  sourcePackage: pkg.packageJson.name || imp.package.dir,
                  sourceRole,
                  targetPackage:
                    targetPackage.packageJson.name || imp.package.dir,
                  targetRole,
                },
                suggest,
              });
            }
          }),
        };
      },
    },

    // ── Rule 5: no-ui-css-imports-in-non-frontend ───────────────────────
    'no-ui-css-imports-in-non-frontend': {
      meta: {
        type: 'problem',
        messages: {
          noCssImport:
            'CSS imports from @backstage/ui are only allowed in packages with backstage.role set to "frontend". Current role: "{{role}}"',
        },
      },
      createOnce(context) {
        let currentPackage;

        return {
          before() {
            const packages = getPackageMap(getCwd(context));
            const filePath = getFilePath(context);
            currentPackage = packages?.byPath(filePath);
          },
          ...visitImports(context, (node, imp) => {
            if (!currentPackage) {
              return;
            }

            const isBuiImport =
              (imp.type === 'external' || imp.type === 'internal') &&
              imp.packageName === '@backstage/ui';
            if (!isBuiImport) {
              return;
            }

            const isCssImport = imp.path?.endsWith('.css');
            if (!isCssImport) {
              return;
            }

            const backstageRole = currentPackage.packageJson.backstage?.role;
            if (!backstageRole) {
              return;
            }

            if (backstageRole !== 'frontend') {
              context.report({
                node: node,
                messageId: 'noCssImport',
                data: {
                  role: backstageRole,
                },
              });
            }
          }),
        };
      },
    },

    // ── Rule 6: no-top-level-material-ui-4-imports ──────────────────────
    'no-top-level-material-ui-4-imports': {
      meta: {
        type: 'problem',
        fixable: 'code',
        messages: {
          topLevelImport: 'Top level imports for Material UI are not allowed',
        },
      },
      createOnce: context => ({
        ImportDeclaration: node => {
          if (node.specifiers.length === 0) return;
          if (!node.source.value) return;
          if (typeof node.source.value !== 'string') return;
          if (!node.source.value.startsWith('@material-ui/')) return;
          if (node.source.value === '@material-ui/core/styles') return;
          if (node.source.value === '@material-ui/data-grid') return;
          if (node.source.value?.split('/').length >= 3) return;

          context.report({
            node,
            messageId: 'topLevelImport',
            fix: fixer => {
              const replacements = [];
              const styles = [];

              const specifiers = node.specifiers.filter(importSpecifiersFilter);

              const specifiersMap = specifiers.flatMap(s => {
                if (s.imported.type === 'Literal') {
                  return [];
                }

                const value = s.imported.name;
                const alias = s.local.name === value ? undefined : s.local.name;

                const propsMatch =
                  /^([A-Z]\w+)Props$/.exec(value) ??
                  (node.source.value === '@material-ui/pickers'
                    ? /^Keyboard([A-Z]\w+Picker)$/.exec(value)
                    : null);

                const emitProp = propsMatch !== null;
                const emitComponent = !emitProp;
                const emitComponentAndProp =
                  emitProp &&
                  specifiers.find(
                    sp =>
                      sp.imported.type !== 'Literal' &&
                      sp.imported.name === propsMatch[1],
                  )?.local.name;

                return [
                  {
                    emitComponent:
                      emitComponent || Boolean(emitComponentAndProp),
                    emitProp,
                    value,
                    componentValue: propsMatch ? propsMatch[1] : undefined,
                    componentAlias: emitComponentAndProp
                      ? emitComponentAndProp
                      : undefined,
                    alias,
                  },
                ];
              });

              // Filter out duplicates where we have both component and component+prop
              const filteredMap = specifiersMap.filter(
                f => !specifiersMap.some(s => f.value === s.componentValue),
              );

              for (const specifier of filteredMap) {
                // Just Component
                if (specifier.emitComponent && !specifier.emitProp) {
                  if (KNOWN_STYLES.includes(specifier.value)) {
                    styles.push(getNamedImportValue(specifier));
                  } else {
                    const replacement = `import ${
                      specifier.alias ?? specifier.value
                    } from '${node.source.value}/${specifier.value}';`;
                    replacements.push(replacement);
                  }
                }

                // Just Prop
                if (specifier.emitProp && !specifier.emitComponent) {
                  const replacement = `import { ${getNamedImportValue(
                    specifier,
                  )} } from '${node.source.value}/${
                    specifier.componentValue
                  }';`;
                  replacements.push(replacement);
                }

                // Component and Prop
                if (specifier.emitComponent && specifier.emitProp) {
                  replacements.push(
                    `import ${
                      specifier.componentAlias ?? specifier.componentValue
                    }, { ${getNamedImportValue(specifier)} } from '${
                      node.source.value
                    }/${specifier.componentValue}';`,
                  );
                }
              }

              if (styles.length > 0) {
                const stylesReplacement = `import { ${styles.join(
                  ', ',
                )} } from '@material-ui/core/styles';`;
                replacements.push(stylesReplacement);
              }

              return fixer.replaceText(node, replacements.join('\n'));
            },
          });
        },
      }),
    },
  },
};

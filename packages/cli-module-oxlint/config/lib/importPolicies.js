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

// Ported from the ESLint plugin (packages/eslint-plugin) and adapted to the
// Oxlint plugin host; behavior between the two can drift.

const minimatch = require('minimatch');
const path = require('node:path');

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

const mixedPluginRoleRules = [
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

/** @param {string} modulePath */
function isDevModulePath(modulePath) {
  return devModulePatterns.some(pattern => pattern.match(modulePath));
}

// Compiled patterns are reused, since the same few patterns from the rule
// options are matched against every linted file
/** @type {Map<string, InstanceType<typeof minimatch.Minimatch>>} */
const filePatternCache = new Map();

/** @param {string} pattern @param {string} filePath */
function matchesFilePattern(pattern, filePath) {
  let matcher = filePatternCache.get(pattern);
  if (!matcher) {
    matcher = new minimatch.Minimatch(pattern);
    filePatternCache.set(pattern, matcher);
  }
  return matcher.match(filePath.split('\\').join('/'));
}

/**
 * @param {any} localPackage
 * @param {string} importPackageName
 * @param {string} modulePath
 * @returns {'dep' | 'dev' | 'peer'}
 */
function getExpectedDepType(localPackage, importPackageName, modulePath) {
  switch (localPackage?.backstage?.role) {
    case 'common-library':
    case 'web-library':
    case 'frontend-plugin':
    case 'frontend-plugin-module':
    case 'node-library':
    case 'backend-plugin':
    case 'backend-plugin-module':
      if (
        ['react', 'react-dom', 'react-router', 'react-router-dom'].includes(
          importPackageName,
        )
      ) {
        return 'peer';
      }
      break;
    default:
      break;
  }

  return isDevModulePath(modulePath) ? 'dev' : 'dep';
}

/**
 * @param {any} packageJson
 * @param {string} name
 * @param {'dep' | 'dev' | 'peer'} expectedType
 * @returns {{oldDepsField?: string, depsField: string} | undefined}
 */
function findDependencyConflict(packageJson, name, expectedType) {
  const isDep = packageJson.dependencies?.[name];
  const isDevDep = packageJson.devDependencies?.[name];
  const isPeerDep = packageJson.peerDependencies?.[name];
  const depsField = depFields[expectedType];

  if (expectedType === 'dep' && !isDep && !isPeerDep) {
    return { oldDepsField: isDevDep ? depFields.dev : undefined, depsField };
  }
  if (expectedType === 'dev' && !isDevDep && !isDep && !isPeerDep) {
    return { oldDepsField: undefined, depsField };
  }
  if (expectedType === 'peer' && !isPeerDep) {
    return {
      oldDepsField: isDep
        ? depFields.dep
        : isDevDep
        ? depFields.dev
        : undefined,
      depsField,
    };
  }
  return undefined;
}

/** @param {string} depsField */
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
 * @param {import('./getPackages').ExtendedPackage['packageJson']} packageJson
 * @param {string} importPath
 */
function isForbiddenPackageImport(packageJson, importPath) {
  if (!importPath) {
    return false;
  }

  const exports = packageJson.exports;
  if (exports && (exports[importPath] || exports[`./${importPath}`])) {
    return false;
  }
  if (!exports) {
    const files = packageJson.files;
    if (
      !files ||
      files.some(
        file => !file.startsWith('dist') && importPath.startsWith(file),
      )
    ) {
      return false;
    }
    if (importPath === 'package.json') {
      return false;
    }
  }
  return true;
}

/**
 * @param {any} sourcePackage
 * @param {any} targetPackage
 * @param {string[]} excludedTargetPackages
 */
function isForbiddenMixedPluginImport(
  sourcePackage,
  targetPackage,
  excludedTargetPackages = [],
) {
  const sourceName = sourcePackage.packageJson.name;
  const targetName = targetPackage.packageJson.name;
  if (sourceName === targetName) {
    return false;
  }

  const sourceRole = sourcePackage.packageJson.backstage?.role;
  const sourcePluginId = sourcePackage.packageJson.backstage?.pluginId;
  const targetRole = targetPackage.packageJson.backstage?.role;
  const targetPluginId = targetPackage.packageJson.backstage?.pluginId;
  if (!sourceRole || !targetRole) {
    return false;
  }

  if (
    sourceRole === 'frontend-plugin' &&
    targetRole === 'frontend-plugin' &&
    sourcePluginId &&
    targetPluginId &&
    sourcePluginId === targetPluginId
  ) {
    return false;
  }

  return mixedPluginRoleRules.some(
    rule =>
      rule.sourceRole.includes(sourceRole) &&
      rule.targetRole.includes(targetRole) &&
      !excludedTargetPackages.includes(targetName),
  );
}

/**
 * @param {any} packages
 * @param {any} localPackage
 * @param {string} filePath
 * @param {string} importPath
 * @returns {{type: 'outside', path: string} | {type: 'forbidden', newImport: string} | undefined}
 */
function getRelativeMonorepoImport(
  packages,
  localPackage,
  filePath,
  importPath,
) {
  const target = path.resolve(path.dirname(filePath), importPath);
  if (!path.relative(localPackage.dir, target).startsWith('..')) {
    return undefined;
  }

  const targetPackage = packages.byPath(target);
  if (!targetPackage) {
    return { type: 'outside', path: target };
  }

  const targetPath = path.relative(targetPackage.dir, target);
  const targetName = targetPackage.packageJson.name ?? '<unknown>';
  return {
    type: 'forbidden',
    newImport: targetPath ? `${targetName}/${targetPath}` : targetName,
  };
}

/** @param {any} imp */
function isUiCssImport(imp) {
  return (
    (imp.type === 'external' || imp.type === 'internal') &&
    imp.packageName === '@backstage/ui' &&
    imp.path?.endsWith('.css')
  );
}

/** @param {any} imp @param {string | undefined} role */
function isForbiddenUiCssImport(imp, role) {
  return isUiCssImport(imp) && Boolean(role) && role !== 'frontend';
}

/** @param {unknown} source @param {number} specifierCount */
function isTopLevelMaterialUi4Import(source, specifierCount) {
  return (
    specifierCount > 0 &&
    typeof source === 'string' &&
    source.startsWith('@material-ui/') &&
    source !== '@material-ui/core/styles' &&
    source !== '@material-ui/data-grid' &&
    source.split('/').length < 3
  );
}

module.exports = {
  depFields,
  getExpectedDepType,
  matchesFilePattern,
  findDependencyConflict,
  getAddFlagForDepsField,
  isForbiddenPackageImport,
  isForbiddenMixedPluginImport,
  getRelativeMonorepoImport,
  isUiCssImport,
  isForbiddenUiCssImport,
  isTopLevelMaterialUi4Import,
};

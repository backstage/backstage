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

const depFields = {
  dep: 'dependencies',
  dev: 'devDependencies',
  peer: 'peerDependencies',
};

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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      undeclared:
        "{{ packageName }} must be declared in {{ depsField }} of {{ packageJsonPath }}, run 'yarn --cwd {{ packagePath }} add{{ addFlag }} {{ packageName }}' from the project root.",
      switch:
        '{{ packageName }} is declared in {{ oldDepsField }}, but should be moved to {{ depsField }} in {{ packageJsonPath }}.',
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

    return visitImports(context, (node, imp) => {
      // We leave checking of type imports to the repo-tools check,
      // and we skip builtins and local imports
      if (
        imp.kind === 'type' ||
        imp.type === 'builtin' ||
        imp.type === 'local'
      ) {
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
        });
      }
    });
  },
};

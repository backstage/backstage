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
const visitImports = require('../lib/visitImports');
const getPackageMap = require('../lib/getPackages');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      outside: 'Import of {{path}} is outside of any known monorepo package',
      forbidden:
        "Relative imports of monorepo packages are forbidden, use '{{newImport}}' instead",
    },
    docs: {
      description:
        'Forbid relative imports that reach outside of the package in a monorepo.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-relative-monorepo-imports.md',
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
          newImport: targetPath ? `${targetName}/${targetPath}` : targetName,
        },
      });
    });
  },
};

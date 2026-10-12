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

const visitImports = require('../lib/visitImports');
const getPackages = require('../lib/getPackages');
const { getRelativeMonorepoImport } = require('../lib/importPolicies');

/** @type {Parameters<import('oxlint/plugins-dev').RuleTester['run']>[1]} */
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
      url: 'https://github.com/backstage/backstage/blob/master/packages/cli-module-oxlint/docs/rules/no-relative-monorepo-imports.md',
    },
  },
  createOnce(context) {
    /** @type {ReturnType<typeof getPackages>} */
    let packages;
    /** @type {string} */
    let filePath;
    /** @type {import('../lib/getPackages.js').ExtendedPackage | undefined} */
    let localPkg;

    return {
      before() {
        packages = getPackages(context.cwd);
        filePath = context.physicalFilename;
        localPkg = packages?.byPath(filePath);
        if (!localPkg) {
          return false;
        }
      },
      ...visitImports(context, (node, imp) => {
        if (!packages || !localPkg) return;
        if (imp.type !== 'local') {
          return;
        }

        const result = getRelativeMonorepoImport(
          packages,
          localPkg,
          filePath,
          imp.path,
        );
        if (!result) {
          return;
        }
        if (result.type === 'outside') {
          context.report({
            node,
            messageId: 'outside',
            data: { path: result.path },
          });
          return;
        }

        context.report({
          node,
          messageId: 'forbidden',
          data: { newImport: result.newImport },
        });
      }),
    };
  },
};

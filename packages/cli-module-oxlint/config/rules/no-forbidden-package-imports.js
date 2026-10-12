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
const { isForbiddenPackageImport } = require('../lib/importPolicies');

/** @type {Parameters<import('oxlint/plugins-dev').RuleTester['run']>[1]} */
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      forbidden: '{{packageName}} does not export {{subPath}}',
    },
    docs: {
      description:
        'Disallow internal monorepo imports from package subpaths that are not exported.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/cli-module-oxlint/docs/rules/no-forbidden-package-imports.md',
    },
  },
  createOnce(context) {
    return visitImports(context, (node, imp) => {
      if (imp.type !== 'internal') {
        return;
      }
      if (!isForbiddenPackageImport(imp.package.packageJson, imp.path)) {
        return;
      }

      context.report({
        node,
        messageId: 'forbidden',
        data: {
          packageName: imp.package.packageJson.name || imp.package.dir,
          subPath: imp.path,
        },
      });
    });
  },
};

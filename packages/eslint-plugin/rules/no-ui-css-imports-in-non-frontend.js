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

const visitImports = require('../lib/visitImports');
const getPackages = require('../lib/getPackages');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      noCssImport:
        'CSS imports from @backstage/ui are only allowed in packages with backstage.role set to "frontend". Current role: "{{role}}"',
    },
    docs: {
      description:
        'Ensure that only packages with backstage.role set to "frontend" can import CSS files from @backstage/ui.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-ui-css-imports-in-non-frontend.md',
    },
  },
  create(context) {
    const packages = getPackages(context.getCwd());
    if (!packages) {
      return {};
    }

    const currentPackage = packages.byPath(context.filename);
    if (!currentPackage) {
      return {};
    }

    return visitImports(context, (node, imp) => {
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
        // Allow if no role is defined
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
    });
  },
};

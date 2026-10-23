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

// @ts-check

const visitImports = require('../lib/visitImports');
const getPackages = require('../lib/getPackages');
const { isForbiddenUiCssImport } = require('../lib/importPolicies');

/** @type {Parameters<import('oxlint/plugins-dev').RuleTester['run']>[1]} */
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
      url: 'https://github.com/backstage/backstage/blob/master/packages/cli-module-oxlint/docs/rules/no-ui-css-imports-in-non-frontend.md',
    },
  },
  createOnce(context) {
    /** @type {import('../lib/getPackages.js').ExtendedPackage | undefined} */
    let currentPackage;

    return {
      before() {
        const packages = getPackages(context.cwd);
        currentPackage = packages?.byPath(context.physicalFilename);
        if (!currentPackage) {
          return false;
        }
      },
      ...visitImports(context, (node, imp) => {
        if (!currentPackage) return;
        const backstageRole = currentPackage.packageJson.backstage?.role;
        if (!isForbiddenUiCssImport(imp, backstageRole)) {
          return;
        }
        context.report({
          node,
          messageId: 'noCssImport',
          data: { role: backstageRole },
        });
      }),
    };
  },
};

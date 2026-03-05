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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      forbidden: '{{packageName}} does not export {{subPath}}',
    },
    docs: {
      description:
        'Disallow internal monorepo imports from package subpaths that are not exported.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-forbidden-package-imports.md',
    },
  },
  create(context) {
    return visitImports(context, (node, imp) => {
      if (imp.type !== 'internal') {
        return;
      }
      // Empty subpaths are always allowed
      if (!imp.path) {
        return;
      }

      // If the import is listed in the package.json exports field, we allow it
      const exp = imp.package.packageJson.exports;
      if (exp && (exp[imp.path] || exp['./' + imp.path])) {
        return;
      }
      if (!exp) {
        // If there's no exports field, we allow anything listed in files, except dist
        const files = imp.package.packageJson.files;
        if (
          !files ||
          files.some(f => !f.startsWith('dist') && imp.path.startsWith(f))
        ) {
          return;
        }
        // And also package.json
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
};

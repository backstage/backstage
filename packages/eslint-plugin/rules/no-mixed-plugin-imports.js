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
const minimatch = require('minimatch');

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

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      forbidden:
        '{{sourcePackage}} ({{sourceRole}}) uses forbidden import from {{targetPackage}} ({{targetRole}}).',
    },
    docs: {
      description: 'Disallow mixed plugin imports.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-mixed-plugin-imports.md',
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
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const packages = getPackages(context.cwd);
    if (!packages) {
      return {};
    }

    const filePath = context.physicalFilename
      ? context.physicalFilename
      : context.filename;

    const pkg = packages.byPath(filePath);
    if (!pkg) {
      return {};
    }

    const options = context.options[0] || {};
    const ignoreTargetPackages = options.excludedTargetPackages || [];
    const ignorePatterns = options.excludedFiles || [
      '**/*.{test,spec}.[jt]s?(x)',
      '**/dev/index.[jt]s?(x)',
    ];

    if (
      ignorePatterns.some(pattern =>
        new minimatch.Minimatch(pattern).match(context.filename),
      )
    ) {
      return {};
    }

    return visitImports(context, (node, imp) => {
      if (imp.type !== 'internal') {
        return;
      }

      const targetPackage = imp.package;
      const targetName = targetPackage.packageJson.name;
      const sourceName = pkg.packageJson.name;
      if (sourceName === targetName) {
        return;
      }

      const sourceRole = pkg.packageJson.backstage?.role;
      const targetRole = targetPackage.packageJson.backstage?.role;
      if (!sourceRole || !targetRole) {
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
        context.report({
          node: node,
          messageId: 'forbidden',
          data: {
            sourcePackage: pkg.packageJson.name || imp.package.dir,
            sourceRole,
            targetPackage: targetPackage.packageJson.name || imp.package.dir,
            targetRole,
          },
        });
      }
    });
  },
};

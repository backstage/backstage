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
const {
  isForbiddenMixedPluginImport,
  matchesFilePattern,
} = require('../lib/importPolicies');

/** @typedef {import('../lib/getPackages.js').ExtendedPackage} ExtendedPackage */

/** @type {Parameters<import('oxlint/plugins-dev').RuleTester['run']>[1]} */
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      forbidden:
        '{{sourcePackage}} ({{sourceRole}}) uses forbidden import from {{targetPackage}} ({{targetRole}}).',
    },
    docs: {
      description: 'Disallow mixed plugin imports.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/cli-module-oxlint/docs/rules/no-mixed-plugin-imports.md',
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
    /** @type {string[]} */
    let ignoreTargetPackages = [];
    /** @type {string[]} */
    let excludePatterns = [];
    /** @type {string[]} */
    let includePatterns = [];

    /** @type {ExtendedPackage | undefined} */
    let pkg;

    return {
      before() {
        const options =
          /** @type {{ excludedTargetPackages?: string[], excludedFiles?: string[], includedFiles?: string[] }} */ (
            context.options?.[0] || {}
          );
        ignoreTargetPackages = options.excludedTargetPackages || [];
        excludePatterns = options.excludedFiles || [];
        includePatterns = options.includedFiles || ['**/src/**'];

        const packages = getPackages(context.cwd);
        const filePath = context.physicalFilename;
        pkg = packages?.byPath(filePath);
        if (!pkg) {
          return false;
        }
        if (
          !includePatterns.some(pattern =>
            matchesFilePattern(pattern, filePath),
          ) ||
          excludePatterns.some(pattern => matchesFilePattern(pattern, filePath))
        ) {
          return false;
        }
      },
      ...visitImports(context, (node, imp) => {
        if (!pkg) return;
        if (imp.type !== 'internal') {
          return;
        }

        /** @type {ExtendedPackage | undefined} */
        const targetPackage = imp.package;
        if (
          !targetPackage ||
          !isForbiddenMixedPluginImport(
            pkg,
            targetPackage,
            ignoreTargetPackages,
          )
        ) {
          return;
        }
        const sourceRole = pkg.packageJson.backstage?.role;
        const targetRole = targetPackage.packageJson.backstage?.role;

        context.report({
          node,
          messageId: 'forbidden',
          data: {
            sourcePackage: pkg.packageJson.name || imp.package.dir,
            sourceRole,
            targetPackage: targetPackage.packageJson.name || imp.package.dir,
            targetRole,
          },
        });
      }),
    };
  },
};

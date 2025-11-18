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

/** @typedef {import('../lib/getPackages.js').ExtendedPackage} ExtendedPackage */

/**
 * @param {string} pattern
 * @param {string} filePath
 * @returns {boolean}
 */
const matchesPattern = (pattern, filePath) => {
  return new minimatch.Minimatch(pattern).match(filePath);
};

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
      useSamePluginId: `Import of {{targetPackage}} ({{targetRole}}) from {{sourceRole}} is forbidden unless you are overriding the plugin, in which case the \`backstage.pluginId\` in {{sourcePackage}}/package.json must be the same as in {{targetPackage}}`,
      useReactPlugin:
        'Use web library {{targetPackage}}-react or common library instead.',
      useNodePlugin:
        'Use node library {{targetPackage}}-node or common library instead.',
      useCommonPlugin: 'Use common library {{targetPackage}}-common instead.',
      removeImport:
        'Remove this import to avoid mixed plugin imports. Fix the code by refactoring it to use the correct plugin type.',
    },
    docs: {
      description: 'Disallow mixed plugin imports.',
      url: 'https://github.com/backstage/backstage/blob/master/packages/eslint-plugin/docs/rules/no-mixed-plugin-imports.md',
    },
    hasSuggestions: true,
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
  create(context) {
    const packages = getPackages(context.cwd);
    if (!packages) {
      return {};
    }

    const filePath = context.physicalFilename
      ? context.physicalFilename
      : context.filename;

    /** @type {ExtendedPackage | undefined} */
    const pkg = packages.byPath(filePath);
    if (!pkg) {
      return {};
    }

    const options = context.options[0] || {};
    /** @type {string[]} */
    const ignoreTargetPackages = options.excludedTargetPackages || [];
    /** @type {string[]} */
    const excludePatterns = options.excludedFiles || [];
    /** @type {string[]} */
    const includePatterns = options.includedFiles || ['**/src/**'];

    if (
      !includePatterns.some(pattern => matchesPattern(pattern, filePath)) ||
      excludePatterns.some(pattern => matchesPattern(pattern, filePath))
    ) {
      return {};
    }

    return visitImports(context, (node, imp) => {
      if (imp.type !== 'internal') {
        return;
      }

      /** @type {ExtendedPackage | undefined} */
      const targetPackage = imp.package;
      const targetName = targetPackage?.packageJson.name;
      const sourceName = pkg.packageJson.name;
      if (sourceName === targetName) {
        return;
      }

      const sourceRole = pkg.packageJson.backstage?.role;
      const sourcePluginId = pkg.packageJson.backstage?.pluginId;
      const targetRole = targetPackage.packageJson.backstage?.role;
      const targetPluginId = targetPackage.packageJson.backstage?.pluginId;
      if (!sourceRole || !targetRole) {
        return;
      }

      // Allow frontend plugins to import from other frontend plugins with the same pluginId for NFS
      if (
        sourceRole === 'frontend-plugin' &&
        targetRole === 'frontend-plugin' &&
        sourcePluginId &&
        targetPluginId &&
        sourcePluginId === targetPluginId
      ) {
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
        const suggest = [];

        if (
          (sourceRole === 'frontend-plugin' || sourceRole === 'web-library') &&
          targetRole === 'frontend-plugin'
        ) {
          suggest.push({
            messageId: 'useSamePluginId',
            data: {
              targetPackage: targetName,
              targetRole: targetRole,
              sourcePackage: sourceName,
              sourceRole: sourceRole,
            },
            /** @param {import('eslint').Rule.RuleFixer} _fixer */
            fix(_fixer) {
              // Not a fixable case, just give a suggestion to change plugin id
            },
          });
          suggest.push({
            messageId: 'useReactPlugin',
            data: {
              targetPackage: targetName,
            },
            /** @param {import('eslint').Rule.RuleFixer} fixer */
            fix(fixer) {
              const source = context.sourceCode;
              const nodeSource = source.getText(imp.node);
              const newImport = nodeSource.replace(/'$/, "-react'");
              return fixer.replaceText(imp.node, newImport);
            },
          });
          suggest.push({
            messageId: 'useCommonPlugin',
            data: {
              targetPackage: targetName,
            },
            /** @param {import('eslint').Rule.RuleFixer} fixer */
            fix(fixer) {
              const source = context.sourceCode;
              const nodeSource = source.getText(imp.node);
              const newImport = nodeSource.replace(/'$/, "-common'");
              return fixer.replaceText(imp.node, newImport);
            },
          });
        } else if (
          (sourceRole === 'backend-plugin' ||
            sourceRole === 'backend-plugin-module') &&
          targetRole === 'backend-plugin'
        ) {
          suggest.push({
            messageId: 'useNodePlugin',
            data: {
              targetPackage: targetName,
            },
            /** @param {import('eslint').Rule.RuleFixer} fixer */
            fix(fixer) {
              const source = context.sourceCode;
              const nodeSource = source.getText(imp.node);
              const newImport = nodeSource.replace(/-backend'$/, "-node'");
              return fixer.replaceText(imp.node, newImport);
            },
          });
          suggest.push({
            messageId: 'useCommonPlugin',
            data: {
              targetPackage: targetName,
            },
            /** @param {import('eslint').Rule.RuleFixer} fixer */
            fix(fixer) {
              const source = context.sourceCode;
              const nodeSource = source.getText(imp.node);
              const newImport = nodeSource.replace(/-backend'$/, '-common');
              return fixer.replaceText(imp.node, newImport);
            },
          });
        } else {
          suggest.push({
            messageId: 'removeImport',
            /** @param {import('eslint').Rule.RuleFixer} _fixer */
            fix(_fixer) {
              // Not a fixable case, just give a suggestion to remove the import
            },
          });
        }

        context.report({
          node: node,
          messageId: 'forbidden',
          data: {
            sourcePackage: pkg.packageJson.name || imp.package.dir,
            sourceRole,
            targetPackage: targetPackage.packageJson.name || imp.package.dir,
            targetRole,
          },
          suggest,
        });
      }
    });
  },
};

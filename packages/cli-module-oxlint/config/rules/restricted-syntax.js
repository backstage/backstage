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

/**
 * Flags `.toLowerCase()` calls with no arguments.
 * Suggests `.toLocaleLowerCase('en-US')` instead.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const noBareLowerCase = {
  meta: { type: 'suggestion' },
  createOnce(context) {
    return {
      CallExpression(node) {
        if (
          node.arguments.length === 0 &&
          node.callee &&
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'toLowerCase'
        ) {
          context.report({
            node: node.callee.property,
            message:
              "Avoid using .toLowerCase(), use .toLocaleLowerCase('en-US') instead. This rule can sometimes be ignored when converting text to be displayed to the user.",
          });
        }
      },
    };
  },
};

/**
 * Flags `.toUpperCase()` calls with no arguments.
 * Suggests `.toLocaleUpperCase('en-US')` instead.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const noBareUpperCase = {
  meta: { type: 'suggestion' },
  createOnce(context) {
    return {
      CallExpression(node) {
        if (
          node.arguments.length === 0 &&
          node.callee &&
          node.callee.type === 'MemberExpression' &&
          node.callee.property.name === 'toUpperCase'
        ) {
          context.report({
            node: node.callee.property,
            message:
              "Avoid using .toUpperCase(), use .toLocaleUpperCase('en-US') instead. This rule can sometimes be ignored when converting text to be displayed to the user.",
          });
        }
      },
    };
  },
};

/**
 * Flags default or namespace imports from 'react'.
 * Named imports should be used instead.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const noReactDefaultImport = {
  meta: { type: 'suggestion' },
  createOnce(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === 'react') {
          for (const spec of node.specifiers) {
            if (
              spec.type === 'ImportDefaultSpecifier' ||
              spec.type === 'ImportNamespaceSpecifier'
            ) {
              context.report({
                node: spec,
                message:
                  "React default imports are deprecated. Use named imports instead (e.g. `import { useState } from 'react'`).",
              });
            }
          }
        }
      },
    };
  },
};

/**
 * Flags default imports from 'winston'.
 * `import * as winston` should be used instead.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const noWinstonDefaultImport = {
  meta: { type: 'suggestion' },
  createOnce(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === 'winston') {
          for (const spec of node.specifiers) {
            if (spec.type === 'ImportDefaultSpecifier') {
              context.report({
                node: spec,
                message:
                  'Default import from winston is not allowed, import `* as winston` instead.',
              });
            }
          }
        }
      },
    };
  },
};

/**
 * Flags `__dirname` usage inside src/ (excluding test files).
 * `resolvePackagePath()` should be used instead in production builds.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const noDirnameInSrc = {
  meta: { type: 'problem' },
  createOnce(context) {
    return {
      Identifier(node) {
        if (node.name !== '__dirname') {
          return;
        }

        const filename =
          context.getPhysicalFilename?.() ??
          context.getFilename?.() ??
          context.filename ??
          '';

        const inSrc =
          filename.includes('/src/') || filename.includes('\\src\\');
        if (!inSrc) {
          return;
        }

        const isTestFile =
          filename.includes('.test.') ||
          filename.includes('.spec.') ||
          filename.includes('__testUtils__') ||
          filename.includes('__mocks__') ||
          filename.includes('setupTests');
        if (isTestFile) {
          return;
        }

        context.report({
          node,
          message:
            "`__dirname` doesn't refer to the same dir in production builds, try `resolvePackagePath()` from `@backstage/backend-plugin-api` instead.",
        });
      },
    };
  },
};

module.exports = {
  noBareLowerCase,
  noBareUpperCase,
  noReactDefaultImport,
  noWinstonDefaultImport,
  noDirnameInSrc,
};

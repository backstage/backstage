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
module.exports = {
  meta: { name: 'restricted-syntax' },
  rules: {
    'no-bare-to-lower-case': {
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
    },

    'no-bare-to-upper-case': {
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
    },

    'no-react-default-import': {
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
    },

    'no-winston-default-import': {
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
    },

    'no-dirname-in-src': {
      createOnce(context) {
        return {
          Identifier(node) {
            if (node.name === '__dirname') {
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
            }
          },
        };
      },
    },
  },
};

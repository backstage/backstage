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
 * Flags `__dirname` usage inside src/ (excluding test files).
 * `resolvePackagePath()` should be used instead in production builds.
 *
 * @type {Parameters<import('oxlint/plugins-dev').RuleTester['run']>[1]}
 */
module.exports = {
  meta: { type: 'problem' },
  createOnce(context) {
    return {
      Identifier(node) {
        if (node.name !== '__dirname') {
          return;
        }

        const filename = context.physicalFilename;

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

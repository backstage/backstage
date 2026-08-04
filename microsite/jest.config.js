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

// This config runs a small, newer set of pluginDirectory component tests
// through Jest + Testing Library, distinguished by the `.spec.tsx` suffix.
// The rest of the pluginDirectory suite still runs on Node's built-in test
// runner via `yarn test:plugin-directory` (see `testDom.ts` in that
// directory) and is untouched by this config.
module.exports = {
  rootDir: __dirname,
  testEnvironment: '@backstage/cli-module-test-jest/config/jest-environment-jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '\\.[jt]sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: { react: { runtime: 'automatic' } },
          parser: { syntax: 'typescript', tsx: true },
        },
      },
    ],
  },
  moduleNameMapper: {
    '\\.module\\.scss$': 'identity-obj-proxy',
    '^@docusaurus/Link$': '<rootDir>/src/testUtils/docusaurusMocks/Link.tsx',
    '^@theme/Layout$': '<rootDir>/src/testUtils/docusaurusMocks/Layout.tsx',
    '^@theme/Tabs$': '<rootDir>/src/testUtils/docusaurusMocks/Tabs.tsx',
    '^@theme/TabItem$':
      '<rootDir>/src/testUtils/docusaurusMocks/TabItem.tsx',
  },
};

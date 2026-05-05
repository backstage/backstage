/*
 * Copyright 2025 The Backstage Authors
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

import { RuleTester } from 'eslint';
import { adaptRule } from './testUtils';
import path from 'node:path';

const RULE = 'no-mixed-plugin-imports';
const FIXTURE = path.resolve(__dirname, '../__fixtures__/monorepo');

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
const rule = adaptRule(require('../../config/rules/no-mixed-plugin-imports'));

const ERR = (
  sourcePackage: string,
  sourceRole: string,
  targetPackage: string,
  targetRole: string,
) => ({
  message: `${sourcePackage} (${sourceRole}) uses forbidden import from ${targetPackage} (${targetRole}).`,
});

// cwd must be restored
const origDir = process.cwd();
afterAll(() => {
  process.chdir(origDir);
});
process.chdir(FIXTURE);

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
  },
});

ruleTester.run(RULE, rule, {
  valid: [
    // Same package import (self-import) — always allowed
    {
      code: `import '@internal/bar'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
    },
    // Import from inline package — no role, allowed
    {
      code: `import '@internal/inline'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
    },
    // Import from package without a role — allowed
    {
      code: `import '@internal/no-role-pkg'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
    },
    // Same pluginId (frontend-plugin to frontend-plugin override) — allowed for NFS
    {
      code: `import '@internal/bar'`,
      filename: path.join(FIXTURE, 'packages/bar-override/src/index.ts'),
    },
    // Excluded target package — allowed via option
    {
      code: `import '@internal/foo'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      options: [{ excludedTargetPackages: ['@internal/foo'] }],
    },
    // File outside includedFiles pattern — skipped
    {
      code: `import '@internal/foo'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      options: [{ includedFiles: ['**/nonexistent/**'] }],
    },
    // File matching excludedFiles pattern — skipped
    {
      code: `import '@internal/foo'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      options: [{ excludedFiles: ['**/src/**'] }],
    },
    // Source package has no role (no-role-pkg) — no violation
    {
      code: `import '@internal/foo'`,
      filename: path.join(FIXTURE, 'packages/no-role-pkg/src/index.ts'),
    },
    // External import — always allowed
    {
      code: `import 'react'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
    },
  ],
  invalid: [
    // frontend-plugin importing from another frontend-plugin (different pluginId)
    {
      code: `import '@internal/foo'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR(
          '@internal/bar',
          'frontend-plugin',
          '@internal/foo',
          'frontend-plugin',
        ),
      ],
    },
    // frontend-plugin importing from backend-plugin
    {
      code: `import '@internal/backend-plugin-pkg'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR(
          '@internal/bar',
          'frontend-plugin',
          '@internal/backend-plugin-pkg',
          'backend-plugin',
        ),
      ],
    },
    // node-library importing from frontend-plugin
    {
      code: `import '@internal/foo'`,
      filename: path.join(FIXTURE, 'packages/self-import-pkg/src/index.ts'),
      errors: [
        ERR(
          '@internal/self-import-pkg',
          'node-library',
          '@internal/foo',
          'frontend-plugin',
        ),
      ],
    },
    // frontend-plugin importing from node-library
    {
      code: `import '@internal/self-import-pkg'`,
      filename: path.join(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR(
          '@internal/bar',
          'frontend-plugin',
          '@internal/self-import-pkg',
          'node-library',
        ),
      ],
    },
  ],
});

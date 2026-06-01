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

import { RuleTester } from 'eslint';
import path from 'node:path';
import rule from '../rules/no-self-package-imports';

const RULE = 'no-self-package-imports';
const FIXTURE = path.resolve(__dirname, '__fixtures__/monorepo');
const PKG_DIR = path.join(FIXTURE, 'packages/self-import-pkg');

const sameEntryErr = (entry = '.') => ({
  messageId: 'sameEntrySelfImport',
  data: { packageName: '@internal/self-import-pkg', entry },
});

const crossEntryErr = (importPath: string) => ({
  messageId: 'crossEntrySelfImport',
  data: { packageName: '@internal/self-import-pkg', importPath },
});

const origDir = process.cwd();
afterAll(() => {
  process.chdir(origDir);
});
process.chdir(FIXTURE);

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
  },
});

ruleTester.run(RULE, rule, {
  valid: [
    // Relative imports are always fine.
    {
      code: `import { foo } from './local'`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
    },
    // Imports of other packages are unaffected.
    {
      code: `import { foo } from '@internal/bar'`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
    },
    {
      code: `import { foo } from 'react'`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
    },
    // `src/alpha/refs.ts` is only in the `./alpha` bundle; importing from the
    // root entry `.` is a cross-entry reference, which is allowed by default.
    {
      code: `import { foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/alpha/refs.ts'),
    },
    // `src/index.ts` is only in the `.` bundle; importing from `./alpha` is
    // cross-entry.
    {
      code: `import { foo } from '@internal/self-import-pkg/alpha'`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
    },
    {
      code: `import { foo } from '@internal/self-import-pkg/testUtils'`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
    },
    // `src/next/foo.ts` is physically under `src/` but only re-exported from
    // `./alpha` (via `src/alpha/index.ts` → `../next`). The rule follows the
    // actual barrel graph rather than the directory layout, so importing
    // from the root entry is correctly classified as cross-entry.
    {
      code: `import { foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/next/foo.ts'),
    },
    // `package.json` imports are exempt since they don't go through the
    // module barrel.
    {
      code: `import pkg from '@internal/self-import-pkg/package.json'`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
    },
    // Files that aren't reachable from any entry (tests, scripts, orphans)
    // can't cause circular-init errors in the published bundle, so they're
    // skipped entirely.
    {
      code: `import { foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/index.test.ts'),
    },
    {
      code: `import { foo } from '@internal/self-import-pkg/alpha'`,
      filename: path.join(PKG_DIR, 'src/index.test.ts'),
    },
    {
      code: `import { foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/orphan.ts'),
    },
    // Dynamic imports in a test file still count as orphan, since the test
    // file itself isn't part of any entry's bundle.
    {
      code: `const m = import('@internal/self-import-pkg')`,
      filename: path.join(PKG_DIR, 'src/alpha/refs.test.ts'),
    },
    // `import type` is erased at runtime and can't create circular
    // initialization issues, so it's always allowed.
    {
      code: `import type { Foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
    },
    {
      code: `import type { Foo } from '@internal/self-import-pkg/alpha'`,
      filename: path.join(PKG_DIR, 'src/alpha/refs.ts'),
    },
    // `export type { ... } from` is also a type-only statement: the TS AST
    // marks it with `exportKind: 'type'`, and the emitted JS has no runtime
    // edge. Both same-entry and cross-entry forms must be skipped.
    {
      code: `export type { Foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
    },
    {
      code: `export type { Foo } from '@internal/self-import-pkg/alpha'`,
      filename: path.join(PKG_DIR, 'src/alpha/refs.ts'),
    },
    // `src/alpha/typeRef.ts` is only reachable from the `./alpha` barrel via
    // an `export type { ... } from './typeRef'` edge. Since type-only edges
    // are erased at runtime, the file isn't part of any entry's bundle and
    // self-imports from it must be skipped as orphans.
    {
      code: `import { foo } from '@internal/self-import-pkg/alpha'`,
      filename: path.join(PKG_DIR, 'src/alpha/typeRef.ts'),
    },
    {
      code: `import { foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/alpha/typeRef.ts'),
    },
  ],
  invalid: [
    // Same-entry self-imports are always errors because they create circular
    // module graphs inside a bundle.
    {
      code: `import { foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
      errors: [sameEntryErr('.')],
    },
    {
      code: `import { foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/util.ts'),
      errors: [sameEntryErr('.')],
    },
    {
      code: `export { foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
      errors: [sameEntryErr('.')],
    },
    {
      code: `const x = require('@internal/self-import-pkg')`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
      errors: [sameEntryErr('.')],
    },
    {
      code: `const m = import('@internal/self-import-pkg')`,
      filename: path.join(PKG_DIR, 'src/util.ts'),
      errors: [sameEntryErr('.')],
    },
    // Files in a non-root entry's bundle importing that same entry are
    // flagged.
    {
      code: `import { foo } from '@internal/self-import-pkg/alpha'`,
      filename: path.join(PKG_DIR, 'src/alpha/refs.ts'),
      errors: [sameEntryErr('./alpha')],
    },
    {
      code: `import { foo } from '@internal/self-import-pkg/testUtils'`,
      filename: path.join(PKG_DIR, 'src/testUtils.ts'),
      errors: [sameEntryErr('./testUtils')],
    },
    {
      code: `import { foo } from '@internal/self-import-pkg/testUtils'`,
      filename: path.join(PKG_DIR, 'src/testUtils/helper.ts'),
      errors: [sameEntryErr('./testUtils')],
    },
    // `src/next/foo.ts` is actually in the `./alpha` bundle via barrel
    // re-exports, so importing `./alpha` from it is same-entry — even though
    // the directory layout might suggest otherwise.
    {
      code: `import { foo } from '@internal/self-import-pkg/alpha'`,
      filename: path.join(PKG_DIR, 'src/next/foo.ts'),
      errors: [sameEntryErr('./alpha')],
    },
    // `src/shared.ts` is re-exported by both the root and alpha entries, so
    // either target is same-entry.
    {
      code: `import { foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/shared.ts'),
      errors: [sameEntryErr('.')],
    },
    {
      code: `import { foo } from '@internal/self-import-pkg/alpha'`,
      filename: path.join(PKG_DIR, 'src/shared.ts'),
      errors: [sameEntryErr('./alpha')],
    },
    // With `allowCrossEntry: false`, cross-entry imports are also flagged.
    {
      code: `import { foo } from '@internal/self-import-pkg'`,
      filename: path.join(PKG_DIR, 'src/alpha/refs.ts'),
      options: [{ allowCrossEntry: false }],
      errors: [crossEntryErr('@internal/self-import-pkg')],
    },
    {
      code: `import { foo } from '@internal/self-import-pkg/alpha'`,
      filename: path.join(PKG_DIR, 'src/index.ts'),
      options: [{ allowCrossEntry: false }],
      errors: [crossEntryErr('@internal/self-import-pkg/alpha')],
    },
  ],
});

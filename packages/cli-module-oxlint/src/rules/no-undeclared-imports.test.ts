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
import { join as joinPath } from 'node:path';

const RULE = 'no-undeclared-imports';
const FIXTURE = joinPath(__dirname, '../__fixtures__/monorepo');

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
const rule = adaptRule(require('../../config/rules/no-undeclared-imports'));

const ERR_UNDECLARED = (
  name: string,
  field: string,
  path: string,
  flag?: string,
) => ({
  message: `${name} must be declared in ${field} of ${joinPath(
    path,
    'package.json',
  )}, run 'yarn --cwd ${path} add${
    flag ? ` ${flag}` : ''
  } ${name}' from the project root.`,
});
const ERR_SWITCHED = (
  name: string,
  old: string,
  field: string,
  path: string,
) => ({
  message: `${name} is declared in ${old}, but should be moved to ${field} in ${joinPath(
    path,
    'package.json',
  )}.`,
});
const ERR_INLINE_DIRECT = (name: string) => ({
  message: `The dependency on the inline package ${name} must not be declared in package dependencies.`,
});
const ERR_INLINE_MISSING = (name: string, missing: string) => ({
  message: `Each production dependency from the inline package ${name} must be re-declared by this package, the following dependencies are missing: ${missing}`,
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
    {
      // Internal dep declared in dependencies
      code: `import '@internal/foo'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.ts'),
    },
    {
      // Internal dep declared in dependencies
      code: `import '@internal/bar'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.ts'),
    },
    {
      // Peer dep (react) declared in peerDependencies for frontend-plugin role
      code: `import 'react'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.ts'),
    },
    {
      // Internal dep declared in dependencies — test file
      code: `import '@internal/foo'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.test.ts'),
    },
    {
      // Internal dep declared in dependencies — test file
      code: `import '@internal/bar'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.test.ts'),
    },
    {
      // Dev dep (lodash) declared in devDependencies — test file is dev context
      code: `import 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.test.ts'),
    },
    {
      // Peer dep (react) declared in peerDependencies — even in test file, role wins
      code: `import 'react'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.test.ts'),
    },
    {
      // Non-literal require can't be validated
      code: `require('lod' + 'ash')`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
    },
    {
      // Valid inline package import — all forwarded deps declared
      code: `import '@internal/inline'`,
      filename: joinPath(FIXTURE, 'packages/inline-dep-valid/src/index.ts'),
    },
    {
      // Valid inline package import in test file
      code: `import '@internal/inline'`,
      filename: joinPath(
        FIXTURE,
        'packages/inline-dep-valid/src/index.test.ts',
      ),
    },
  ],
  invalid: [
    {
      // lodash is in devDependencies but used in production source → should be in dependencies
      code: `import 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.ts'),
      errors: [
        ERR_SWITCHED(
          'lodash',
          'devDependencies',
          'dependencies',
          joinPath('packages', 'foo'),
        ),
      ],
    },
    {
      // react-router is in dependencies but role expects peerDependencies
      code: `import 'react-router'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_SWITCHED(
          'react-router',
          'dependencies',
          'peerDependencies',
          joinPath('packages', 'bar'),
        ),
      ],
    },
    {
      // react-router-dom is in devDependencies but role expects peerDependencies
      code: `import 'react-router-dom'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_SWITCHED(
          'react-router-dom',
          'devDependencies',
          'peerDependencies',
          joinPath('packages', 'bar'),
        ),
      ],
    },
    {
      // lodash not declared at all in bar — import statement
      code: `import 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      // lodash not declared — named import
      code: `import { debounce } from 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      // lodash not declared — namespace import
      code: `import * as _ from 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      // lodash not declared — default import
      code: `import _ from 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      // lodash not declared — dynamic import
      code: `import('lodash')`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      // lodash not declared — require call
      code: `require('lodash')`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED('lodash', 'dependencies', joinPath('packages', 'bar')),
      ],
    },
    {
      // lodash not declared in test file — should be devDependencies
      code: `import 'lodash'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.test.ts'),
      errors: [
        ERR_UNDECLARED(
          'lodash',
          'devDependencies',
          joinPath('packages', 'bar'),
          '--dev',
        ),
      ],
    },
    {
      // react not declared at all in bar — role expects peerDependencies
      code: `import 'react'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED(
          'react',
          'peerDependencies',
          joinPath('packages', 'bar'),
          '--peer',
        ),
      ],
    },
    {
      // react not declared in bar — role expects peer even in test file
      code: `import 'react'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.test.ts'),
      errors: [
        ERR_UNDECLARED(
          'react',
          'peerDependencies',
          joinPath('packages', 'bar'),
          '--peer',
        ),
      ],
    },
    {
      // react-dom not declared — role expects peerDependencies
      code: `import 'react-dom'`,
      filename: joinPath(FIXTURE, 'packages/foo/src/index.ts'),
      errors: [
        ERR_UNDECLARED(
          'react-dom',
          'peerDependencies',
          joinPath('packages', 'foo'),
          '--peer',
        ),
      ],
    },
    {
      // Scoped package (@internal/foo) not declared in bar
      code: `import '@internal/foo'`,
      filename: joinPath(FIXTURE, 'packages/bar/src/index.ts'),
      errors: [
        ERR_UNDECLARED(
          '@internal/foo',
          'dependencies',
          joinPath('packages', 'bar'),
        ),
      ],
    },
    {
      // Inline package with direct dependency declared in package.json
      code: `import '@internal/inline'`,
      filename: joinPath(
        FIXTURE,
        'packages/inline-dep-invalid-direct/src/index.ts',
      ),
      errors: [ERR_INLINE_DIRECT('@internal/inline')],
    },
    {
      // Inline package with missing forwarded deps
      code: `import '@internal/inline'`,
      filename: joinPath(
        FIXTURE,
        'packages/inline-dep-invalid-missing/src/index.ts',
      ),
      errors: [
        ERR_INLINE_MISSING(
          '@internal/inline',
          '@internal/inline-dep-valid, react',
        ),
      ],
    },
  ],
});

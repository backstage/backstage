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

import { RuleTester } from './testUtils';

const noDirnameInSrc = require('../../config/rules/no-dirname-in-src');

const ruleTester = new RuleTester({
  languageOptions: { sourceType: 'module' },
});

describe('no-dirname-in-src', () => {
  ruleTester.run('no-dirname-in-src', noDirnameInSrc, {
    valid: [
      {
        // Outside src/ is fine
        code: `const dir = __dirname`,
        filename: '/root/packages/foo/scripts/build.ts',
      },
      {
        // Test file inside src/ is fine
        code: `const dir = __dirname`,
        filename: '/root/packages/foo/src/index.test.ts',
      },
      {
        // __mocks__ inside src/ is fine
        code: `const dir = __dirname`,
        filename: '/root/packages/foo/src/__mocks__/fs.ts',
      },
    ],
    invalid: [
      {
        code: `const dir = __dirname`,
        filename: '/root/packages/foo/src/index.ts',
        errors: [{ message: /resolvePackagePath/ }],
      },
    ],
  });
});

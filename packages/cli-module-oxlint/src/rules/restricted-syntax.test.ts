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
import { adaptRule } from './testUtils';

const raw = require('../../config/rules/restricted-syntax');
const noBareLowerCase = adaptRule(raw.noBareLowerCase);
const noBareUpperCase = adaptRule(raw.noBareUpperCase);
const noReactDefaultImport = adaptRule(raw.noReactDefaultImport);
const noWinstonDefaultImport = adaptRule(raw.noWinstonDefaultImport);
const noDirnameInSrc = adaptRule(raw.noDirnameInSrc);

const ruleTester = new RuleTester({
  parserOptions: { sourceType: 'module', ecmaVersion: 2021 },
});

describe('restricted-syntax rules', () => {
  ruleTester.run('no-bare-to-lower-case', noBareLowerCase, {
    valid: [
      { code: `str.toLocaleLowerCase('en-US')` },
      { code: `str.toLowerCase('en')` }, // has argument, fine
    ],
    invalid: [
      {
        code: `str.toLowerCase()`,
        errors: [{ message: /toLocaleLowerCase/ }],
      },
    ],
  });

  ruleTester.run('no-bare-to-upper-case', noBareUpperCase, {
    valid: [
      { code: `str.toLocaleUpperCase('en-US')` },
      { code: `str.toUpperCase('en')` },
    ],
    invalid: [
      {
        code: `str.toUpperCase()`,
        errors: [{ message: /toLocaleUpperCase/ }],
      },
    ],
  });

  ruleTester.run('no-react-default-import', noReactDefaultImport, {
    valid: [
      { code: `import { useState } from 'react'` },
      { code: `import { memo, useCallback } from 'react'` },
      { code: `import React from 'not-react'` },
    ],
    invalid: [
      {
        code: `import React from 'react'`,
        errors: [{ message: /deprecated/ }],
      },
      {
        code: `import * as React from 'react'`,
        errors: [{ message: /deprecated/ }],
      },
    ],
  });

  ruleTester.run('no-winston-default-import', noWinstonDefaultImport, {
    valid: [
      { code: `import * as winston from 'winston'` },
      { code: `import { createLogger } from 'winston'` },
    ],
    invalid: [
      {
        code: `import winston from 'winston'`,
        errors: [{ message: /not allowed/ }],
      },
    ],
  });

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

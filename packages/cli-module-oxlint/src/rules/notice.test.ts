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

const rule = adaptRule(require('../../config/rules/notice'));

const VALID_HEADER = `/*
 * Copyright 2024 The Backstage Authors
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
 */`;

const CURRENT_YEAR_HEADER = VALID_HEADER.replace(
  '2024',
  String(new Date().getFullYear()),
);

const ruleTester = new RuleTester({
  parserOptions: { sourceType: 'module', ecmaVersion: 2021 },
});

ruleTester.run('notice', rule, {
  valid: [
    {
      code: `${VALID_HEADER}\n\nexport const x = 1;`,
    },
    {
      // Different year is fine
      code: `${VALID_HEADER.replace('2024', '2020')}\n\nexport const x = 1;`,
    },
    {
      // Shebang before header is fine
      code: `#!/usr/bin/env node\n${VALID_HEADER}\n\nexport const x = 1;`,
    },
  ],
  invalid: [
    {
      code: `export const x = 1;`,
      output: `${CURRENT_YEAR_HEADER}\n\nexport const x = 1;`,
      errors: [{ message: 'Missing or incorrect Apache 2.0 copyright header' }],
    },
    {
      code: `/* some other comment */\nexport const x = 1;`,
      output: `${CURRENT_YEAR_HEADER}\n\nexport const x = 1;`,
      errors: [{ message: 'Missing or incorrect Apache 2.0 copyright header' }],
    },
  ],
});

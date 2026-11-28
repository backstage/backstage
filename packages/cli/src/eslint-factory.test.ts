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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { execFileSync } from 'node:child_process';

// ESLint runs in a separate process so that it loads the config the same way
// as outside of Jest, which the plugin resolution of the base config relies on.
const lintScript = `
const { relative, sep } = require('node:path');
const input = JSON.parse(process.argv[1]);
const { ESLint } = require(input.eslintPath);
new ESLint({ cwd: input.dir })
  .lintFiles(['.'])
  .then(results => {
    const messages = results.flatMap(result => {
      const file = relative(input.dir, result.filePath).split(sep).join('/');
      return result.messages.map(m => file + ': ' + (m.ruleId ?? m.message));
    });
    process.stdout.write(JSON.stringify(messages));
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
`;

describe('eslint-factory', () => {
  // The mock directory is outside of this repository, so the package being
  // linted can't load anything from its own location, like in a repository
  // where the dependencies of the CLI aren't hoisted.
  const mockDir = createMockDirectory();

  it('loads the configs, parser and plugins from the CLI', () => {
    const factoryPath = require.resolve('../config/eslint-factory');

    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'test-plugin',
        backstage: { role: 'frontend-plugin' },
      }),
      '.eslintrc.js': `module.exports = require(${JSON.stringify(
        factoryPath,
      )})(__dirname, { root: true, settings: { react: { version: '18.0' } } });`,
      'config.d.ts': [
        "import { Unused } from './unused';",
        '',
        'export interface Config {}',
        '',
      ].join('\n'),
      'src/index.tsx': [
        "import { useState } from 'react';",
        'export const size = 1;',
        '',
        'export function Image(props: { show: boolean }) {',
        '  if (props.show) {',
        '    const [size] = useState(2);',
        '    return <img src={String(size)} />;',
        '  }',
        '  return null;',
        '}',
        '',
      ].join('\n'),
      'src/index.test.ts': [
        "import { size } from './index';",
        '',
        "it.only('has a size', () => {",
        '  expect(size).toBe(1);',
        '});',
        '',
      ].join('\n'),
    });

    const output = execFileSync(
      process.execPath,
      [
        '-e',
        lintScript,
        JSON.stringify({
          dir: mockDir.path,
          eslintPath: require.resolve('eslint'),
        }),
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );

    // ESLint fails if any plugin can't be loaded, and these rules show that the
    // plugins of the base config and the shared configs it extends are active
    expect(JSON.parse(output)).toEqual(
      expect.arrayContaining([
        'config.d.ts: unused-imports/no-unused-imports',
        'src/index.tsx: import/newline-after-import',
        'src/index.tsx: @typescript-eslint/no-shadow',
        'src/index.tsx: react-hooks/rules-of-hooks',
        'src/index.tsx: jsx-a11y/alt-text',
        'src/index.test.ts: jest/no-focused-tests',
      ]),
    );
  });
});

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

import fs from 'fs-extra';
import { join, resolve as resolvePath } from 'node:path';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import format from './format';

const mockDir = createMockDirectory();
overrideTargetPaths({
  dir: join(mockDir.path, 'packages/a'),
  rootDir: mockDir.path,
});

// Records how it was called, and fails when checking, as if a file needed
// formatting
const fakeBin = `
const fs = require('node:fs');
fs.writeFileSync('call.json', JSON.stringify({ args: process.argv.slice(2), cwd: process.cwd() }));
process.exit(process.argv.includes('--check') ? 1 : 0);
`;

const info = { usage: 'backstage-cli package format', name: 'package format' };

function readCall() {
  return fs.readJsonSync(mockDir.resolve('call.json'));
}

describe('package format', () => {
  beforeEach(() => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'root',
        devDependencies: { prettier: '*' },
      }),
      'packages/a/package.json': JSON.stringify({ name: 'a' }),
      node_modules: {
        prettier: {
          'package.json': JSON.stringify({
            name: 'prettier',
            bin: './bin/prettier.js',
          }),
          'bin/prettier.js': fakeBin,
        },
      },
    });
  });

  it('runs Prettier from the project root on the current package or the given paths', async () => {
    await format({ args: [], info });
    let call = readCall();
    expect(call.args).toEqual([
      '--write',
      '--ignore-unknown',
      join(mockDir.path, 'packages/a'),
    ]);
    expect(fs.realpathSync(call.cwd)).toBe(fs.realpathSync(mockDir.path));

    await format({ args: ['src/a.ts', '/abs/dir'], info });
    call = readCall();
    expect(call.args).toEqual([
      '--write',
      '--ignore-unknown',
      resolvePath('src/a.ts'),
      '/abs/dir',
    ]);
  });

  it('fails with the exit code of Prettier when checking finds unformatted files', async () => {
    await expect(format({ args: ['--check'], info })).rejects.toMatchObject({
      name: 'ExitCodeError',
      code: 1,
      message: "Command 'prettier --check' exited with code 1",
    });
    expect(readCall().args).toEqual([
      '--check',
      '--ignore-unknown',
      join(mockDir.path, 'packages/a'),
    ]);
  });

  it('fails with an input error if the project root does not depend on Prettier', async () => {
    mockDir.addContent({
      'package.json': JSON.stringify({ name: 'root' }),
    });
    await expect(format({ args: [], info })).rejects.toMatchObject({
      name: 'InputError',
      message: `The 'prettier' package is not installed, add it to the dependencies of the root package.json at ${mockDir.resolve(
        'package.json',
      )}`,
    });

    // A separate directory, since Node.js caches module resolution
    const emptyDir = createMockDirectory({
      content: {
        'package.json': JSON.stringify({
          name: 'root',
          dependencies: { prettier: '*' },
        }),
      },
    });
    const override = overrideTargetPaths(emptyDir.path);
    try {
      await expect(format({ args: [], info })).rejects.toMatchObject({
        name: 'InputError',
      });
    } finally {
      override.restore();
      overrideTargetPaths({
        dir: join(mockDir.path, 'packages/a'),
        rootDir: mockDir.path,
      });
    }
  });
});

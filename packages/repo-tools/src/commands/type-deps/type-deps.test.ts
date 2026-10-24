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

import {
  createMockDirectory,
  MockDirectory,
} from '@backstage/backend-test-utils';
import { getPackages } from '@manypkg/get-packages';
import { join as joinPath } from 'node:path';
import typeDeps from './type-deps';

jest.mock('@manypkg/get-packages');

const getPackagesMock = getPackages as jest.MockedFunction<typeof getPackages>;

describe('type-deps', () => {
  let testDir: MockDirectory;
  let exitSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeAll(() => {
    testDir = createMockDirectory();
  });

  beforeEach(() => {
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`process.exit(${code})`);
    });
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
    testDir.clear();
  });

  /** Registers the directories in the mock dir as the workspace packages */
  function mockWorkspace(...names: string[]) {
    getPackagesMock.mockResolvedValue({
      packages: names.map(name => ({
        dir: joinPath(testDir.path, name),
        packageJson: { name, version: '0.0.0', types: 'dist/index.d.ts' },
        relativeDir: name,
      })),
    } as unknown as Awaited<ReturnType<typeof getPackages>>);
  }

  function output() {
    return errorSpy.mock.calls.map(args => args.join(' ')).join('\n');
  }

  it('fails when there are no built type declarations to check', async () => {
    testDir.addContent({
      'pkg-a': { 'package.json': '{}' },
      'pkg-b': { 'package.json': '{}' },
    });
    mockWorkspace('pkg-a', 'pkg-b');

    await expect(typeDeps()).rejects.toThrow('process.exit(2)');

    expect(output()).toContain('No packages were checked');
    expect(output()).toContain('Skipped 2 package(s)');
  });

  it('does not fail on an empty run when --allow-empty is passed', async () => {
    testDir.addContent({ 'pkg-a': { 'package.json': '{}' } });
    mockWorkspace('pkg-a');

    await expect(typeDeps({ allowEmpty: true })).resolves.toBeUndefined();

    expect(exitSpy).not.toHaveBeenCalled();
    expect(output()).toContain('Skipped 1 package(s)');
  });

  it('passes when every declared type dependency is present', async () => {
    testDir.addContent({
      'pkg-a': {
        'package.json': '{}',
        dist: { 'index.d.ts': 'export declare const x: string;\n' },
      },
    });
    mockWorkspace('pkg-a');

    await expect(typeDeps()).resolves.toBeUndefined();

    expect(exitSpy).not.toHaveBeenCalled();
    expect(output()).toBe('');
  });

  it('still reports packages with missing type dependencies', async () => {
    testDir.addContent({
      'pkg-a': {
        'package.json': '{}',
        dist: {
          'index.d.ts': "import { Thing } from 'definitely-not-installed';\n",
        },
      },
    });
    mockWorkspace('pkg-a');

    await expect(typeDeps()).rejects.toThrow('process.exit(2)');

    expect(output()).toContain('Incorrect type dependencies in pkg-a');
    expect(output()).toContain('definitely-not-installed');
    expect(output()).not.toContain('No packages were checked');
  });
});

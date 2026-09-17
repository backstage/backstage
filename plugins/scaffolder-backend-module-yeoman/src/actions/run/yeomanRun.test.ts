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

import { fileURLToPath } from 'node:url';
import { yeomanRun } from './yeomanRun';

const mockRegister = jest.fn();
const mockRun = jest.fn();
const mockCreateEnv = jest.fn();
const mockLookupGenerator = jest.fn();

// yeoman-environment is ESM-only from v4+. jest.unstable_mockModule intercepts
// the dynamic import() in yeomanRun via the ESM runtime when Node is started
// with --experimental-vm-modules (set in the "test" script in package.json).
// @ts-expect-error -- @types/jest doesn't yet declare unstable_mockModule
jest.unstable_mockModule('yeoman-environment', () => ({
  createEnv: mockCreateEnv,
  lookupGenerator: mockLookupGenerator,
}));

describe('yeomanRun', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockCreateEnv.mockReturnValue({ register: mockRegister, run: mockRun });
  });

  it('initialises the environment with the workspace as cwd', async () => {
    mockLookupGenerator.mockReturnValue('/generators/my-app/index.js');

    await yeomanRun('/my/workspace', 'my:app');

    expect(mockCreateEnv).toHaveBeenCalledWith({ cwd: '/my/workspace' });
  });

  it('looks up the generator by namespace', async () => {
    mockLookupGenerator.mockReturnValue('/generators/my-app/index.js');

    await yeomanRun('/my/workspace', 'my:app');

    expect(mockLookupGenerator).toHaveBeenCalledWith('my:app');
  });

  it('registers the generator file when lookupGenerator returns a plain path', async () => {
    mockLookupGenerator.mockReturnValue('/generators/my-app/index.js');

    await yeomanRun('/my/workspace', 'my:app');

    expect(mockRegister).toHaveBeenCalledWith('/generators/my-app/index.js', {
      namespace: 'my:app',
    });
  });

  it('converts a file:// URL from lookupGenerator to a plain file path', async () => {
    mockLookupGenerator.mockReturnValue('file:///generators/my-app/index.js');

    await yeomanRun('/my/workspace', 'my:app');

    expect(mockRegister).toHaveBeenCalledWith(
      fileURLToPath('file:///generators/my-app/index.js'),
      { namespace: 'my:app' },
    );
  });

  it('runs the generator with namespace, args, and options', async () => {
    mockLookupGenerator.mockReturnValue('/generators/my-app/index.js');

    await yeomanRun('/my/workspace', 'my:app', ['--force'], { key: 'value' });

    expect(mockRun).toHaveBeenCalledWith(['my:app', '--force'], {
      key: 'value',
    });
  });

  it('runs the generator with only the namespace when no args are provided', async () => {
    mockLookupGenerator.mockReturnValue('/generators/my-app/index.js');

    await yeomanRun('/my/workspace', 'my:app');

    expect(mockRun).toHaveBeenCalledWith(['my:app'], undefined);
  });

  it('registers the first entry when lookupGenerator returns an array', async () => {
    mockLookupGenerator.mockReturnValue([
      '/generators/my-app/index.js',
      '/generators/other/index.js',
    ]);

    await yeomanRun('/my/workspace', 'my:app');

    expect(mockRegister).toHaveBeenCalledWith('/generators/my-app/index.js', {
      namespace: 'my:app',
    });
  });

  it('throws when lookupGenerator returns an empty array', async () => {
    mockLookupGenerator.mockReturnValue([]);

    await expect(yeomanRun('/my/workspace', 'my:app')).rejects.toThrow(
      'No Yeoman generator found for namespace "my:app"',
    );
  });
});

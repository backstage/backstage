/*
 * Copyright 2020 The Backstage Authors
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

import { packageVersions, createPackageVersionProvider } from './version';
import { Lockfile, LockfileEntry } from '@backstage/cli-node';
import corePluginApiPkg from '@backstage/core-plugin-api/package.json';

const LOCKFILE_PACKAGES: Map<string, LockfileEntry[]> = new Map([
  [
    'a',
    [
      {
        range: '^0.1.0',
        version: '0.1.5',
      },
    ],
  ],
  [
    'b',
    [
      {
        range: '^0.2.0',
        version: '0.2.5',
      },
      {
        range: '*',
        version: '0.2.5',
      },
      {
        range: '^0.2.1',
        version: '0.2.5',
      },
    ],
  ],
  [
    'c',
    [
      {
        range: '^0.1.4',
        version: '0.1.8',
      },
      {
        range: '^0.2.4',
        version: '0.2.8',
      },
      {
        range: '^0.3.4',
        version: '0.3.8',
      },
    ],
  ],
  [
    '@types/t',
    [
      {
        range: '^1.1.0',
        version: '1.4.5',
      },
      {
        range: '*',
        version: '1.4.5',
      },
      {
        range: '^1.2.3',
        version: '1.4.5',
      },
    ],
  ],
  [
    '@backstage/cli',
    [
      {
        range: '*',
        version: '1.1.5',
      },
    ],
  ],
]);

const mockLockfile = {
  get: (name: string) => {
    return LOCKFILE_PACKAGES.get(name);
  },
} as unknown as Lockfile;

describe('createPackageVersionProvider', () => {
  it('should provide package versions', async () => {
    const provider = createPackageVersionProvider(mockLockfile);

    expect(provider('a', '0.1.5')).toBe('^0.1.0');
    expect(provider('b', '1.0.0')).toBe('*');
    expect(provider('c', '0.1.0')).toBe('^0.1.0');
    expect(provider('c', '0.1.6')).toBe('^0.1.4');
    expect(provider('c', '0.2.0')).toBe('^0.2.0');
    expect(provider('c', '0.2.6')).toBe('^0.2.4');
    expect(provider('c', '0.3.0-rc1')).toBe('0.3.0-rc1');
    expect(provider('c', '0.3.0')).toBe('^0.3.0');
    expect(provider('c', '0.3.6')).toBe('^0.3.4');
    const cliVersion = packageVersions['@backstage/cli'];
    expect(provider('@backstage/cli')).toBe(
      // If we're currently in pre-release we expect that to be picked instead
      cliVersion.includes('-') ? `^${cliVersion}` : '*',
    );
    expect(provider('@backstage/core-plugin-api')).toBe(
      `^${corePluginApiPkg.version}`,
    );
    expect(provider('@types/t', '1.4.2')).toBe('*');
  });
});

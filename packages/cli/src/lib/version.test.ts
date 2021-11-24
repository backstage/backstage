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

import mockFs from 'mock-fs';
import { createPackageVersionProvider } from './version';
import { Lockfile } from './versioning';
// eslint-disable-next-line monorepo/no-internal-import
import corePluginApiPkg from '@backstage/core-plugin-api/package.json';

describe('createPackageVersionProvider', () => {
  afterEach(() => {
    mockFs.restore();
  });

  it('should provide package versions', async () => {
    mockFs({
      'yarn.lock': `
"a@^0.1.0":
  version "0.1.5"

"b@^0.2.0","b@*","b@^0.2.1":
  version "0.2.5"

"c@^0.1.4":
  version "0.1.8"

"c@^0.2.4":
  version "0.2.8"

"c@^0.3.4":
  version "0.3.8"

"@types/t@^1.1.0","@types/t@*","@types/t@^1.2.3":
  version "1.4.5"

"@backstage/cli@*":
  version "1.1.5"
    `,
    });

    const lockfile = await Lockfile.load('yarn.lock');
    const provider = createPackageVersionProvider(lockfile);

    expect(provider('a', '0.1.5')).toBe('^0.1.0');
    expect(provider('b', '1.0.0')).toBe('*');
    expect(provider('c', '0.1.0')).toBe('^0.1.0');
    expect(provider('c', '0.1.6')).toBe('^0.1.4');
    expect(provider('c', '0.2.0')).toBe('^0.2.0');
    expect(provider('c', '0.2.6')).toBe('^0.2.4');
    expect(provider('c', '0.3.0-rc1')).toBe('0.3.0-rc1');
    expect(provider('c', '0.3.0')).toBe('^0.3.0');
    expect(provider('c', '0.3.6')).toBe('^0.3.4');
    expect(provider('@backstage/cli')).toBe('*');
    expect(provider('@backstage/core-plugin-api')).toBe(
      `^${corePluginApiPkg.version}`,
    );
    expect(provider('@types/t', '1.4.2')).toBe('*');
  });
});

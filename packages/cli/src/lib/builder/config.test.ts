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

import { ExternalOption } from 'rollup';
import { makeRollupConfigs } from './config';
import { Output } from './types';

describe('makeRollupConfigs', () => {
  it('should mark external modules correctly', async () => {
    const importerPath = '/some/path.ts'; // when specified we don't care about the path

    const [config] = await makeRollupConfigs({
      outputs: new Set([Output.cjs]),
      packageJson: {
        name: 'test',
        version: '0.0.0',
        main: './src/index.ts',
      },
    });
    const external = config.external as Exclude<
      ExternalOption,
      string | RegExp | (string | RegExp)[]
    >;

    expect(external('foo', importerPath, false)).toBe(true);
    expect(external('./foo', importerPath, false)).toBe(false);
    expect(external('/foo', importerPath, false)).toBe(false);
    expect(external('.\\foo', importerPath, false)).toBe(false);
    expect(external('c:\\foo', importerPath, false)).toBe(false);
    expect(external('@foo/bar', importerPath, false)).toBe(true);
    expect(external('../foo', importerPath, false)).toBe(false);

    // Modules without an importer are entry points, i.e. not external
    expect(external('foo', undefined, false)).toBe(false);
    expect(external('./foo', undefined, false)).toBe(false);
    expect(external('/foo', undefined, false)).toBe(false);
    expect(external('.\\foo', undefined, false)).toBe(false);
    expect(external('c:\\foo', undefined, false)).toBe(false);
    expect(external('@foo/bar', undefined, false)).toBe(false);
    expect(external('../foo', undefined, false)).toBe(false);

    // After modules have been resolved they're never marked as external
    expect(external('foo', importerPath, true)).toBe(false);
    expect(external('./foo', importerPath, true)).toBe(false);
    expect(external('/foo', importerPath, true)).toBe(false);
    expect(external('.\\foo', importerPath, true)).toBe(false);
    expect(external('c:\\foo', importerPath, true)).toBe(false);
    expect(external('@foo/bar', importerPath, true)).toBe(false);
    expect(external('../foo', importerPath, true)).toBe(false);
  });
});

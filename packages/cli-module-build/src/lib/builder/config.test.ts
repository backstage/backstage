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

import { ExternalOption, OutputOptions, rollup } from 'rollup';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { makeRollupConfigs } from './config';
import { Output } from './types';

describe('makeRollupConfigs', () => {
  it.each([
    { main: 'src/index.tsx' },
    { main: 'src/plugin.tsx' },
    { module: 'src/plugin.tsx', main: 'src/unused.ts' },
  ])(
    'should build declared entries %j with index output names',
    async entries => {
      const entry = entries.module ?? entries.main;
      const mockDir = createMockDirectory();
      mockDir.setContent({ [entry]: 'export const value: number = 1;' });
      const [config] = await makeRollupConfigs({
        targetDir: mockDir.path,
        outputs: new Set([Output.cjs, Output.esm]),
        packageJson: {
          name: 'test-package',
          version: '1.0.0',
          ...entries,
          types: entry,
        },
        workspacePackages: [],
      });
      expect(config.input).toEqual({ index: mockDir.resolve(entry) });
      const bundle = await rollup(config);
      try {
        const filenames = [];
        for (const output of config.output as OutputOptions[]) {
          const result = await bundle.generate(output);
          filenames.push(...result.output.map(file => file.fileName));
        }
        expect(filenames).toEqual([
          'index.cjs.js',
          'index.cjs.js.map',
          'index.esm.js',
          'index.esm.js.map',
        ]);
      } finally {
        await bundle.close();
      }
    },
  );

  it('should mark external modules correctly', async () => {
    const importerPath = '/some/path.ts'; // when specified we don't care about the path

    const [config] = await makeRollupConfigs({
      outputs: new Set([Output.cjs]),
      packageJson: {
        name: 'test',
        version: '0.0.0',
        main: './src/index.ts',
      },
      workspacePackages: [],
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

    // Node.js built-ins remain external after resolution
    expect(external('node:stream', importerPath, true)).toBe(true);
  });
});

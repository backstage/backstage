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

import { readEntryPoints } from './entryPoints';

describe('readEntryPoints', () => {
  const pkg = { name: 'test-package', version: '1.0.0' };
  const defaultEntry = {
    mount: '.',
    path: 'src/index.ts',
    name: 'index',
    ext: '.ts',
  };

  it.each([
    ['src/index.ts', '.ts'],
    ['./src/index.tsx', '.tsx'],
    ['src/plugin.tsx', '.tsx'],
    ['src/main.js', '.js'],
    ['src/main.jsx', '.jsx'],
    ['source/plugin.tsx', '.tsx'],
    ['dist/index.cjs.js', '.js'],
    ['./dist/index.js', '.js'],
    ['index.js', '.js'],
    ['src/index.d.ts', '.ts'],
    ['src/styles.css', '.css'],
    ['entry', ''],
  ])('should use declared main %s as the root entry point', (main, ext) => {
    expect(readEntryPoints({ ...pkg, main, types: main })).toEqual([
      { ...defaultEntry, path: main, ext },
    ]);
  });

  it.each(['source/plugin.tsx', 'dist/index.esm.js', 'entry'])(
    'should prefer declared module %s over main',
    module => {
      const expected = [
        {
          ...defaultEntry,
          path: module,
          ext: module.includes('.')
            ? module.slice(module.lastIndexOf('.'))
            : '',
        },
      ];
      expect(readEntryPoints({ ...pkg, module })).toEqual(expected);
      expect(readEntryPoints({ ...pkg, module, main: 'src/main.ts' })).toEqual(
        expected,
      );
    },
  );

  it('should use the conventional source entry point when module and main are absent', () => {
    expect(readEntryPoints(pkg)).toEqual([defaultEntry]);
  });

  it('should preserve explicit exports instead of adding or replacing entries from module or main', () => {
    const entries = { module: 'src/module.tsx', main: 'src/plugin.tsx' };
    expect(
      readEntryPoints({
        ...pkg,
        ...entries,
        exports: {
          '.': './src/public.ts',
          './alpha': './src/alpha.tsx',
          './styles.css': './src/styles.css',
        },
      }),
    ).toEqual([
      { ...defaultEntry, path: './src/public.ts' },
      { mount: './alpha', path: './src/alpha.tsx', name: 'alpha', ext: '.tsx' },
      {
        mount: './styles.css',
        path: './src/styles.css',
        name: 'styles.css',
        ext: '.css',
      },
    ]);
    expect(readEntryPoints({ ...pkg, ...entries, exports: {} })).toEqual([]);
    expect(
      readEntryPoints({
        ...pkg,
        ...entries,
        exports: { './alpha': './src/alpha.ts' },
      }),
    ).toEqual([
      { mount: './alpha', path: './src/alpha.ts', name: 'alpha', ext: '.ts' },
    ]);
  });

  it('should preserve the conventional fallback for string exports', () => {
    expect(
      readEntryPoints({
        ...pkg,
        main: 'src/plugin.tsx',
        module: 'src/module.tsx',
        exports: './dist/index.js',
      }),
    ).toEqual([defaultEntry]);
  });
});

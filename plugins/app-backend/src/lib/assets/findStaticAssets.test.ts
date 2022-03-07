/*
 * Copyright 2021 The Backstage Authors
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
import { findStaticAssets } from './findStaticAssets';

describe('findStaticAssets', () => {
  afterEach(() => {
    mockFs.restore();
  });

  it('should find assets', async () => {
    mockFs({
      '/test': {
        'a.js': 'alert("hello")',
        'a.js.map': '',
        'b.js': 'b',
        'b.js.map': '',
        js: {
          'd.js': 'd',
          'd.js.map': '',
          x: {
            'e.map': '',
            y: {
              'e.map': '',
              z: {
                'e.js': 'e',
                'e.map': '',
              },
            },
          },
        },
        styles: { 'c.css': 'body { color: red; }' },
      },
    });

    const assets = await findStaticAssets('/test');
    expect(assets.length).toBe(5);
    expect(assets.map(a => a.path)).toEqual(
      expect.arrayContaining([
        'a.js',
        'b.js',
        'styles/c.css',
        'js/d.js',
        'js/x/y/z/e.js',
      ]),
    );

    await expect(
      assets.find(a => a.path === 'a.js')!.content(),
    ).resolves.toEqual(Buffer.from('alert("hello")'));
    await expect(
      assets.find(a => a.path === 'b.js')!.content(),
    ).resolves.toEqual(Buffer.from('b'));
    await expect(
      assets.find(a => a.path === 'styles/c.css')!.content(),
    ).resolves.toEqual(Buffer.from('body { color: red; }'));
    await expect(
      assets.find(a => a.path === 'js/d.js')!.content(),
    ).resolves.toEqual(Buffer.from('d'));
    await expect(
      assets.find(a => a.path === 'js/x/y/z/e.js')!.content(),
    ).resolves.toEqual(Buffer.from('e'));
  });
});

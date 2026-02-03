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

import fs from 'fs-extra';
import {
  NormalizedOutputOptions,
  OutputAsset,
  OutputChunk,
  PluginContext,
} from 'rollup';

import { forwardFileImports } from './plugins';
import { createMockDirectory } from '@backstage/backend-test-utils';

const context = {
  meta: {
    rollupVersion: '0.0.0',
    watchMode: false,
  },
} as PluginContext;

describe('forwardFileImports', () => {
  it('should be created', () => {
    const plugin = forwardFileImports({ include: /\.png$/ });
    expect(plugin.name).toBe('forward-file-imports');
  });

  it('should call through to original external option', async () => {
    const plugin = forwardFileImports({ include: /\.png$/ });
    const external = jest.fn((id: string) => id.endsWith('external'));

    const options = (await plugin.options?.call(context, { external }))!;
    if (typeof options.external !== 'function') {
      throw new Error('options.external is not a function');
    }

    expect(external).toHaveBeenCalledTimes(0);
    expect(options.external('./my-module', '/dev/src/index.ts', false)).toBe(
      false,
    );
    expect(external).toHaveBeenCalledTimes(1);
    expect(options.external('./my-external', '/dev/src/index.ts', false)).toBe(
      true,
    );
    expect(external).toHaveBeenCalledTimes(2);
    expect(options.external('./my-image.png', '/dev/src/index.ts', false)).toBe(
      true,
    );
    expect(external).toHaveBeenCalledTimes(3);
    expect(options.external('./my-image.png', '/dev/src/index.ts', true)).toBe(
      true,
    );
    expect(external).toHaveBeenCalledTimes(4);

    expect(() =>
      (options as any).external('./my-image.png', undefined, false),
    ).toThrow('Unknown importer of file module ./my-image.png');
  });

  it('should handle original external array', async () => {
    const plugin = forwardFileImports({ include: /\.png$/ });

    const options = (await plugin.options?.call(context, {
      external: ['my-external'],
    }))!;
    if (typeof options.external !== 'function') {
      throw new Error('options.external is not a function');
    }

    expect(options.external('my-module', '/dev/src/index.ts', false)).toBe(
      false,
    );
    expect(options.external('my-external', '/dev/src/index.ts', false)).toBe(
      true,
    );
    expect(options.external('my-image.png', '/dev/src/index.ts', false)).toBe(
      true,
    );
  });

  describe('with createMockDirectory', () => {
    const mockDir = createMockDirectory();

    beforeEach(() => {
      mockDir.setContent({
        dev: {
          src: {
            'my-module.ts': '',
            dir: { 'my-image.png': 'my-image' },
          },
        },
      });
    });

    it('should extract files', async () => {
      const plugin = forwardFileImports({ include: /\.png$/ });

      const options = (await plugin.options?.call(context, {}))!;
      if (typeof options.external !== 'function') {
        throw new Error('options.external is not a function');
      }

      expect(
        options.external(
          './my-module',
          mockDir.resolve('dev/src/index.ts'),
          false,
        ),
      ).toBe(false);
      expect(
        options.external(
          './my-image.png',
          mockDir.resolve('dev', 'src', 'dir', 'index.ts'),
          false,
        ),
      ).toBe(true);

      const outPath = mockDir.resolve('dev', 'dist', 'dir', 'my-image.png');
      await expect(fs.pathExists(outPath)).resolves.toBe(false);

      await plugin.generateBundle?.call(
        context,
        {
          dir: mockDir.resolve('dev/dist'),
        } as NormalizedOutputOptions,
        {
          ['index.js']: {
            type: 'chunk',
            facadeModuleId: mockDir.resolve('dev/src/index.ts'),
          } as OutputChunk,
        },
        false, // isWrite = false -> no write
      );
      await expect(fs.pathExists(outPath)).resolves.toBe(false);

      await plugin.generateBundle?.call(
        context,
        {
          dir: mockDir.resolve('dev/dist'),
        } as NormalizedOutputOptions,
        {
          // output assets should not cause a write
          ['index.js']: { type: 'asset' } as OutputAsset,
          // missing facadeModuleId should not cause a write either
          ['index2.js']: { type: 'chunk' } as OutputChunk,
        },
        true,
      );
      await expect(fs.pathExists(outPath)).resolves.toBe(false);

      // output chunk + isWrite -> generate files
      await plugin.generateBundle?.call(
        context,
        {
          dir: mockDir.resolve('dev/dist'),
        } as NormalizedOutputOptions,
        {
          ['index.js']: {
            type: 'chunk',
            facadeModuleId: mockDir.resolve('dev/src/index.ts'),
          } as OutputChunk,
        },
        true,
      );
      await expect(fs.pathExists(outPath)).resolves.toBe(true);

      // should not break when triggering another write
      await plugin.generateBundle?.call(
        context,
        {
          file: mockDir.resolve('dev/dist/my-output.js'),
        } as NormalizedOutputOptions,
        {
          ['index.js']: {
            type: 'chunk',
            facadeModuleId: mockDir.resolve('dev/src/index.ts'),
          } as OutputChunk,
        },
        true,
      );
    });
  });
});

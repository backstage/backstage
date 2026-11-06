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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { createCliModule } from './createCliModule';
import {
  CommandVariant,
  findCliPackageContext,
  resolveCommandVariant,
} from './resolveCommandVariant';
import type { CliCommand, CliPackageContext } from './types';

const context: CliPackageContext = {
  dir: '/repo/packages/foo',
  packageJson: { name: '@example/foo', version: '0.0.0' },
};

function variant(
  moduleName: string,
  isEnabled?: CliCommand['isEnabled'],
): CommandVariant {
  return {
    command: {
      path: ['package', 'test'],
      description: `Test from ${moduleName}`,
      isEnabled,
      execute: async () => {},
    },
    module: createCliModule({
      packageJson: { name: moduleName },
      init: async () => {},
    }),
  };
}

describe('resolveCommandVariant', () => {
  it('selects the single enabled variant, or the fallback when none are enabled', async () => {
    const isEnabledA = jest.fn((ctx: CliPackageContext) =>
      ctx.packageJson.name.endsWith('foo'),
    );
    const isEnabledB = jest.fn(async () => false);
    const a = variant('@example/a', isEnabledA);
    const b = variant('@example/b', isEnabledB);
    const fallback = variant('@example/fallback');
    const getContext = jest.fn(async () => context);

    await expect(
      resolveCommandVariant([fallback, a, b], getContext),
    ).resolves.toBe(a.command);
    expect(isEnabledA).toHaveBeenCalledWith(context);
    expect(isEnabledB).toHaveBeenCalledWith(context);

    await expect(
      resolveCommandVariant([b, fallback], getContext),
    ).resolves.toBe(fallback.command);

    // No package context means nothing is enabled, so the fallback is used
    await expect(
      resolveCommandVariant([a, fallback], async () => undefined),
    ).resolves.toBe(fallback.command);
  });

  it('does not look up the package context for plain commands', async () => {
    const plain = variant('@example/plain');
    const getContext = jest.fn(async () => context);

    await expect(resolveCommandVariant([plain], getContext)).resolves.toBe(
      plain.command,
    );
    expect(getContext).not.toHaveBeenCalled();
  });

  it('rejects multiple enabled variants', async () => {
    await expect(
      resolveCommandVariant(
        [
          variant('@example/a', () => true),
          variant('@example/fallback'),
          variant('@example/b', async () => true),
        ],
        async () => context,
      ),
    ).rejects.toMatchObject({
      name: 'InputError',
      message:
        'Command "package test" is enabled by multiple modules for package "@example/foo": "@example/a", "@example/b". Only one module may enable this command per package.',
    });
  });

  it('rejects when nothing is enabled and there is no fallback', async () => {
    const variants = [
      variant('@example/a', () => false),
      variant('@example/b', () => false),
    ];

    await expect(
      resolveCommandVariant(variants, async () => context),
    ).rejects.toMatchObject({
      name: 'NotFoundError',
      message:
        'Command "package test" is not enabled for package "@example/foo". Candidate modules: "@example/a", "@example/b"',
    });

    await expect(
      resolveCommandVariant(variants, async () => undefined),
    ).rejects.toMatchObject({
      name: 'NotFoundError',
      message:
        'Command "package test" is not enabled for the current directory, which is not inside a package. Candidate modules: "@example/a", "@example/b"',
    });
  });
});

describe('findCliPackageContext', () => {
  const mockDir = createMockDirectory();

  it('finds the nearest package.json at or above the directory', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'root', version: '0.0.0' }),
      packages: {
        foo: {
          'package.json': JSON.stringify({
            name: '@example/foo',
            version: '1.0.0',
          }),
          src: { nested: {} },
        },
      },
    });

    await expect(
      findCliPackageContext(mockDir.resolve('packages/foo/src/nested')),
    ).resolves.toEqual({
      dir: mockDir.resolve('packages/foo'),
      packageJson: { name: '@example/foo', version: '1.0.0' },
    });
    await expect(
      findCliPackageContext(mockDir.resolve('packages')),
    ).resolves.toEqual({
      dir: mockDir.path,
      packageJson: { name: 'root', version: '0.0.0' },
    });
  });

  it('reports invalid package.json files', async () => {
    mockDir.setContent({ 'package.json': '{ invalid' });

    await expect(findCliPackageContext(mockDir.path)).rejects.toThrow(
      `Failed to read ${mockDir.resolve('package.json')}`,
    );
  });
});

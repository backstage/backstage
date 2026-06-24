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
import npmPackList from 'npm-packlist';
import {
  compilePackageConfigSchemas,
  productionPack,
  revertProductionPack,
} from './productionPack';

describe('productionPack', () => {
  const mockDir = createMockDirectory();
  const originalDir = process.cwd();

  afterEach(() => {
    process.chdir(originalDir);
    mockDir.clear();
  });

  const packageJson = {
    name: 'test-package',
    version: '1.0.0',
    files: ['config.d.ts'],
    configSchema: 'config.d.ts',
  };
  const configSchema = {
    type: 'object',
    properties: { value: { type: 'string' } },
  };
  const compiledConfigSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    ...configSchema,
  };

  it('should replace TypeScript schemas in dist packages', async () => {
    mockDir.setContent({
      package: {
        'package.json': JSON.stringify(packageJson),
        'config.d.ts': 'export interface Config { value?: string }',
      },
    });

    await productionPack({
      packageDir: mockDir.resolve('package'),
      targetDir: mockDir.resolve('target'),
      configSchema,
    });

    expect(mockDir.content({ path: 'target', shouldReadAsText: true })).toEqual(
      {
        'package.json': `${JSON.stringify(
          {
            ...packageJson,
            files: ['config.schema.json'],
            configSchema: 'config.schema.json',
          },
          null,
          2,
        )}\n`,
        'config.schema.json': `${JSON.stringify(configSchema, null, 2)}\n`,
      },
    );
    expect(mockDir.content({ path: 'package' })).toEqual({
      'package.json': JSON.stringify(packageJson),
      'config.d.ts': 'export interface Config { value?: string }',
    });
  });

  it('should add the generated schema to the package files', async () => {
    mockDir.setContent({
      package: {
        'package.json': JSON.stringify({
          ...packageJson,
          files: ['README.md'],
        }),
        'README.md': 'test package',
        'config.d.ts': 'export interface Config { value?: string }',
      },
    });

    await productionPack({
      packageDir: mockDir.resolve('package'),
      targetDir: mockDir.resolve('target'),
      configSchema,
    });

    const packedContent = mockDir.content({
      path: 'target',
      shouldReadAsText: true,
    }) as Record<string, string>;
    const packedPackage = JSON.parse(packedContent['package.json']);
    expect(packedPackage.files).toEqual(['README.md', 'config.schema.json']);
    expect(packedContent['config.schema.json']).toBeDefined();
  });

  it('should restore TypeScript schemas after packing for publishing', async () => {
    mockDir.setContent({
      package: {
        'package.json': JSON.stringify(packageJson),
        'config.d.ts': 'export interface Config { value?: string }',
      },
    });
    process.chdir(mockDir.resolve('package'));

    await productionPack({ packageDir: mockDir.resolve('package') });

    expect(await mockDir.content({ shouldReadAsText: true })).toEqual({
      package: {
        'config.d.ts': 'export interface Config { value?: string }',
        'config.schema.json': `${JSON.stringify(
          compiledConfigSchema,
          null,
          2,
        )}\n`,
        'package.json': `${JSON.stringify(
          {
            ...packageJson,
            files: ['config.schema.json'],
            configSchema: 'config.schema.json',
          },
          null,
          2,
        )}\n`,
        'package.json-prepack': JSON.stringify(packageJson),
      },
    });
    await expect(
      npmPackList({ path: mockDir.resolve('package') }),
    ).resolves.toEqual(['config.schema.json', 'package.json']);

    await revertProductionPack(mockDir.resolve('package'));

    expect(await mockDir.content()).toEqual({
      package: {
        'package.json': JSON.stringify(packageJson),
        'config.d.ts': 'export interface Config { value?: string }',
      },
    });
  });

  it('should compile multiple package schemas together', async () => {
    mockDir.setContent({
      a: {
        'package.json': JSON.stringify({
          ...packageJson,
          name: 'a',
        }),
        'config.d.ts': 'export interface Config { a?: string }',
      },
      b: {
        'package.json': JSON.stringify({
          ...packageJson,
          name: 'b',
        }),
        'config.d.ts': 'export interface Config { b?: number }',
      },
    });
    process.chdir(mockDir.path);

    const schemas = await compilePackageConfigSchemas([
      {
        name: 'a',
        dir: mockDir.resolve('a'),
        packageJson: { ...packageJson, name: 'a' },
      },
      {
        name: 'b',
        dir: mockDir.resolve('b'),
        packageJson: { ...packageJson, name: 'b' },
      },
    ]);

    expect(schemas.get('a')).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: { a: { type: 'string' } },
    });
    expect(schemas.get('b')).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: { b: { type: 'number' } },
    });
  });
});

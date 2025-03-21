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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { collectConfigSchemas } from './collect';
import path from 'path';

// cwd must be restored
const origDir = process.cwd();
afterAll(() => {
  process.chdir(origDir);
});

const mockSchema = {
  type: 'object',
  properties: {
    key: {
      type: 'string',
      visibility: 'frontend',
    },
  },
};

describe('collectConfigSchemas', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    mockDir.clear();
  });

  it('should not find any schemas without packages', async () => {
    mockDir.setContent({
      'lerna.json': JSON.stringify({
        packages: ['packages/*'],
      }),
    });

    await expect(collectConfigSchemas([], [])).resolves.toEqual([]);
  });

  it('should find schema in a local package', async () => {
    mockDir.setContent({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            configSchema: mockSchema,
          }),
        },
      },
    });
    process.chdir(mockDir.path);

    await expect(collectConfigSchemas(['a'], [])).resolves.toEqual([
      {
        path: path.join('node_modules', 'a', 'package.json'),
        value: mockSchema,
        packageName: 'a',
      },
    ]);
  });

  it('should find schema at explicit package path', async () => {
    mockDir.setContent({
      root: {
        'package.json': JSON.stringify({
          name: 'root',
          configSchema: mockSchema,
        }),
      },
    });
    process.chdir(mockDir.path);

    await expect(
      collectConfigSchemas([], [path.join('root', 'package.json')]),
    ).resolves.toEqual([
      {
        path: path.join('root', 'package.json'),
        value: mockSchema,
        packageName: 'root',
      },
    ]);
  });

  it('should not include schemas for backend-common if theres a backend-defaults package', async () => {
    mockDir.setContent({
      root: {
        'package.json': JSON.stringify({
          name: 'root',
          dependencies: {
            '@backstage/backend-common': '1',
            '@backstage/backend-defaults': '1',
          },
          configSchema: { ...mockSchema, title: 'root' },
        }),
      },
      node_modules: {
        '@backstage': {
          'backend-common': {
            'package.json': JSON.stringify({
              name: '@backstage/backend-common',
              version: '1',
              configSchema: { ...mockSchema, title: 'backend-common' },
            }),
          },
          'backend-defaults': {
            'package.json': JSON.stringify({
              name: '@backstage/backend-defaults',
              version: '1',
              configSchema: { ...mockSchema, title: 'backend-defaults' },
            }),
          },
        },
      },
    });

    process.chdir(mockDir.path);

    await expect(
      collectConfigSchemas(['root'], [path.join('root', 'package.json')]),
    ).resolves.toEqual([
      {
        path: path.join('root', 'package.json'),
        value: { ...mockSchema, title: 'root' },
        packageName: 'root',
      },
      {
        path: path.join(
          'node_modules',
          '@backstage',
          'backend-defaults',
          'package.json',
        ),
        value: { ...mockSchema, title: 'backend-defaults' },
        packageName: '@backstage/backend-defaults',
      },
    ]);
  });

  it('should find schema in transitive dependencies and explicit path', async () => {
    mockDir.setContent({
      root: {
        'package.json': JSON.stringify({
          name: 'root',
          configSchema: { ...mockSchema, title: 'root' },
        }),
      },
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: { b: '0.0.0', '@backstage/mock': '0.0.0' },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            dependencies: {
              c1: '0.0.0',
              c2: '0.0.0',
            },
            devDependencies: {
              '@backstage/mock': '0.0.0',
            },
            configSchema: { ...mockSchema, title: 'b' },
          }),
        },
        c1: {
          'package.json': JSON.stringify({
            name: 'c1',
            dependencies: { d1: '0.0.0' },
            configSchema: { ...mockSchema, title: 'c1' },
          }),
        },
        c2: {
          'package.json': JSON.stringify({
            name: 'c2',
            dependencies: { d2: '0.0.0' },
          }),
        },
        d1: {
          'package.json': JSON.stringify({
            name: 'd1',
            dependencies: {},
            configSchema: { ...mockSchema, title: 'd1' },
          }),
        },
        d2: {
          'package.json': JSON.stringify({
            name: 'd2',
            dependencies: {},
            configSchema: { ...mockSchema, title: 'd2' },
          }),
        },
      },
    });
    process.chdir(mockDir.path);

    await expect(
      collectConfigSchemas(['a'], [path.join('root', 'package.json')]),
    ).resolves.toEqual(
      expect.arrayContaining([
        {
          path: path.join('node_modules', 'b', 'package.json'),
          value: { ...mockSchema, title: 'b' },
          packageName: 'b',
        },
        {
          path: path.join('node_modules', 'c1', 'package.json'),
          value: { ...mockSchema, title: 'c1' },
          packageName: 'c1',
        },
        {
          path: path.join('node_modules', 'd1', 'package.json'),
          value: { ...mockSchema, title: 'd1' },
          packageName: 'd1',
        },
        {
          path: path.join('root', 'package.json'),
          value: { ...mockSchema, title: 'root' },
          packageName: 'root',
        },
      ]),
    );
  });

  it('should schema of different types', async () => {
    mockDir.setContent({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            configSchema: { ...mockSchema, title: 'inline' },
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            configSchema: 'schema.json',
          }),
          'schema.json': JSON.stringify({ ...mockSchema, title: 'external' }),
        },
        c: {
          'package.json': JSON.stringify({
            name: 'c',
            configSchema: 'schema.d.ts',
          }),
          'schema.d.ts': `
            export interface Config {
              /** @visibility secret */
              tsKey: string
            }
          `,
        },
      },
    });
    process.chdir(mockDir.path);

    await expect(collectConfigSchemas(['a', 'b', 'c'], [])).resolves.toEqual(
      expect.arrayContaining([
        {
          path: path.join('node_modules', 'a', 'package.json'),
          value: { ...mockSchema, title: 'inline' },
          packageName: 'a',
        },
        {
          path: path.join('node_modules', 'b', 'schema.json'),
          value: { ...mockSchema, title: 'external' },
          packageName: 'b',
        },
        {
          path: path.join('node_modules', 'c', 'schema.d.ts'),
          value: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'object',
            properties: {
              tsKey: {
                type: 'string',
                visibility: 'secret',
              },
            },
            required: ['tsKey'],
          },
          packageName: 'c',
        },
      ]),
    );
  });

  it('should load schema from different package versions', async () => {
    mockDir.setContent({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            dependencies: {
              b: '1',
              c: '1',
            },
            configSchema: mockSchema,
          }),
        },
        b: {
          'package.json': JSON.stringify({
            name: 'b',
            version: '1',
            dependencies: {
              c: '2',
            },
            configSchema: { ...mockSchema, title: 'b' },
          }),
          node_modules: {
            c: {
              'package.json': JSON.stringify({
                name: 'c',
                version: '2',
                configSchema: { ...mockSchema, title: 'c2' },
              }),
            },
          },
        },
        c: {
          'package.json': JSON.stringify({
            name: 'c',
            version: '1',
            configSchema: { ...mockSchema, title: 'c1' },
          }),
        },
      },
    });
    process.chdir(mockDir.path);

    await expect(collectConfigSchemas(['a'], [])).resolves.toEqual(
      expect.arrayContaining([
        {
          path: path.join('node_modules', 'a', 'package.json'),
          value: mockSchema,
          packageName: 'a',
        },
        {
          path: path.join('node_modules', 'b', 'package.json'),
          value: { ...mockSchema, title: 'b' },
          packageName: 'b',
        },
        {
          path: path.join('node_modules', 'c', 'package.json'),
          value: { ...mockSchema, title: 'c1' },
          packageName: 'c',
        },
        {
          path: path.join(
            'node_modules',
            'b',
            'node_modules',
            'c',
            'package.json',
          ),
          value: { ...mockSchema, title: 'c2' },
          packageName: 'c',
        },
      ]),
    );
  });

  it('should not allow unknown schema file types', async () => {
    mockDir.setContent({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            configSchema: 'schema.yaml',
          }),
          'schema.yaml': mockSchema,
        },
      },
    });
    process.chdir(mockDir.path);

    await expect(collectConfigSchemas(['a'], [])).rejects.toThrow(
      'Config schema files must be .json or .d.ts, got schema.yaml',
    );
  });

  it('should reject typescript config declaration without a Config type', async () => {
    mockDir.setContent({
      node_modules: {
        a: {
          'package.json': JSON.stringify({
            name: 'a',
            configSchema: 'schema.d.ts',
          }),
          'schema.d.ts': `export interface NotConfig {}`,
        },
      },
    });
    process.chdir(mockDir.path);

    await expect(collectConfigSchemas(['a'], [])).rejects.toThrow(
      `Invalid schema in ${path.join(
        'node_modules',
        'a',
        'schema.d.ts',
      )}, missing Config export`,
    );
  });
});

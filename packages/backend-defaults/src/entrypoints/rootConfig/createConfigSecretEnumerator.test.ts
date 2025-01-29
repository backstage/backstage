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

import { loadConfigSchema } from '@backstage/config-loader';
import {
  createConfigSecretEnumerator,
  findClosestPackageJson,
} from './createConfigSecretEnumerator';
import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import path from 'path';

// cwd must be restored
const origDir = process.cwd();
const argv = process.argv;
afterAll(() => {
  process.chdir(origDir);
  process.argv = argv;
});

const mockSchema = {
  type: 'object',
  properties: {
    key: {
      type: 'string',
      visibility: 'frontend',
    },
    secret: {
      type: 'string',
      visibility: 'secret',
    },
  },
};

describe('createConfigSecretEnumerator', () => {
  const mockDir = createMockDirectory();

  const logger = mockServices.logger.mock();

  beforeEach(() => {
    process.chdir(__dirname);
    process.argv = ['node', 'src/index'];
  });

  afterEach(() => {
    mockDir.clear();
  });

  it('should enumerate secrets', async () => {
    const enumerate = await createConfigSecretEnumerator({
      logger,
      // This is a little fragile, as it requires a relative path, open to other ideas here.
      dir: path.resolve('../../../../../packages/backend'),
    });
    const secrets = enumerate(
      mockServices.rootConfig({
        data: {
          backend: { auth: { keys: [{ secret: 'my-secret-password' }] } },
        },
      }),
    );
    expect(Array.from(secrets)).toEqual(['my-secret-password']);
  }, 20_000); // Bit higher timeout since we're loading all config schemas in the repo

  it('should find schema from process arguments', async () => {
    mockDir.setContent({
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          dependencies: {
            b: '1',
            c: '1',
          },
        }),
        node_modules: {
          c: {
            'package.json': JSON.stringify({
              name: 'c',
              version: '2',
              configSchema: {
                ...mockSchema,
                title: 'c2',
                properties: {
                  'secret-c': {
                    type: 'string',
                    visibility: 'secret',
                  },
                },
              },
            }),
          },
          b: {
            'package.json': JSON.stringify({
              name: 'b',
              version: '2',
              configSchema: {
                ...mockSchema,
                title: 'b2',
                properties: {
                  'secret-b': { type: 'string', visibility: 'secret' },
                },
              },
            }),
          },
        },
      },
      b: {
        'package.json': JSON.stringify({
          name: 'b',
          version: '1',
          dependencies: {
            c: '2',
          },
          configSchema: {
            ...mockSchema,
            title: 'b',
            properties: {
              'secret-b': {
                type: 'string',
                visibility: 'secret',
              },
            },
          },
        }),
        node_modules: {
          c: {
            'package.json': JSON.stringify({
              name: 'c',
              version: '2',
              configSchema: {
                ...mockSchema,
                title: 'c2',
                properties: {
                  'secret-c': {
                    type: 'string',
                    visibility: 'secret',
                  },
                },
              },
            }),
          },
        },
      },
      c: {
        'package.json': JSON.stringify({
          name: 'c',
          version: '1',
          configSchema: {
            ...mockSchema,
            title: 'c1',
            properties: {
              'property-c': {
                type: 'string',
                visibility: 'frontend',
              },
            },
          },
        }),
      },
    });
    process.argv = ['node', 'a/src/index'];
    process.chdir(mockDir.path);

    const enumerate = await createConfigSecretEnumerator({
      logger,
    });
    const secrets = enumerate(
      mockServices.rootConfig({
        data: {
          secret: 'my-secret-password',
          'property-c': 'not-secret',
          'secret-b': 'secret-b',
          'secret-c': 'secret-c',
        },
      }),
    );

    expect(Array.from(secrets)).toEqual(['secret-b', 'secret-c']);
  });

  it('should find schema in a local package', async () => {
    mockDir.setContent({
      a: {
        'package.json': JSON.stringify({
          name: 'a',
          dependencies: {
            b: '1',
            c: '1',
          },
        }),
        node_modules: {
          c: {
            'package.json': JSON.stringify({
              name: 'c',
              version: '2',
              configSchema: {
                ...mockSchema,
                title: 'c2',
                properties: {
                  'secret-c': {
                    type: 'string',
                    visibility: 'secret',
                  },
                },
              },
            }),
          },
          b: {
            'package.json': JSON.stringify({
              name: 'b',
              version: '2',
              configSchema: {
                ...mockSchema,
                title: 'b2',
                properties: {
                  'secret-b': { type: 'string', visibility: 'secret' },
                },
              },
            }),
          },
        },
      },
    });

    process.chdir(path.join(mockDir.path, 'a'));
    process.argv = ['node', 'src/index'];

    const enumerate = await createConfigSecretEnumerator({
      logger,
    });
    const secrets = enumerate(
      mockServices.rootConfig({
        data: {
          'property-c': 'not-secret',
          'secret-b': 'secret-b',
          'secret-c': 'secret-c',
        },
      }),
    );

    expect(Array.from(secrets)).toEqual(['secret-b', 'secret-c']);
  });

  it('should enumerate secrets with explicit schema', async () => {
    mockDir.addContent({
      'package.json': JSON.stringify({
        name: 'a',
      }),
    });
    process.chdir(mockDir.path);
    const enumerate = await createConfigSecretEnumerator({
      logger,
      dir: mockDir.path,
      schema: await loadConfigSchema({
        serialized: {
          schemas: [
            {
              value: {
                type: 'object',
                properties: {
                  secret: {
                    visibility: 'secret',
                    type: 'string',
                  },
                },
              },
              path: '/mock',
            },
          ],
          backstageConfigSchemaVersion: 1,
        },
      }),
    });

    const secrets = enumerate(
      mockServices.rootConfig({
        data: {
          secret: 'my-secret',
          other: 'not-secret',
        },
      }),
    );
    expect(Array.from(secrets)).toEqual(['my-secret']);
  });
});

describe('findClosestPackageJson', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    process.chdir(__dirname);
  });

  afterEach(() => {
    mockDir.clear();
  });

  it('should find the root package.json', () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'root',
      }),
      a: {
        b: {
          'package.json': JSON.stringify({
            name: 'b',
          }),
        },
      },
    });

    const rootPath = findClosestPackageJson(path.join(mockDir.path));

    expect(rootPath).toBe(path.join(mockDir.path));
  });

  it('should find the current package.json', () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'root',
      }),
      a: {
        b: {
          'package.json': JSON.stringify({
            name: 'b',
          }),
        },
      },
    });

    const rootPath = findClosestPackageJson(path.join(mockDir.path, 'a', 'b'));

    expect(rootPath).toBe(path.join(mockDir.path, 'a', 'b'));
  });

  it('should be able to navigate up to the root package.json', () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'root',
      }),
      a: {
        b: {
          'package.json': JSON.stringify({
            name: 'b',
          }),
          src: {
            'index.ts': 'console.log("Hello, world!")',
          },
        },
      },
    });

    const rootPath = findClosestPackageJson(
      path.join(mockDir.path, 'a', 'b', 'src'),
    );

    expect(rootPath).toBe(path.join(mockDir.path, 'a', 'b'));
  });

  it('should return undefined if no package.json found', () => {
    mockDir.setContent({
      'not-package.json': JSON.stringify({
        name: 'root',
      }),
      a: {
        b: {
          'package.json': JSON.stringify({
            name: 'b',
          }),
          src: {
            'index.ts': 'console.log("Hello, world!")',
          },
        },
      },
    });

    const rootPath = findClosestPackageJson(path.join(mockDir.path, 'a'));

    expect(rootPath).toBe(undefined);
  });
});

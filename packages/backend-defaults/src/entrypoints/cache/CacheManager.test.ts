/*
 * Copyright 2024 The Backstage Authors
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

import { mockServices, TestCaches } from '@backstage/backend-test-utils';
import KeyvRedis, { createCluster } from '@keyv/redis';
import KeyvValkey from '@keyv/valkey';
import KeyvMemcache from '@keyv/memcache';
import { CacheManager } from './CacheManager';

// This test is in a separate file because the main test file uses other mocking
// that might interfere with this one.

// Contrived code because it's hard to spy on a default export
jest.mock('@keyv/redis', () => {
  const Actual = jest.requireActual('@keyv/redis');
  const DefaultConstructor = Actual.default;
  return {
    ...Actual,
    __esModule: true,
    default: jest.fn((...args: any[]) => new DefaultConstructor(...args)),
    createCluster: jest.fn(),
  };
});
jest.mock('@keyv/valkey', () => {
  const Actual = jest.requireActual('@keyv/valkey');
  const DefaultConstructor = Actual.default;
  return {
    ...Actual,
    __esModule: true,
    default: jest.fn((...args: any[]) => new DefaultConstructor(...args)),
    createCluster: jest.fn(),
  };
});
jest.mock('@keyv/memcache', () => {
  const Actual = jest.requireActual('@keyv/memcache');
  const DefaultConstructor = Actual.default;
  return {
    ...Actual,
    __esModule: true,
    default: jest.fn((...args: any[]) => new DefaultConstructor(...args)),
  };
});

describe('CacheManager integration', () => {
  const caches = TestCaches.create();

  afterEach(jest.clearAllMocks);

  it.each(caches.eachSupportedId())(
    'only creates one underlying connection per plugin, %p',
    async cacheId => {
      const { store, connection } = await caches.init(cacheId);

      const manager = CacheManager.fromConfig(
        mockServices.rootConfig({
          data: { backend: { cache: { store, connection } } },
        }),
      );

      manager.forPlugin('p1');
      manager.forPlugin('p1').withOptions({ defaultTtl: 200 });
      manager.forPlugin('p2');
      manager.forPlugin('p3').withOptions({});

      if (store === 'redis') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(KeyvRedis).toHaveBeenCalledTimes(3);
      } else if (store === 'memcache') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(KeyvMemcache).toHaveBeenCalledTimes(3);
      } else if (store === 'valkey') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(KeyvValkey).toHaveBeenCalledTimes(3);
      }
    },
  );

  it.each(caches.eachSupportedId())(
    'interacts correctly with store, %p',
    async cacheId => {
      const { store, connection } = await caches.init(cacheId);

      const manager = CacheManager.fromConfig(
        mockServices.rootConfig({
          data: {
            backend: { cache: { store, connection } },
          },
        }),
      );

      const plugin1 = manager.forPlugin('p1');
      const plugin2a = manager.forPlugin('p2');
      const plugin2b = manager
        .forPlugin('p2')
        .withOptions({ defaultTtl: 2000 });

      await plugin1.set('a', 'plugin1');
      await plugin2a.set('a', 'plugin2a');
      await plugin2b.set('a', 'plugin2b');

      await expect(plugin1.get('a')).resolves.toBe('plugin1');
      await expect(plugin2a.get('a')).resolves.toBe('plugin2b');
      await expect(plugin2b.get('a')).resolves.toBe('plugin2b');
    },
  );

  it.each(caches.eachSupportedId())(
    'supports both milliseconds and human durations throughout, %p',
    async cacheId => {
      const { store, connection } = await caches.init(cacheId);

      for (const defaultTtl of [200, { milliseconds: 200 }]) {
        const manager = CacheManager.fromConfig(
          mockServices.rootConfig({
            data: {
              backend: {
                cache: {
                  store,
                  connection,
                  defaultTtl,
                },
              },
            },
          }),
        ).forPlugin('p');

        const defaultClient = manager;
        const numberOverrideClient = manager.withOptions({ defaultTtl: 400 });
        const durationOverrideClient = manager.withOptions({
          defaultTtl: { milliseconds: 400 },
        });

        await defaultClient.set('a', 'x');
        await defaultClient.set('b', 'x');
        await numberOverrideClient.set('c', 'x');
        await durationOverrideClient.set('d', 'x');
        await defaultClient.set('e', 'x', { ttl: 400 });
        await defaultClient.set('f', 'x', { ttl: { milliseconds: 400 } });

        await expect(defaultClient.get('a')).resolves.toBe('x');
        await expect(defaultClient.get('b')).resolves.toBe('x');
        await expect(defaultClient.get('c')).resolves.toBe('x');
        await expect(defaultClient.get('d')).resolves.toBe('x');
        await expect(defaultClient.get('e')).resolves.toBe('x');
        await expect(defaultClient.get('f')).resolves.toBe('x');

        await new Promise(resolve => setTimeout(resolve, 50 + 200));

        await expect(defaultClient.get('a')).resolves.toBeUndefined();
        await expect(defaultClient.get('b')).resolves.toBeUndefined();
        await expect(defaultClient.get('c')).resolves.toBe('x');
        await expect(defaultClient.get('d')).resolves.toBe('x');
        await expect(defaultClient.get('e')).resolves.toBe('x');
        await expect(defaultClient.get('f')).resolves.toBe('x');

        await new Promise(resolve => setTimeout(resolve, 200));

        await expect(defaultClient.get('a')).resolves.toBeUndefined();
        await expect(defaultClient.get('b')).resolves.toBeUndefined();
        await expect(defaultClient.get('c')).resolves.toBeUndefined();
        await expect(defaultClient.get('d')).resolves.toBeUndefined();
        await expect(defaultClient.get('e')).resolves.toBeUndefined();
        await expect(defaultClient.get('f')).resolves.toBeUndefined();
      }
    },
  );

  it('rejects invalid defaultTtl', () => {
    expect(() =>
      CacheManager.fromConfig(
        mockServices.rootConfig({
          data: {
            backend: {
              cache: {
                store: 'memory',
              },
            },
          },
        }),
      ),
    ).not.toThrow();

    expect(() =>
      CacheManager.fromConfig(
        mockServices.rootConfig({
          data: {
            backend: {
              cache: {
                store: 'memory',
                defaultTtl: 'hello',
              },
            },
          },
        }),
      ),
    ).toThrow(/Invalid duration 'hello' in config/);
  });
});

describe('CacheManager store options', () => {
  afterEach(jest.clearAllMocks);

  it('uses default options when no store-specific config exists', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
            },
          },
        },
      }),
    );

    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith('redis://localhost:6379', {
      keyPrefixSeparator: ':',
    });
  });

  it('defaults to non-clustered mode when cluster config is missing root nodes', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                cluster: {},
              },
            },
          },
        },
      }),
    );
    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith('redis://localhost:6379', {
      keyPrefixSeparator: ':',
    });
  });

  it('uses cluster config when present', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                cluster: {
                  rootNodes: [{ url: 'redis://localhost:6379' }],
                },
              },
            },
          },
        },
      }),
    );
    manager.forPlugin('p1');

    expect(createCluster).toHaveBeenCalledWith({
      rootNodes: [{ url: 'redis://localhost:6379' }],
      defaults: undefined,
    });
  });

  it('respects client config for non-clustered mode', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  keyPrefixSeparator: '!',
                },
              },
            },
          },
        },
      }),
    );
    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith('redis://localhost:6379', {
      keyPrefixSeparator: '!',
    });
  });

  it('accepts client config for clustered mode', () => {
    (createCluster as jest.Mock).mockReturnValue({
      url: 'redis://localhost:6379',
    });
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  keyPrefixSeparator: '!',
                },
                cluster: {
                  rootNodes: [{ url: 'redis://localhost:6379' }],
                },
              },
            },
          },
        },
      }),
    );
    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'redis://localhost:6379',
      }),
      {
        keyPrefixSeparator: '!',
      },
    );
  });

  it('passes socket keepalive options to the redis client', () => {
    const logger = mockServices.logger.mock();
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  socket: {
                    keepAliveInitialDelay: 1234,
                  },
                },
              },
            },
          },
        },
      }),
      { logger },
    );

    manager.forPlugin('p1');

    const childLogger = (logger.child as jest.Mock).mock.results[0]?.value;
    expect(childLogger?.warn).toHaveBeenCalledWith(
      'Socket keepalive initial delay is set without keepalive enabled. Enabling keepalive.',
    );
    expect(KeyvRedis).toHaveBeenCalledWith(
      {
        url: 'redis://localhost:6379',
        socket: expect.objectContaining({
          keepAlive: true,
          keepAliveInitialDelay: 1234,
        }),
      },
      expect.objectContaining({ keyPrefixSeparator: ':' }),
    );
  });

  it('passes boolean keepAlive to the redis client', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  socket: {
                    keepAlive: true,
                  },
                },
              },
            },
          },
        },
      }),
    );

    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith(
      {
        url: 'redis://localhost:6379',
        socket: expect.objectContaining({ keepAlive: true }),
      },
      expect.objectContaining({ keyPrefixSeparator: ':' }),
    );
  });

  it('throws on numeric keepAlive values', () => {
    expect(() =>
      CacheManager.fromConfig(
        mockServices.rootConfig({
          data: {
            backend: {
              cache: {
                store: 'redis',
                connection: 'redis://localhost:6379',
                redis: {
                  client: {
                    socket: {
                      keepAlive: 7000,
                    },
                  },
                },
              },
            },
          },
        }),
      ),
    ).toThrow(
      "Unable to convert config value for key 'backend.cache.redis.client.socket.keepAlive' in 'mock-config' to a boolean",
    );
  });

  it('ignores keepAliveInitialDelay when keepAlive is false', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  socket: {
                    keepAlive: false,
                    keepAliveInitialDelay: 5000,
                  },
                },
              },
            },
          },
        },
      }),
    );

    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith(
      {
        url: 'redis://localhost:6379',
        socket: expect.objectContaining({ keepAlive: false }),
      },
      expect.objectContaining({ keyPrefixSeparator: ':' }),
    );
  });

  it('passes ping interval and socket timeout to the redis client', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  pingInterval: 15000,
                  socket: {
                    socketTimeout: 20000,
                  },
                },
              },
            },
          },
        },
      }),
    );

    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith(
      {
        url: 'redis://localhost:6379',
        pingInterval: 15000,
        socket: expect.objectContaining({
          socketTimeout: 20000,
        }),
      },
      expect.objectContaining({ keyPrefixSeparator: ':' }),
    );

    const connection = (KeyvRedis as jest.Mock).mock.calls[0][0];
    expect(connection.socket.reconnectStrategy).toBeUndefined();
  });

  it('passes reconnect strategy options to the redis client', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  pingInterval: 15000,
                  socket: {
                    socketTimeout: 20000,
                    reconnectStrategy: {
                      baseDelayMs: 100,
                      maxDelayMs: 2000,
                      jitterMs: 0,
                      maxRetries: 20,
                      stopOnSocketTimeout: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    );

    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledWith(
      {
        url: 'redis://localhost:6379',
        pingInterval: 15000,
        socket: expect.objectContaining({
          socketTimeout: 20000,
          reconnectStrategy: expect.any(Function),
        }),
      },
      expect.objectContaining({ keyPrefixSeparator: ':' }),
    );

    const connection = (KeyvRedis as jest.Mock).mock.calls[0][0];
    const strategy = connection.socket.reconnectStrategy;
    const socketTimeoutError = new Error('timeout');
    socketTimeoutError.name = 'SocketTimeoutError';

    expect(strategy(1, new Error('boom'))).toBe(200);
    expect(strategy(10, new Error('boom'))).toBe(2000);
    expect(strategy(21, new Error('boom'))).toBe(false);
    expect(strategy(1, socketTimeoutError)).toBe(false);
  });

  it('recreates redis store after socket timeout error', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
            },
          },
        },
      }),
    );

    manager.forPlugin('p1');

    const store = (KeyvRedis as jest.Mock).mock.results[0]?.value as {
      emit?: (event: string, error: Error) => void;
    };
    const socketTimeoutError = new Error('timeout');
    socketTimeoutError.name = 'SocketTimeoutError';
    store.emit?.('error', socketTimeoutError);

    manager.forPlugin('p1');

    expect(KeyvRedis).toHaveBeenCalledTimes(2);
  });

  it('reconnects on socket timeout when stopOnSocketTimeout is false', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  socket: {
                    reconnectStrategy: {
                      stopOnSocketTimeout: false,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    );

    manager.forPlugin('p1');

    const connection = (KeyvRedis as jest.Mock).mock.calls[0][0];
    const strategy = connection.socket.reconnectStrategy;
    const socketTimeoutError = new Error('timeout');
    socketTimeoutError.name = 'SocketTimeoutError';

    expect(strategy(1, socketTimeoutError)).toBe(200);
    randomSpy.mockRestore();
  });

  it('merges socket options into redis cluster defaults', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  socket: {
                    keepAliveInitialDelay: 4242,
                  },
                },
                cluster: {
                  rootNodes: [{ url: 'redis://localhost:6379' }],
                },
              },
            },
          },
        },
      }),
    );

    manager.forPlugin('p1');

    expect(createCluster).toHaveBeenCalledWith({
      rootNodes: [{ url: 'redis://localhost:6379' }],
      defaults: { socket: { keepAlive: true, keepAliveInitialDelay: 4242 } },
    });
  });

  it('merges ping interval and socket timeout into redis cluster defaults', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  pingInterval: 10000,
                  socket: {
                    socketTimeout: 12000,
                  },
                },
                cluster: {
                  rootNodes: [{ url: 'redis://localhost:6379' }],
                },
              },
            },
          },
        },
      }),
    );

    manager.forPlugin('p1');

    expect(createCluster).toHaveBeenCalledWith({
      rootNodes: [{ url: 'redis://localhost:6379' }],
      defaults: {
        pingInterval: 10000,
        socket: {
          socketTimeout: 12000,
        },
      },
    });
  });

  it('merges reconnect strategy into redis cluster defaults', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
              redis: {
                client: {
                  pingInterval: 10000,
                  socket: {
                    socketTimeout: 12000,
                    reconnectStrategy: {
                      baseDelayMs: 100,
                    },
                  },
                },
                cluster: {
                  rootNodes: [{ url: 'redis://localhost:6379' }],
                },
              },
            },
          },
        },
      }),
    );

    manager.forPlugin('p1');

    expect(createCluster).toHaveBeenCalledWith({
      rootNodes: [{ url: 'redis://localhost:6379' }],
      defaults: {
        pingInterval: 10000,
        socket: {
          socketTimeout: 12000,
          reconnectStrategy: expect.any(Function),
        },
      },
    });
  });

  it('correctly applies namespace configuration to redis and valkey stores', () => {
    const testCases = [
      {
        store: 'redis',
        client: {
          namespace: 'my-app',
          keyPrefixSeparator: ':',
        },
      },
      { store: 'valkey', client: { keyPrefix: 'my-app:' } },
    ];

    testCases.forEach(({ store, client }) => {
      const manager = CacheManager.fromConfig(
        mockServices.rootConfig({
          data: {
            backend: {
              cache: {
                store,
                connection: 'redis://localhost:6379',
                [store]: {
                  client,
                },
              },
            },
          },
        }),
      );

      manager.forPlugin('testPlugin');

      if (store === 'redis') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(KeyvRedis).toHaveBeenCalledWith(
          'redis://localhost:6379',
          client,
        );
      } else if (store === 'valkey') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(KeyvValkey).toHaveBeenCalledWith(
          'redis://localhost:6379',
          client,
        );
      }
    });
  });

  it('falls back to pluginId when no namespace is configured', () => {
    const manager = CacheManager.fromConfig(
      mockServices.rootConfig({
        data: {
          backend: {
            cache: {
              store: 'redis',
              connection: 'redis://localhost:6379',
            },
          },
        },
      }),
    );

    manager.forPlugin('testPlugin');

    expect(KeyvRedis).toHaveBeenCalledWith('redis://localhost:6379', {
      keyPrefixSeparator: ':',
    });
  });

  describe('Namespace construction', () => {
    it('returns pluginId when no store options are provided', () => {
      const result = (CacheManager as any).constructNamespace(
        'testPlugin',
        undefined,
      );
      expect(result).toBe('testPlugin');
    });

    it.each([
      {
        type: 'redis',
        field: 'namespace',
        client: { keyPrefixSeparator: ':' },
      },
      { type: 'valkey', field: 'keyPrefix', client: {} },
    ])(
      'returns pluginId when store options have no $field for $type',
      ({ type, client }) => {
        const storeOptions = {
          type,
          client,
        };
        const result = (CacheManager as any).constructNamespace(
          'testPlugin',
          storeOptions,
        );
        expect(result).toBe('testPlugin');
      },
    );

    it('combines namespace and pluginId with default separator for redis', () => {
      const storeOptions = {
        type: 'redis',
        client: {
          namespace: 'my-app',
          keyPrefixSeparator: ':',
        },
      };
      const result = (CacheManager as any).constructNamespace(
        'testPlugin',
        storeOptions,
      );
      expect(result).toBe('my-app:testPlugin');
    });

    it('combines namespace and pluginId with custom separator for redis', () => {
      const storeOptions = {
        type: 'redis',
        client: {
          namespace: 'my-app',
          keyPrefixSeparator: '-',
        },
      };
      const result = (CacheManager as any).constructNamespace(
        'testPlugin',
        storeOptions,
      );
      expect(result).toBe('my-app-testPlugin');
    });

    it('uses default separator when keyPrefixSeparator is not provided for redis', () => {
      const storeOptions = {
        type: 'redis',
        client: {
          namespace: 'my-app',
        },
      };
      const result = (CacheManager as any).constructNamespace(
        'testPlugin',
        storeOptions,
      );
      expect(result).toBe('my-app:testPlugin');
    });

    it('uses keyPrefix for valkey', () => {
      const storeOptions = {
        type: 'valkey',
        client: {
          keyPrefix: 'my-app:',
        },
      };
      const result = (CacheManager as any).constructNamespace(
        'testPlugin',
        storeOptions,
      );
      expect(result).toBe('my-app:testPlugin');
    });

    it('handles empty namespace by falling back to pluginId', () => {
      const storeOptions = {
        client: {
          namespace: '',
          keyPrefixSeparator: ':',
        },
      };
      const result = (CacheManager as any).constructNamespace(
        'testPlugin',
        storeOptions,
      );
      expect(result).toBe('testPlugin');
    });
  });
});

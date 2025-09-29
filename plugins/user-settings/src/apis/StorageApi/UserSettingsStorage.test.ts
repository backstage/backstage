/*
 * Copyright 2022 The Backstage Authors
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

import {
  DiscoveryApi,
  ErrorApi,
  FetchApi,
  StorageApi,
} from '@backstage/core-plugin-api';
import {
  MockFetchApi,
  mockApis,
  registerMswTestHooks,
} from '@backstage/test-utils';
import { createDeferred } from '@backstage/types';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { UserSettingsStorage } from './UserSettingsStorage';

describe('Persistent Storage API', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  const mockBaseUrl = 'http://backstage:9191/api';
  const mockErrorApi = { post: jest.fn(), error$: jest.fn() };
  const mockDiscoveryApi = {
    getBaseUrl: async () => mockBaseUrl,
  };
  const mockIdentityApi = mockApis.identity({ token: 'a-token' });
  const mockIdentityApiFallback = mockApis.identity();

  const createPersistentStorage = (args: {
    fetchApi?: FetchApi;
    discoveryApi?: DiscoveryApi;
    errorApi?: ErrorApi;
    namespace: string;
  }): StorageApi => {
    return UserSettingsStorage.create({
      errorApi: mockErrorApi,
      fetchApi: new MockFetchApi(),
      discoveryApi: mockDiscoveryApi,
      identityApi: mockIdentityApi,
      ...args,
    });
  };

  const createPersistentStorageFallback = (args: {
    fetchApi?: FetchApi;
    discoveryApi?: DiscoveryApi;
    errorApi?: ErrorApi;
    namespace: string;
  }): StorageApi => {
    return UserSettingsStorage.create({
      errorApi: mockErrorApi,
      fetchApi: new MockFetchApi(),
      discoveryApi: mockDiscoveryApi,
      identityApi: mockIdentityApiFallback,
      ...args,
    });
  };

  afterEach(async () => {
    // Wait for server callbacks to settle before clearing the handlers.
    // DataLoader delay is 10ms, so this should be plenty.
    await new Promise(resolve => setTimeout(resolve, 100));

    jest.clearAllMocks();
    server.resetHandlers();
  });

  it('should return undefined for values which are unset', async () => {
    const storage = createPersistentStorage({ namespace: 'undefined' });

    expect(storage.snapshot('myfakekey').value).toBeUndefined();
    expect(storage.snapshot('myfakekey')).toEqual({
      key: 'myfakekey',
      presence: 'unknown',
      value: undefined,
    });
  });

  it('should allow setting of a simple data structure', async () => {
    const storage = createPersistentStorage({ namespace: 'simple' });
    const dummyValue = 'a';

    server.use(
      rest.put(
        `${mockBaseUrl}/buckets/:bucket/keys/:key`,
        async (req, res, ctx) => {
          const body = await req.json();
          const data = { value: dummyValue };

          expect(body).toEqual(data);

          return res(ctx.json(data));
        },
      ),
    );

    await storage.set('my-key', dummyValue);
  });

  it('should allow setting of a complex data structure', async () => {
    const storage = createPersistentStorage({ namespace: 'complex' });
    const dummyValue = {
      some: 'nice data',
      with: { nested: 'values', nice: true },
    };

    server.use(
      rest.put(
        `${mockBaseUrl}/buckets/:bucket/keys/:key`,
        async (req, res, ctx) => {
          const body = await req.json();
          const data = { value: dummyValue };
          expect(body).toEqual(data);

          return res(ctx.json(data));
        },
      ),
    );

    await storage.set('my-key', dummyValue);
  });

  it('should fallback set when user not logged in', async () => {
    const storage = createPersistentStorageFallback({
      namespace: 'not-logged-in',
    });

    const selectedKeyNextHandler = jest.fn();
    const dummyValue = 'my-value';

    await new Promise<void>(resolve => {
      storage.observe$<typeof dummyValue>('my-key').subscribe({
        next: snapshot => {
          selectedKeyNextHandler(snapshot);
          if (snapshot.presence === 'present') {
            resolve();
          }
        },
      });

      storage.set('my-key', dummyValue);
    });

    expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'my-key',
      value: dummyValue,
      presence: 'present',
    });
  });

  it('should subscribe to key changes when setting a new value', async () => {
    const storage = createPersistentStorage({ namespace: 'key-change-set' });

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();
    const mockData = { hello: 'im a great new value' };

    const serverCall = createDeferred();

    server.use(
      rest.put(
        `${mockBaseUrl}/buckets/:bucket/keys/:key`,
        async (req, res, ctx) => {
          const body = await req.json();
          const data = { value: mockData };
          expect(body).toEqual(data);

          return res(ctx.json(data));
        },
      ),
      rest.post(`${mockBaseUrl}/multiget`, async (_req, res, ctx) => {
        serverCall.resolve();
        return res(ctx.json([]));
      }),
    );

    await new Promise<void>(resolve => {
      storage.observe$<typeof mockData>('correctKey').subscribe({
        next: snapshot => {
          selectedKeyNextHandler(snapshot);
          if (snapshot.presence === 'present') {
            resolve();
          }
        },
      });

      storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

      storage.set('correctKey', mockData);
    });

    expect(wrongKeyNextHandler).toHaveBeenCalledTimes(0);
    expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'correctKey',
      presence: 'present',
      value: mockData,
    });

    await serverCall;
  });

  it('should subscribe to key changes when deleting a value', async () => {
    const storage = createPersistentStorage({ namespace: 'key-change-delete' });

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();

    const serverCall = createDeferred();

    server.use(
      rest.delete(
        `${mockBaseUrl}/buckets/:bucket/keys/:key`,
        async (_req, res, ctx) => {
          return res(ctx.status(204));
        },
      ),
      rest.post(`${mockBaseUrl}/multiget`, async (_req, res, ctx) => {
        serverCall.resolve();
        return res(ctx.json([]));
      }),
    );

    await new Promise<void>(resolve => {
      storage.observe$('correctKey').subscribe({
        next: snapshot => {
          selectedKeyNextHandler(snapshot);
          if (snapshot.presence === 'absent') {
            resolve();
          }
        },
      });

      storage.observe$('wrongKey').subscribe({ next: wrongKeyNextHandler });

      storage.remove('correctKey');
    });

    expect(wrongKeyNextHandler).toHaveBeenCalledTimes(0);
    expect(selectedKeyNextHandler).toHaveBeenCalledTimes(1);
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'correctKey',
      presence: 'absent',
      value: undefined,
    });

    await serverCall;
  });

  it('should not clash with other namespaces when creating buckets', async () => {
    const rootStorage = createPersistentStorage({ namespace: 'clash' });
    const selectedKeyNextHandler = jest.fn();

    server.use(
      rest.put(
        `${mockBaseUrl}/buckets/:bucket/keys/:key`,
        async (req, res, ctx) => {
          const { bucket, key } = req.params;
          const { value } = await req.json();

          expect(bucket).toEqual('clash.profile.something.deep');
          expect(key).toEqual('test2');

          return res(ctx.json({ value }));
        },
      ),
      rest.post(`${mockBaseUrl}/multiget`, async (req, res, ctx) => {
        const payload = await req.json();
        const { bucket, key } = payload.items[0];

        expect(bucket).toEqual('clash.profile/something');
        expect(key).toEqual('deep/test2');

        return res(ctx.status(404));
      }),
    );

    // when getting key test2 it will translate to default.profile.something.deep/test2
    const firstStorage = rootStorage
      .forBucket('profile')
      .forBucket('something')
      .forBucket('deep');
    // when getting key deep/test2 it will translate to default.profile.something/deep/test2
    const secondStorage = rootStorage.forBucket('profile/something');

    await firstStorage.set('test2', { error: true });

    await new Promise<void>(resolve => {
      secondStorage.observe$('deep/test2').subscribe({
        next: snapshot => {
          selectedKeyNextHandler(snapshot);
          if (snapshot.presence === 'absent') {
            resolve();
          }
        },
      });

      secondStorage.snapshot('deep/test2');
    });

    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'deep/test2',
      presence: 'absent',
      value: undefined,
    });
    expect(mockErrorApi.post).not.toHaveBeenCalled();
  });

  it('should silently treat the value as absent when the json can not be parsed', async () => {
    const selectedKeyNextHandler = jest.fn();
    const rootStorage = createPersistentStorage({
      namespace: 'Test.Mock.Thing',
    });

    server.use(
      rest.post(`${mockBaseUrl}/multiget`, async (req, res, ctx) => {
        const payload = await req.json();
        expect(payload).toEqual({
          items: [{ bucket: 'Test.Mock.Thing', key: 'key' }],
        });
        return res(ctx.text('{ invalid: json string }'));
      }),
    );

    await new Promise<void>(resolve => {
      rootStorage.observe$('key').subscribe({
        next: snapshot => {
          selectedKeyNextHandler(snapshot);
          if (snapshot.presence === 'absent') {
            resolve();
          }
        },
      });

      rootStorage.snapshot('key');
    });

    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'key',
      presence: 'absent',
      value: undefined,
    });
  });

  it('should freeze the snapshot value', async () => {
    const storage = createPersistentStorage({ namespace: 'freeze' });
    const selectedKeyNextHandler = jest.fn();
    const data = { foo: 'bar', baz: [{ foo: 'bar' }] };

    server.use(
      rest.post(`${mockBaseUrl}/multiget`, async (_req, res, ctx) => {
        return res(ctx.json({ items: [{ value: data }] }));
      }),
    );

    await new Promise<void>(resolve => {
      storage.observe$('key').subscribe({
        next: snapshot => {
          selectedKeyNextHandler(snapshot);
          if (snapshot.presence === 'present') {
            resolve();
          }
        },
      });

      storage.snapshot('key');
    });

    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'key',
      presence: 'present',
      value: { baz: [{ foo: 'bar' }], foo: 'bar' },
    });

    const snapshot = selectedKeyNextHandler.mock.calls[0][0];
    expect(() => {
      snapshot.value.foo = 'buzz';
    }).toThrow(/Cannot assign to read only property/);
    expect(() => {
      snapshot.value.baz[0].foo = 'buzz';
    }).toThrow(/Cannot assign to read only property/);
    expect(() => {
      snapshot.value.baz.push({ foo: 'buzz' });
    }).toThrow(/Cannot add property 1, object is not extensible/);
  });

  it('should batch multiple calls into one', async () => {
    const storage = createPersistentStorage({ namespace: 'multiget' });
    const selectedKeyNextHandler = jest.fn();
    const selectedKeyNextHandlerCached = jest.fn();
    const data1 = { foo: 'bar1', baz: [{ foo: 'bar1' }] };
    const data2 = { foo: 'bar2', baz: [{ foo: 'bar2' }] };

    let serverCalls = 0;

    server.use(
      rest.post(`${mockBaseUrl}/multiget`, async (req, res, ctx) => {
        ++serverCalls;
        const payload = (await req.json()) as {
          items: { bucket: string; key: string }[];
        };
        const result = payload.items.map(item => {
          if (item.key === 'key1') {
            return { value: data1 };
          } else if (item.key === 'key2') {
            return { value: data2 };
          }
          return null;
        });

        return res(ctx.json({ items: result }));
      }),
    );

    await Promise.all([
      new Promise<void>(resolve => {
        storage.observe$('key1').subscribe({
          next: snapshot => {
            selectedKeyNextHandler(snapshot);
            if (snapshot.presence === 'present') {
              resolve();
            }
          },
        });

        storage.snapshot('key1');
      }),

      new Promise<void>(resolve => {
        storage.observe$('missing-key').subscribe({
          next: snapshot => {
            selectedKeyNextHandler(snapshot);
            if (snapshot.presence === 'absent') {
              resolve();
            }
          },
        });

        storage.snapshot('missing-key');
      }),

      new Promise<void>(resolve => {
        storage.observe$('key2').subscribe({
          next: snapshot => {
            selectedKeyNextHandler(snapshot);
            if (snapshot.presence === 'present') {
              resolve();
            }
          },
        });

        storage.snapshot('key2');
      }),
    ]);

    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'key1',
      presence: 'present',
      value: data1,
    });
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'key2',
      presence: 'present',
      value: data2,
    });
    expect(selectedKeyNextHandler).toHaveBeenCalledWith({
      key: 'missing-key',
      presence: 'absent',
    });
    expect(mockErrorApi.post).not.toHaveBeenCalled();
    expect(serverCalls).toBe(1);

    // Get key1 again, should use cached value
    await new Promise<void>(resolve => {
      storage.observe$('key1').subscribe({
        next: snapshot => {
          selectedKeyNextHandlerCached(snapshot);
          if (snapshot.presence === 'present') {
            resolve();
          }
        },
      });

      storage.snapshot('key1');
    });

    expect(selectedKeyNextHandlerCached).toHaveBeenCalledWith({
      key: 'key1',
      presence: 'present',
      value: data1,
    });
    expect(serverCalls).toBe(1);
  });
});

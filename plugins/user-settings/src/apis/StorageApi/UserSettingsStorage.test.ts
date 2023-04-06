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
  IdentityApi,
  StorageApi,
} from '@backstage/core-plugin-api';
import { MockFetchApi, setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { UserSettingsStorage } from './UserSettingsStorage';

describe('Persistent Storage API', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);

  const mockBaseUrl = 'http://backstage:9191/api';
  const mockErrorApi = { post: jest.fn(), error$: jest.fn() };
  const mockDiscoveryApi = {
    getBaseUrl: async () => mockBaseUrl,
  };
  const mockIdentityApi: Partial<IdentityApi> = {
    getCredentials: async () => ({ token: 'a-token' }),
  };
  const mockIdentityApiFallback: Partial<IdentityApi> = {
    // This API recreates the guest mode, where the WebStorage is used as fallback
    getCredentials: async () => ({}),
  };

  const createPersistentStorage = (
    args?: Partial<{
      fetchApi: FetchApi;
      discoveryApi: DiscoveryApi;
      errorApi: ErrorApi;
      namespace?: string;
    }>,
  ): StorageApi => {
    return UserSettingsStorage.create({
      errorApi: mockErrorApi,
      fetchApi: new MockFetchApi(),
      discoveryApi: mockDiscoveryApi,
      identityApi: mockIdentityApi as IdentityApi,
      ...args,
    });
  };

  const createPersistentStorageFallback = (
    args?: Partial<{
      fetchApi: FetchApi;
      discoveryApi: DiscoveryApi;
      errorApi: ErrorApi;
      namespace?: string;
    }>,
  ): StorageApi => {
    return UserSettingsStorage.create({
      errorApi: mockErrorApi,
      fetchApi: new MockFetchApi(),
      discoveryApi: mockDiscoveryApi,
      identityApi: mockIdentityApiFallback as IdentityApi,
      ...args,
    });
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return undefined for values which are unset', async () => {
    const storage = createPersistentStorage();

    server.use(
      rest.get(
        `${mockBaseUrl}/buckets/:bucket/keys/:key`,
        async (_req, res, ctx) => {
          return res(ctx.json({ value: 'a' }));
        },
      ),
    );

    expect(storage.snapshot('myfakekey').value).toBeUndefined();
    expect(storage.snapshot('myfakekey')).toEqual({
      key: 'myfakekey',
      presence: 'unknown',
      value: undefined,
    });
  });

  it('should allow setting of a simple data structure', async () => {
    const storage = createPersistentStorage();
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
    const storage = createPersistentStorage();
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
    const storage = createPersistentStorageFallback();

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
    const storage = createPersistentStorage();

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();
    const mockData = { hello: 'im a great new value' };

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
  });

  it('should subscribe to key changes when deleting a value', async () => {
    const storage = createPersistentStorage();

    const wrongKeyNextHandler = jest.fn();
    const selectedKeyNextHandler = jest.fn();

    server.use(
      rest.delete(
        `${mockBaseUrl}/buckets/:bucket/keys/:key`,
        async (_req, res, ctx) => {
          return res(ctx.status(204));
        },
      ),
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
  });

  it('should not clash with other namespaces when creating buckets', async () => {
    const rootStorage = createPersistentStorage();
    const selectedKeyNextHandler = jest.fn();

    server.use(
      rest.put(
        `${mockBaseUrl}/buckets/:bucket/keys/:key`,
        async (req, res, ctx) => {
          const { bucket, key } = req.params;
          const { value } = await req.json();

          expect(bucket).toEqual('default.profile.something.deep');
          expect(key).toEqual('test2');

          return res(ctx.json({ value }));
        },
      ),
      rest.get(
        `${mockBaseUrl}/buckets/:bucket/keys/:key`,
        async (req, res, ctx) => {
          const { bucket, key } = req.params;

          expect(bucket).toEqual('default.profile/something');
          expect(key).toEqual('deep/test2');

          return res(ctx.status(404));
        },
      ),
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
      rest.get(
        `${mockBaseUrl}/buckets/:bucket/keys/:key`,
        async (req, res, ctx) => {
          const { bucket, key } = req.params;
          expect(bucket).toEqual('Test.Mock.Thing');
          expect(key).toEqual('key');
          return res(ctx.text('{ invalid: json string }'));
        },
      ),
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
    const storage = createPersistentStorage();
    const selectedKeyNextHandler = jest.fn();
    const data = { foo: 'bar', baz: [{ foo: 'bar' }] };

    server.use(
      rest.get(
        `${mockBaseUrl}/buckets/:bucket/keys/:key`,
        async (_req, res, ctx) => {
          return res(ctx.json({ value: data }));
        },
      ),
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
});

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
import { IdentityApi, StorageApi } from '@backstage/core-plugin-api';
import { ForwardedError, ResponseError } from '@backstage/errors';
import {
  MockStorageApi,
  setupRequestMockHandlers,
} from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import waitForExpect from 'wait-for-expect';

import { BackendStarredEntitiesApi } from './BackendStarredEntitiesApi';

const server = setupServer();

describe('BackendStarredEntitiesApi', () => {
  setupRequestMockHandlers(server);

  let mockStorage: StorageApi;
  let mockStorageBucket: StorageApi;

  const mockBaseUrl = 'http://backstage:9191/api';
  const discoveryApi = { getBaseUrl: async () => mockBaseUrl };

  const mockErrorApi = { post: jest.fn(), error$: jest.fn() };
  const mockIdentityApi: jest.Mocked<IdentityApi> = {
    getProfileInfo: jest.fn(),
    getBackstageIdentity: jest.fn(),
    getCredentials: jest.fn(),
    signOut: jest.fn(),
  };

  const createApi = async (): Promise<BackendStarredEntitiesApi> => {
    const api = new BackendStarredEntitiesApi({
      storageApi: mockStorage,
      discoveryApi,
      identityApi: mockIdentityApi,
      errorApi: mockErrorApi,
    });

    // wait for the first update
    await waitForExpect(() => {
      expect(api.isSynced).toBe(true);
    });

    return api;
  };

  beforeEach(() => {
    mockStorage = MockStorageApi.create();
    mockStorageBucket = mockStorage.forBucket('starredEntities');

    mockIdentityApi.getCredentials.mockResolvedValue({ token: 'token' });

    server.use(
      rest.get(`${mockBaseUrl}`, async (_req, res, ctx) => {
        return res(ctx.json({ starredEntities: [] }));
      }),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    it('should load entities from server', async () => {
      server.use(
        rest.get(`${mockBaseUrl}`, async (req, res, ctx) => {
          if (req.headers.get('Authorization') !== 'Bearer token') {
            return res(ctx.status(500));
          }

          return res(
            ctx.json({ starredEntities: ['component:default/example'] }),
          );
        }),
      );

      expect(mockStorageBucket.snapshot('entityRefs')?.value).toBeUndefined();

      await createApi();

      expect(mockStorageBucket.snapshot('entityRefs')?.value).toEqual([
        'component:default/example',
      ]);
    });

    it('should push existing entities to server', async () => {
      const postedEntities = jest.fn();
      server.use(
        rest.post(
          `${mockBaseUrl}/:namespace/:kind/:name/star`,
          async (req, res, ctx) => {
            if (req.headers.get('Authorization') !== 'Bearer token') {
              return res(ctx.status(500));
            }

            postedEntities(req.params);

            return res(ctx.status(204));
          },
        ),
      );

      await mockStorageBucket.set('entityRefs', ['component:default/example']);

      await createApi();

      expect(postedEntities).toBeCalledTimes(1);
      expect(postedEntities).toBeCalledWith({
        kind: 'component',
        namespace: 'default',
        name: 'example',
      });

      expect(
        mockStorageBucket.snapshot('migratedToStarredEntitiesBackend')?.value,
      ).toEqual(true);
    });

    it('should skip migration existing entities to server', async () => {
      const postedEntities = jest.fn();
      server.use(
        rest.post(
          `${mockBaseUrl}/:namespace/:kind/:name/star`,
          async (req, res, ctx) => {
            if (req.headers.get('Authorization') !== 'Bearer token') {
              return res(ctx.status(500));
            }

            postedEntities(req.params);

            return res(ctx.status(204));
          },
        ),
      );

      await mockStorageBucket.set('migratedToStarredEntitiesBackend', true);
      await mockStorageBucket.set('entityRefs', ['component:default/example']);

      await createApi();

      expect(postedEntities).toBeCalledTimes(0);

      expect(
        mockStorageBucket.snapshot('migratedToStarredEntitiesBackend')?.value,
      ).toEqual(true);
    });
  });

  describe('toggleStarred', () => {
    it('should toggle entity and store the starred entities', async () => {
      server.use(
        rest.post(
          `${mockBaseUrl}/:namespace/:kind/:name/toggle`,
          async (req, res, ctx) => {
            if (req.headers.get('Authorization') !== 'Bearer token') {
              return res(ctx.status(500));
            }

            const { namespace, kind, name } = req.params;

            if (
              namespace === 'default' &&
              kind === 'component' &&
              name === 'example'
            ) {
              return res(
                ctx.json({ starredEntities: ['component:default/example'] }),
              );
            }

            return res(ctx.status(500));
          },
        ),
      );

      const starredEntitiesApi = await createApi();

      await starredEntitiesApi.toggleStarred('component:default/example');

      expect(mockErrorApi.post).not.toBeCalled();
      expect(mockStorageBucket.snapshot('entityRefs')?.value).toEqual([
        'component:default/example',
      ]);
    });

    it('should emit error', async () => {
      server.use(
        rest.post(
          `${mockBaseUrl}/:namespace/:kind/:name/toggle`,
          async (_req, res, ctx) => res(ctx.status(500)),
        ),
      );

      const starredEntitiesApi = await createApi();

      // set a value that shouldn't be changed
      await mockStorageBucket.set('entityRefs', ['a']);

      await starredEntitiesApi.toggleStarred('component:default/example');

      expect(mockErrorApi.post).toBeCalledWith(
        new ForwardedError(
          'Could not star/unstar entity component:default/example',
          await ResponseError.fromResponse({
            status: 500,
            statusText: 'Internal Server Error',
          } as unknown as Response),
        ),
      );
      expect(mockStorageBucket.snapshot('entityRefs')?.value).toEqual(['a']);
    });
  });

  describe('starredEntities$', () => {
    const handler = jest.fn();

    beforeEach(async () => {
      const starredEntitiesApi = await createApi();

      await new Promise<void>(resolve => {
        starredEntitiesApi.starredEntitie$().subscribe({
          next: (...args) => {
            handler(...args);

            if (handler.mock.calls.length >= 2) {
              resolve();
            }
          },
        });

        mockStorageBucket.set('entityRefs', ['component:default/mock']).then();
      });
    });

    it('should receive updates', async () => {
      expect(handler).toBeCalledTimes(2);
      expect(handler).toBeCalledWith(new Set());
      expect(handler).toBeCalledWith(new Set(['component:default/mock']));
    });
  });
});

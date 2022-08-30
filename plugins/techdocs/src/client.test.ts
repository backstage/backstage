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

import { UrlPatternDiscovery } from '@backstage/core-app-api';
import { IdentityApi } from '@backstage/core-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { MockConfigApi, MockFetchApi } from '@backstage/test-utils';
import { TechDocsStorageClient } from './client';

const MockedEventSource = EventSourcePolyfill as jest.MockedClass<
  typeof EventSourcePolyfill
>;

jest.mock('event-source-polyfill');

const mockEntity = {
  kind: 'Component',
  namespace: 'default',
  name: 'test-component',
};

describe('TechDocsStorageClient', () => {
  const mockBaseUrl = 'http://backstage:9191/api/techdocs';
  const configApi = new MockConfigApi({});
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  const identityApi: jest.Mocked<IdentityApi> = {
    getCredentials: jest.fn(),
  } as unknown as jest.Mocked<IdentityApi>;
  const fetchApi = new MockFetchApi({ injectIdentityAuth: { identityApi } });

  beforeEach(() => {
    jest.resetAllMocks();
    identityApi.getCredentials.mockResolvedValue({ token: undefined });
  });

  it('should return correct base url based on defined storage', async () => {
    const storageApi = new TechDocsStorageClient({
      configApi,
      discoveryApi,
      identityApi,
      fetchApi,
    });

    await expect(
      storageApi.getBaseUrl('test.js', mockEntity, ''),
    ).resolves.toEqual(
      `${mockBaseUrl}/static/docs/${mockEntity.namespace}/${mockEntity.kind}/${mockEntity.name}/test.js`,
    );

    await expect(
      storageApi.getBaseUrl('../test.js', mockEntity, 'some-docs-path'),
    ).resolves.toEqual(
      `${mockBaseUrl}/static/docs/${mockEntity.namespace}/${mockEntity.kind}/${mockEntity.name}/test.js`,
    );
  });

  it('should return base url with correct entity structure', async () => {
    const storageApi = new TechDocsStorageClient({
      configApi,
      discoveryApi,
      identityApi,
      fetchApi,
    });

    await expect(
      storageApi.getBaseUrl('test/', mockEntity, ''),
    ).resolves.toEqual(
      `${mockBaseUrl}/static/docs/${mockEntity.namespace}/${mockEntity.kind}/${mockEntity.name}/test/`,
    );
  });

  describe('syncEntityDocs', () => {
    it('should create eventsource without headers', async () => {
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        identityApi,
        fetchApi,
      });

      MockedEventSource.prototype.addEventListener.mockImplementation(
        (type, fn) => {
          if (type === 'finish' && typeof fn === 'function') {
            fn({ data: '{"updated": false}' } as any);
          }
        },
      );

      identityApi.getCredentials.mockResolvedValue({});
      await storageApi.syncEntityDocs(mockEntity);

      expect(MockedEventSource).toHaveBeenCalledWith(
        'http://backstage:9191/api/techdocs/sync/default/Component/test-component',
        { withCredentials: true, headers: {} },
      );
    });

    it('should create eventsource with headers', async () => {
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        identityApi,
        fetchApi,
      });

      MockedEventSource.prototype.addEventListener.mockImplementation(
        (type, fn) => {
          if (type === 'finish' && typeof fn === 'function') {
            fn({ data: '{"updated": false}' } as any);
          }
        },
      );

      identityApi.getCredentials.mockResolvedValue({ token: 'token' });
      await storageApi.syncEntityDocs(mockEntity);

      expect(MockedEventSource).toHaveBeenCalledWith(
        'http://backstage:9191/api/techdocs/sync/default/Component/test-component',
        { withCredentials: true, headers: { Authorization: 'Bearer token' } },
      );
    });

    it('should resolve to cached', async () => {
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        identityApi,
        fetchApi,
      });

      MockedEventSource.prototype.addEventListener.mockImplementation(
        (type, fn) => {
          if (type === 'finish' && typeof fn === 'function') {
            fn({ data: '{"updated": false}' } as any);
          }
        },
      );

      identityApi.getCredentials.mockResolvedValue({});
      await expect(storageApi.syncEntityDocs(mockEntity)).resolves.toEqual(
        'cached',
      );
    });

    it('should resolve to updated', async () => {
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        identityApi,
        fetchApi,
      });

      MockedEventSource.prototype.addEventListener.mockImplementation(
        (type, fn) => {
          if (type === 'finish' && typeof fn === 'function') {
            fn({ data: '{"updated": true}' } as any);
          }
        },
      );

      identityApi.getCredentials.mockResolvedValue({});
      await expect(storageApi.syncEntityDocs(mockEntity)).resolves.toEqual(
        'updated',
      );
    });

    it('should log values', async () => {
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        identityApi,
        fetchApi,
      });

      MockedEventSource.prototype.addEventListener.mockImplementation(
        (type, fn) => {
          if (type === 'log' && typeof fn === 'function') {
            fn({ data: '"A log message"' } as any);
          }

          if (type === 'finish' && typeof fn === 'function') {
            fn({ data: '{"updated": false}' } as any);
          }
        },
      );

      identityApi.getCredentials.mockResolvedValue({});
      const logHandler = jest.fn();
      await expect(
        storageApi.syncEntityDocs(mockEntity, logHandler),
      ).resolves.toEqual('cached');

      expect(logHandler).toHaveBeenCalledTimes(1);
      expect(logHandler).toHaveBeenCalledWith('A log message');
    });

    it('should throw NotFoundError', async () => {
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        identityApi,
        fetchApi,
      });

      // we await later after we emitted the error
      identityApi.getCredentials.mockResolvedValue({});
      const promise = storageApi.syncEntityDocs(mockEntity).then();

      // flush the event loop
      await new Promise(r => setTimeout(r));

      const instance = MockedEventSource.mock
        .instances[0] as jest.Mocked<EventSource>;

      instance.onerror?.({
        status: 404,
        message: 'Some not found warning',
      } as any);

      await expect(promise).rejects.toThrow(NotFoundError);
      await expect(promise).rejects.toThrow('Some not found warning');
    });

    it('should throw generic errors', async () => {
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        identityApi,
        fetchApi,
      });

      // we await later after we emitted the error
      identityApi.getCredentials.mockResolvedValue({});
      const promise = storageApi.syncEntityDocs(mockEntity).then();

      // flush the event loop
      await new Promise(r => setTimeout(r));

      const instance = MockedEventSource.mock
        .instances[0] as jest.Mocked<EventSource>;

      instance.onerror?.({
        type: 'error',
        data: 'Some other error',
      } as any);

      await expect(promise).rejects.toThrow(Error);
      await expect(promise).rejects.toThrow('Some other error');
    });
  });
});

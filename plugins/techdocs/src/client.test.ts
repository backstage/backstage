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
import { NotFoundError } from '@backstage/errors';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { mockApis, MockFetchApi } from '@backstage/test-utils';
import { TechDocsStorageClient } from './client';

jest.mock('@microsoft/fetch-event-source');
const mockFetchEventSource = fetchEventSource as jest.MockedFunction<
  typeof fetchEventSource
>;

const mockEntity = {
  kind: 'Component',
  namespace: 'default',
  name: 'test-component',
};

describe('TechDocsStorageClient', () => {
  const mockBaseUrl = 'http://backstage:9191/api/techdocs';
  const configApi = mockApis.config();
  const discoveryApi = UrlPatternDiscovery.compile(mockBaseUrl);
  const identityApi = mockApis.identity();
  const fetchApi = new MockFetchApi({ injectIdentityAuth: { identityApi } });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return correct base url based on defined storage', async () => {
    const storageApi = new TechDocsStorageClient({
      configApi,
      discoveryApi,
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
      fetchApi,
    });

    await expect(
      storageApi.getBaseUrl('test/', mockEntity, ''),
    ).resolves.toEqual(
      `${mockBaseUrl}/static/docs/${mockEntity.namespace}/${mockEntity.kind}/${mockEntity.name}/test/`,
    );
  });

  describe('syncEntityDocs', () => {
    it('should create eventsource with fetch', async () => {
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        fetchApi,
      });

      mockFetchEventSource.mockImplementation(async (_url, options) => {
        const { onopen, onmessage } = options;
        await Promise.resolve();
        await onopen?.({ ok: true } as Response);
        await Promise.resolve();
        onmessage?.({ id: '', event: 'finish', data: '{"updated": false}' });
      });
      await storageApi.syncEntityDocs(mockEntity);

      expect(mockFetchEventSource).toHaveBeenCalledWith(
        'http://backstage:9191/api/techdocs/sync/default/Component/test-component',
        {
          fetch: fetchApi.fetch,
          onerror: expect.any(Function),
          onmessage: expect.any(Function),
          signal: expect.any(AbortSignal),
        },
      );
    });

    it('should resolve to cached', async () => {
      const myFetchApi = new MockFetchApi({
        injectIdentityAuth: { identityApi },
      });
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        fetchApi: myFetchApi,
      });
      mockFetchEventSource.mockImplementation(async (_url, options) => {
        const { onopen, onmessage } = options;
        await Promise.resolve();
        await onopen?.({ ok: true } as Response);
        await Promise.resolve();
        onmessage?.({ id: '', event: 'finish', data: '{"updated": false}' });
      });

      await expect(storageApi.syncEntityDocs(mockEntity)).resolves.toEqual(
        'cached',
      );
    });

    it('should resolve to updated', async () => {
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        fetchApi,
      });
      mockFetchEventSource.mockImplementation(async (_url, options) => {
        const { onopen, onmessage } = options;
        await Promise.resolve();
        await onopen?.({ ok: true } as Response);
        await Promise.resolve();
        onmessage?.({ id: '', event: 'finish', data: '{"updated": true}' });
      });

      await expect(storageApi.syncEntityDocs(mockEntity)).resolves.toEqual(
        'updated',
      );
    });

    it('should log values', async () => {
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        fetchApi,
      });

      mockFetchEventSource.mockImplementation(async (_url, options) => {
        const { onopen, onmessage } = options;
        await Promise.resolve();
        await onopen?.({ ok: true } as Response);
        await Promise.resolve();
        onmessage?.({ id: '', event: 'log', data: '"A log message"' });
        await Promise.resolve();
        onmessage?.({ id: '', event: 'finish', data: '{"updated": false}' });
      });

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
        fetchApi,
      });

      mockFetchEventSource.mockImplementation(async (_url, options) => {
        const { onerror } = options;
        try {
          onerror?.(new NotFoundError('Some not found warning'));
        } catch (e) {
          // do nothing
        }
      });

      // we await later after we emitted the error
      const promise = storageApi.syncEntityDocs(mockEntity).then();

      await expect(promise).rejects.toThrow(NotFoundError);
      await expect(promise).rejects.toThrow('Some not found warning');
    });

    it('should throw generic errors', async () => {
      const storageApi = new TechDocsStorageClient({
        configApi,
        discoveryApi,
        fetchApi,
      });

      // we await later after we emitted the error
      const promise = storageApi.syncEntityDocs(mockEntity).then();

      mockFetchEventSource.mockImplementation(async (_url, options) => {
        const { onerror } = options;
        try {
          onerror?.(new Error('Some other error'));
        } catch (e) {
          // do nothing
        }
      });

      await expect(promise).rejects.toThrow(Error);
      await expect(promise).rejects.toThrow('Some other error');
    });
  });
});

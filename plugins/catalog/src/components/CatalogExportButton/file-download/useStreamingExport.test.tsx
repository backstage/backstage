/*
 * Copyright 2025 The Backstage Authors
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
import { renderHook, waitFor } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import { TestApiProvider } from '@backstage/test-utils';
import { EntityListProvider } from '@backstage/plugin-catalog-react';
import { MemoryRouter } from 'react-router-dom';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useStreamingExport } from './useStreamingExport';
import { CatalogExportType } from '../CatalogExportButton';
import * as downloadBlobModule from './downloadBlob';

jest.mock('./downloadBlob', () => ({
  downloadBlob: jest.fn(),
}));

const mockDownloadBlob = downloadBlobModule.downloadBlob as jest.Mock;

describe('useStreamingExport', () => {
  const testEntity: Entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'test-component',
      namespace: 'default',
    },
    spec: {
      type: 'service',
      owner: 'team-a',
    },
  };

  const testColumns = [
    { entityFilterKey: 'metadata.name', title: 'Name' },
    { entityFilterKey: 'spec.type', title: 'Type' },
  ];

  const createMockCatalogApi = (entities: Entity[][], shouldError = false) => ({
    streamEntities: jest.fn(async function* streamEntitiesGenerator() {
      if (shouldError) {
        throw new Error('Stream error');
      }
      for (const page of entities) {
        yield page;
      }
    }),
  });

  const renderHookWithApi = (catalogApi: any) => {
    const wrapper = ({ children }: any) => (
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <MemoryRouter>
          <EntityListProvider>{children}</EntityListProvider>
        </MemoryRouter>
      </TestApiProvider>
    );
    return renderHook(() => useStreamingExport(), { wrapper });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDownloadBlob.mockResolvedValue(undefined);
  });

  describe('exportStream', () => {
    it('exports entities to CSV format', async () => {
      const catalogApi = createMockCatalogApi([[testEntity]]);
      const { result } = renderHookWithApi(catalogApi);

      await result.current.exportStream({
        exportFormat: CatalogExportType.CSV,
        filename: 'test.csv',
        columns: testColumns,
      });

      await waitFor(() => {
        expect(mockDownloadBlob).toHaveBeenCalledTimes(1);
      });

      const callArgs = mockDownloadBlob.mock.calls[0];
      const response = callArgs[0] as Response;
      const filename = callArgs[1] as string;

      expect(filename).toBe('test.csv');
      const content = await response.text();
      expect(content).toContain('Name');
      expect(content).toContain('Type');
      expect(content).toContain('test-component');
      expect(content).toContain('service');
    });

    it('exports entities to JSON format', async () => {
      const catalogApi = createMockCatalogApi([[testEntity]]);
      const { result } = renderHookWithApi(catalogApi);

      await result.current.exportStream({
        exportFormat: CatalogExportType.JSON,
        filename: 'test.json',
        columns: testColumns,
      });

      await waitFor(() => {
        expect(mockDownloadBlob).toHaveBeenCalledTimes(1);
      });

      const callArgs = mockDownloadBlob.mock.calls[0];
      const response = callArgs[0] as Response;
      const filename = callArgs[1] as string;

      expect(filename).toBe('test.json');
      const content = await response.text();
      const parsed = JSON.parse(content);
      expect(parsed).toEqual([
        {
          Name: 'test-component',
          Type: 'service',
        },
      ]);
    });

    it('handles multiple pages of entities with proper header handling', async () => {
      const entity1 = { ...testEntity };
      const entity2 = {
        ...testEntity,
        metadata: { ...testEntity.metadata, name: 'another-component' },
      };

      const catalogApi = createMockCatalogApi([[entity1], [entity2]]);
      const { result } = renderHookWithApi(catalogApi);

      await result.current.exportStream({
        exportFormat: CatalogExportType.CSV,
        filename: 'test.csv',
        columns: testColumns,
      });

      await waitFor(() => {
        expect(mockDownloadBlob).toHaveBeenCalledTimes(1);
      });

      const callArgs = mockDownloadBlob.mock.calls[0];
      const response = callArgs[0] as Response;
      const content = await response.text();

      // Should have both entities, headers should appear only once
      expect(content).toContain('test-component');
      expect(content).toContain('another-component');
      const headerCount = (content.match(/Name,Type/g) || []).length;
      expect(headerCount).toBe(1);
    });

    it('passes streamRequest to catalogApi.streamEntities', async () => {
      const catalogApi = createMockCatalogApi([[testEntity]]);
      const { result } = renderHookWithApi(catalogApi);

      const streamRequest = { filter: { kind: 'Component' } };

      await result.current.exportStream({
        exportFormat: CatalogExportType.CSV,
        filename: 'test.csv',
        columns: testColumns,
        streamRequest,
      });

      await waitFor(() => {
        expect(catalogApi.streamEntities).toHaveBeenCalledWith(streamRequest);
      });
    });

    it('sets loading state correctly', async () => {
      const catalogApi = createMockCatalogApi([[testEntity]]);
      const { result } = renderHookWithApi(catalogApi);

      expect(result.current.loading).toBe(false);

      const exportPromise = result.current.exportStream({
        exportFormat: CatalogExportType.CSV,
        filename: 'test.csv',
        columns: testColumns,
      });

      // Loading may be true during execution
      await exportPromise;

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('sets error state on failure', async () => {
      const catalogApi = createMockCatalogApi([[testEntity]], true);
      const { result } = renderHookWithApi(catalogApi);

      await result.current.exportStream({
        exportFormat: CatalogExportType.CSV,
        filename: 'test.csv',
        columns: testColumns,
      });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
        expect(result.current.error?.message).toBe('Stream error');
      });
    });

    it('sets correct content type for CSV', async () => {
      const catalogApi = createMockCatalogApi([[testEntity]]);
      const { result } = renderHookWithApi(catalogApi);

      await result.current.exportStream({
        exportFormat: CatalogExportType.CSV,
        filename: 'test.csv',
        columns: testColumns,
      });

      await waitFor(() => {
        expect(mockDownloadBlob).toHaveBeenCalledTimes(1);
      });

      const callArgs = mockDownloadBlob.mock.calls[0];
      const response = callArgs[0] as Response;
      expect(response.headers.get('Content-Type')).toContain('text/csv');
    });

    it('sets correct content type for JSON', async () => {
      const catalogApi = createMockCatalogApi([[testEntity]]);
      const { result } = renderHookWithApi(catalogApi);

      await result.current.exportStream({
        exportFormat: CatalogExportType.JSON,
        filename: 'test.json',
        columns: testColumns,
      });

      await waitFor(() => {
        expect(mockDownloadBlob).toHaveBeenCalledTimes(1);
      });

      const callArgs = mockDownloadBlob.mock.calls[0];
      const response = callArgs[0] as Response;
      expect(response.headers.get('Content-Type')).toContain(
        'application/json',
      );
    });

    it('handles empty entity stream', async () => {
      const catalogApi = createMockCatalogApi([]);
      const { result } = renderHookWithApi(catalogApi);

      await result.current.exportStream({
        exportFormat: CatalogExportType.JSON,
        filename: 'test.json',
        columns: testColumns,
      });

      await waitFor(() => {
        expect(mockDownloadBlob).toHaveBeenCalledTimes(1);
      });

      const callArgs = mockDownloadBlob.mock.calls[0];
      const response = callArgs[0] as Response;
      const content = await response.text();
      expect(content).toBe('[]');
    });

    it('clears previous error on new export', async () => {
      const catalogApi = createMockCatalogApi([[testEntity]], true);
      const { result } = renderHookWithApi(catalogApi);

      // First export fails
      await result.current.exportStream({
        exportFormat: CatalogExportType.CSV,
        filename: 'test.csv',
        columns: testColumns,
      });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      // Create new catalog API that succeeds
      const successCatalogApi = createMockCatalogApi([[testEntity]]);
      const { result: result2 } = renderHookWithApi(successCatalogApi);

      // Second export succeeds
      await result2.current.exportStream({
        exportFormat: CatalogExportType.CSV,
        filename: 'test.csv',
        columns: testColumns,
      });

      expect(result2.current.error).toBeNull();
    });
  });
});

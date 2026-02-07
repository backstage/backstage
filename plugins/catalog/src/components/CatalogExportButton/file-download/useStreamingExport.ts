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
import { useState, useCallback } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef, useEntityList } from '@backstage/plugin-catalog-react';
import { downloadBlob } from './downloadBlob';
import {
  serializeEntitiesToCsv,
  serializeEntityToJsonRow,
  ExportColumn,
} from './serializeEntities';
import { CatalogExportType } from '../CatalogExportButton';
import type { StreamEntitiesRequest } from '@backstage/catalog-client';
import { filtersToStreamRequest } from './filtersToStreamRequest';

/**
 * @public
 */
export interface StreamingExportOptions {
  exportFormat: CatalogExportType | string;
  filename: string;
  columns: ExportColumn[];
  streamRequest?: StreamEntitiesRequest;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  customExporter?: (
    catalogApi: any,
    columns: ExportColumn[],
    streamRequest?: StreamEntitiesRequest,
  ) => Promise<Blob>;
}

/**
 * Streams and serializes catalog entities to CSV format.
 * Writes headers only for the first page.
 */
const streamEntitiesCsv = async (
  catalogApi: any,
  columns: ExportColumn[],
  streamRequest?: StreamEntitiesRequest,
): Promise<Blob> => {
  let csvContent = '';
  let isFirstPage = true;

  const entityStream = catalogApi.streamEntities(streamRequest);

  for await (const entityPage of entityStream) {
    const pageCsv = serializeEntitiesToCsv(entityPage, columns, isFirstPage);
    csvContent += pageCsv;
    isFirstPage = false;
  }

  return new Blob([csvContent], {
    type: 'text/csv; charset=utf-8',
  });
};

/**
 * Streams and serializes catalog entities to JSON format.
 * Processes entities page-by-page to avoid loading all into memory.
 */
const streamEntitiesJson = async (
  catalogApi: any,
  columns: ExportColumn[],
  streamRequest?: StreamEntitiesRequest,
): Promise<Blob> => {
  const rowStrings: string[] = [];

  const entityStream = catalogApi.streamEntities(streamRequest);

  for await (const entityPage of entityStream) {
    for (const entity of entityPage) {
      rowStrings.push(serializeEntityToJsonRow(entity, columns));
    }
  }

  const jsonContent =
    rowStrings.length > 0 ? `[\n  ${rowStrings.join(',\n  ')}\n]` : '[]';

  return new Blob([jsonContent], {
    type: 'application/json; charset=utf-8',
  });
};

/**
 * A hook for streaming and exporting catalog entities from the frontend.
 *
 * This hook uses the catalog API's `streamEntities` method to efficiently
 * stream entities in pages and serialize them to CSV or JSON format directly
 * on the frontend, without requiring a backend export endpoint.
 *
 * @returns An object containing:
 *          - `exportStream`: The function to trigger the streaming export.
 *          - `loading`: A boolean indicating if the export is in progress.
 *          - `error`: An error object if the export fails.
 */
export const useStreamingExport = (): {
  exportStream: (options: StreamingExportOptions) => Promise<void>;
  loading: boolean;
  error: Error | null;
} => {
  const catalogApi = useApi(catalogApiRef);
  const { filters } = useEntityList();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportStream = useCallback(
    async ({
      exportFormat,
      filename,
      columns,
      streamRequest,
      onSuccess,
      onError,
      customExporter,
    }: StreamingExportOptions) => {
      setLoading(true);
      setError(null);

      try {
        let blob: Blob;

        // If caller didn't provide a streamRequest, derive it from the
        // current EntityList filters so exports reflect the user's view.
        const resolvedStreamRequest =
          streamRequest ?? filtersToStreamRequest(filters);

        if (customExporter) {
          blob = await customExporter(
            catalogApi,
            columns,
            resolvedStreamRequest,
          );
        } else if (exportFormat === CatalogExportType.CSV) {
          blob = await streamEntitiesCsv(
            catalogApi,
            columns,
            resolvedStreamRequest,
          );
        } else if (exportFormat === CatalogExportType.JSON) {
          blob = await streamEntitiesJson(
            catalogApi,
            columns,
            resolvedStreamRequest,
          );
        } else {
          throw new Error(`Unsupported export format: ${exportFormat}`);
        }

        const response = new Response(blob, {
          headers: { 'Content-Type': blob.type },
        });
        await downloadBlob(response, filename);

        if (onSuccess) {
          onSuccess();
        }
      } catch (e: any) {
        setError(e);
        if (onError) {
          onError(e);
        }
      } finally {
        setLoading(false);
      }
    },
    [filters, catalogApi],
  );

  return { exportStream, loading, error };
};

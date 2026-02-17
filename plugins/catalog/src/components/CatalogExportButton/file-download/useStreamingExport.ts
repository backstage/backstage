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
import { streamDownload, createStreamFromAsyncGenerator } from './downloadFile';
import {
  serializeEntitiesToCsv,
  serializeEntityToJsonRow,
  ExportColumn,
} from './serializeEntities';
import { CatalogExportType } from '../CatalogExportButton';
import type { StreamEntitiesRequest } from '@backstage/catalog-client';
import { filtersToStreamRequest } from './filtersToStreamRequest';

/**
 * A custom exporter function that returns an async generator for streaming exports.
 * The generator should yield string chunks that will be streamed to the download.
 * @public
 */
export type StreamingCustomExporter = (
  catalogApi: any,
  columns: ExportColumn[],
  streamRequest?: StreamEntitiesRequest,
) => {
  generator: AsyncGenerator<string, void, unknown>;
  contentType: string;
};

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
  customExporter?: StreamingCustomExporter;
}

/**
 * Async generator that streams and serializes catalog entities to CSV format.
 * Yields CSV chunks as they're generated, enabling true streaming downloads.
 */
async function* streamEntitiesCsvGenerator(
  catalogApi: any,
  columns: ExportColumn[],
  streamRequest?: StreamEntitiesRequest,
): AsyncGenerator<string, void, unknown> {
  let isFirstPage = true;

  const entityStream = catalogApi.streamEntities(streamRequest);

  for await (const entityPage of entityStream) {
    const pageCsv = serializeEntitiesToCsv(entityPage, columns, isFirstPage);
    yield pageCsv;
    isFirstPage = false;
  }
}

/**
 * Async generator that streams and serializes catalog entities to JSON format.
 * Yields JSON chunks as they're generated, enabling true streaming downloads.
 */
async function* streamEntitiesJsonGenerator(
  catalogApi: any,
  columns: ExportColumn[],
  streamRequest?: StreamEntitiesRequest,
): AsyncGenerator<string, void, unknown> {
  let isFirst = true;

  yield '[';

  const entityStream = catalogApi.streamEntities(streamRequest);

  for await (const entityPage of entityStream) {
    for (const entity of entityPage) {
      const row = serializeEntityToJsonRow(entity, columns);
      if (isFirst) {
        yield `\n  ${row}`;
        isFirst = false;
      } else {
        yield `,\n  ${row}`;
      }
    }
  }

  yield '\n]';
}

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
        // If caller didn't provide a streamRequest, derive it from the
        // current EntityList filters so exports reflect the user's view.
        const resolvedStreamRequest =
          streamRequest ?? filtersToStreamRequest(filters);

        if (customExporter) {
          const { generator, contentType } = customExporter(
            catalogApi,
            columns,
            resolvedStreamRequest,
          );
          const stream = createStreamFromAsyncGenerator(generator);
          await streamDownload(stream, filename, contentType);
        } else if (exportFormat === CatalogExportType.CSV) {
          const generator = streamEntitiesCsvGenerator(
            catalogApi,
            columns,
            resolvedStreamRequest,
          );
          const contentType = 'text/csv; charset=utf-8';
          const stream = createStreamFromAsyncGenerator(generator);
          await streamDownload(stream, filename, contentType);
        } else if (exportFormat === CatalogExportType.JSON) {
          const generator = streamEntitiesJsonGenerator(
            catalogApi,
            columns,
            resolvedStreamRequest,
          );
          const contentType = 'application/json; charset=utf-8';
          const stream = createStreamFromAsyncGenerator(generator);
          await streamDownload(stream, filename, contentType);
        } else {
          throw new Error(`Unsupported export format: ${exportFormat}`);
        }

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

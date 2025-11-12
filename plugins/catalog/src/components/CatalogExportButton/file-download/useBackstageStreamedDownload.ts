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
import { fetchApiRef, useApi } from '@backstage/core-plugin-api';
import { downloadBlob } from './downloadBlob';

export interface BackstageStreamedDownloadOptions {
  url: string;
  filename: string;
  searchParams?: URLSearchParams;
}

/**
 * A hook for downloading files from a Backstage backend endpoint.
 *
 * This hook provides a function to initiate a POST request to the specified backend URL
 * and streams the response to create a downloadable file in the user's browser.
 * It uses the Backstage FetchApi to handle authentication.
 *
 * We are not using a library like `axios` here because the native `fetch` API provides
 * direct and efficient access to the response body as a `Blob`. This is ideal for
 * handling file downloads, as it allows us to easily create an object URL
 * (`URL.createObjectURL`) and trigger a download prompt in the browser without needing
 * extra configuration or dependencies that might complicate handling binary data.
 *
 * @returns An object containing:
 *          - `download`: The function to trigger the download.
 *          - `loading`: A boolean indicating if the download is in progress.
 *          - `error`: An error object if the download fails.
 *
 * @example
 * ```tsx
 * const { download, loading, error } = useBackstageStreamedDownload();
 *
 * const handleDownload = () => {
 *   download({
 *     url: '/api/my-plugin/download-report',
 *     filename: 'report.csv',
 *     searchParams: new URLSearchParams({ month: 'january' }),
 *   });
 * };
 *
 * return (
 *   <>
 *     <Button onClick={handleDownload} disabled={loading}>
 *       Download Report
 *     </Button>
 *     {error && <p>Error: {error.message}</p>}
 *   </>
 * );
 * ```
 */
export const useBackstageStreamedDownload = (): {
  download: (options: BackstageStreamedDownloadOptions) => Promise<void>;
  loading: boolean;
  error: Error | null;
} => {
  const fetchApi = useApi(fetchApiRef);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const download = useCallback(
    async ({
      url: endpointUrl,
      filename,
      searchParams,
    }: BackstageStreamedDownloadOptions) => {
      setLoading(true);
      setError(null);

      try {
        const pathWithParams = `${endpointUrl}${
          searchParams ? `?${searchParams.toString()}` : ''
        }`;

        const response = await fetchApi.fetch(pathWithParams, {
          method: 'POST',
        });

        if (!response.ok || !response.body) {
          throw new Error(`Download failed with status ${response.status}`);
        }

        await downloadBlob(response, filename);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [fetchApi],
  );

  return { download, loading, error };
};

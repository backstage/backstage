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

import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { DiscoveryApi } from '@backstage/plugin-permission-common';
import useAsync from 'react-use/lib/useAsync';
import { useOctokitRequest } from './useOctokitRequest';

const useAdrApi = (
  endpoint: string,
  fileUrl: string,
  discoveryApi: DiscoveryApi,
) => {
  return async () => {
    const baseUrl = await discoveryApi.getBaseUrl('adr');
    const targetUrl = `${baseUrl}/${endpoint}?url=${encodeURIComponent(
      fileUrl,
    )}`;

    const result = await fetch(targetUrl);
    const data = await result.json();

    if (!result.ok) {
      throw data;
    }
    return data;
  };
};

export interface AdrFileFetcher {
  useGetAdrFilesAtUrl: (url: string) => any;
  useReadAdrFileAtUrl: (url: string) => any;
}

const getAdrFilesEndpoint = 'getAdrFilesAtUrl';
const readAdrFileEndpoint = 'readAdrFileAtUrl';

export const urlReaderAdrFileFetcher: AdrFileFetcher = {
  useGetAdrFilesAtUrl: function (url: string) {
    const discoveryApi = useApi(discoveryApiRef);
    return useAsync<any>(useAdrApi(getAdrFilesEndpoint, url, discoveryApi), [
      url,
    ]);
  },
  useReadAdrFileAtUrl: function (url: string) {
    const discoveryApi = useApi(discoveryApiRef);
    return useAsync<any>(useAdrApi(readAdrFileEndpoint, url, discoveryApi), [
      url,
    ]);
  },
};

export const octokitAdrFileFetcher: AdrFileFetcher = {
  useGetAdrFilesAtUrl: (url: string) => useOctokitRequest(url),
  useReadAdrFileAtUrl: (url: string) => useOctokitRequest(url),
};

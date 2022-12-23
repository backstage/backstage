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

import { DiscoveryApi } from '@backstage/core-plugin-api';
import { AdrApi, AdrListResult, AdrReadResult } from './types';

/**
 * Options for creating an AdrClient.
 *
 * @public
 */
export interface AdrClientOptions {
  discoveryApi: DiscoveryApi;
}

const readEndpoint = 'file';
const listEndpoint = 'list';

/**
 * An implementation of the AdrApi that communicates with the ADR backend plugin.
 *
 * @public
 */
export class AdrClient implements AdrApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: AdrClientOptions) {
    this.discoveryApi = options.discoveryApi;
  }

  private async fetchAdrApi<T>(endpoint: string, fileUrl: string): Promise<T> {
    const baseUrl = await this.discoveryApi.getBaseUrl('adr');
    const targetUrl = `${baseUrl}/${endpoint}?url=${encodeURIComponent(
      fileUrl,
    )}`;

    const result = await fetch(targetUrl);
    const data = await result.json();

    if (!result.ok) {
      throw new Error(`${data.message}`);
    }
    return data;
  }

  async listAdrs(url: string): Promise<AdrListResult> {
    return this.fetchAdrApi<AdrListResult>(listEndpoint, url);
  }

  async readAdr(url: string): Promise<AdrReadResult> {
    return this.fetchAdrApi<AdrReadResult>(readEndpoint, url);
  }
}

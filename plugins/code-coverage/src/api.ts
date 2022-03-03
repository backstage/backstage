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

import {
  CompoundEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { ResponseError } from '@backstage/errors';
import { JsonCodeCoverage, JsonCoverageHistory } from './types';
import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';

export type CodeCoverageApi = {
  discovery: DiscoveryApi;
  getCoverageForEntity: (
    entity: CompoundEntityRef,
  ) => Promise<JsonCodeCoverage>;
  getFileContentFromEntity: (
    entity: CompoundEntityRef,
    filePath: string,
  ) => Promise<string>;
  getCoverageHistoryForEntity: (
    entity: CompoundEntityRef,
    limit?: number,
  ) => Promise<JsonCoverageHistory>;
};

export const codeCoverageApiRef = createApiRef<CodeCoverageApi>({
  id: 'plugin.code-coverage.service',
});

export class CodeCoverageRestApi implements CodeCoverageApi {
  url: string = '';

  constructor(public discovery: DiscoveryApi) {}

  private async fetch<T = unknown | string | JsonCoverageHistory>(
    path: string,
    init?: RequestInit,
  ): Promise<T | string> {
    if (!this.url) {
      this.url = await this.discovery.getBaseUrl('code-coverage');
    }
    const resp = await fetch(`${this.url}${path}`, init);
    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
    if (resp.headers.get('content-type')?.includes('application/json')) {
      return await resp.json();
    }
    return await resp.text();
  }

  async getCoverageForEntity(
    entityName: CompoundEntityRef,
  ): Promise<JsonCodeCoverage> {
    const entity = encodeURIComponent(stringifyEntityRef(entityName));
    return (await this.fetch<JsonCodeCoverage>(
      `/report?entity=${entity}`,
    )) as JsonCodeCoverage;
  }

  async getFileContentFromEntity(
    entityName: CompoundEntityRef,
    filePath: string,
  ): Promise<string> {
    const entity = encodeURIComponent(stringifyEntityRef(entityName));
    return await this.fetch<string>(
      `/file-content?entity=${entity}&path=${encodeURI(filePath)}`,
    );
  }

  async getCoverageHistoryForEntity(
    entityName: CompoundEntityRef,
    limit?: number,
  ): Promise<JsonCoverageHistory> {
    const entity = encodeURIComponent(stringifyEntityRef(entityName));
    const hasValidLimit = limit && limit > 0;
    return (await this.fetch<JsonCoverageHistory>(
      `/history?entity=${entity}${
        hasValidLimit ? `&limit=${encodeURIComponent(String(limit))}` : ''
      }`,
    )) as JsonCoverageHistory;
  }
}

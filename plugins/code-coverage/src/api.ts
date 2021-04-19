/*
 * Copyright 2020 Spotify AB
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

import { createApiRef } from '@backstage/core';
import { Config } from '@backstage/config';
import { EntityName, stringifyEntityRef } from '@backstage/catalog-model';
import {
  JsonCodeCoverage,
  JsonCoverageHistory,
} from '@backstage/plugin-code-coverage-backend';

export class FetchError extends Error {
  get name(): string {
    return this.constructor.name;
  }

  static async forResponse(resp: Response): Promise<FetchError> {
    return new FetchError(
      `Request failed with status code ${
        resp.status
      }.\nReason: ${await resp.text()}`,
    );
  }
}

export type CodeCoverageApi = {
  url: string;
  getCoverageForEntity: (entity: EntityName) => Promise<JsonCodeCoverage>;
  getFileContentFromEntity: (
    entity: EntityName,
    filePath: string,
  ) => Promise<string>;
  getCoverageHistoryForEntity: (
    entity: EntityName,
    limit?: number,
  ) => Promise<JsonCoverageHistory>;
};

export const codeCoverageApiRef = createApiRef<CodeCoverageApi>({
  id: 'plugin.code-coverage.service',
  description: 'Used by the code coverage plugin to make requests',
});

export class CodeCoverageRestApi implements CodeCoverageApi {
  static fromConfig(config: Config) {
    return new CodeCoverageRestApi(config.getString('backend.baseUrl'));
  }

  constructor(public url: string) {}

  private async fetch<T = unknown | string | JsonCoverageHistory>(
    input: string,
    init?: RequestInit,
  ): Promise<T | string> {
    const resp = await fetch(`${this.url}${input}`, init);
    if (!resp.ok) throw await FetchError.forResponse(resp);
    if (resp.headers.get('content-type')?.includes('application/json')) {
      return await resp.json();
    }
    return await resp.text();
  }

  async getCoverageForEntity(
    entityName: EntityName,
  ): Promise<JsonCodeCoverage> {
    const entity = stringifyEntityRef(entityName);
    return (await this.fetch<JsonCodeCoverage>(
      `/api/code-coverage/report?entity=${entity}`,
    )) as JsonCodeCoverage;
  }

  async getFileContentFromEntity(
    entityName: EntityName,
    filePath: string,
  ): Promise<string> {
    const entity = stringifyEntityRef(entityName);
    return await this.fetch<string>(
      `/api/code-coverage/file-content?entity=${entity}&path=${filePath}`,
    );
  }

  async getCoverageHistoryForEntity(
    entityName: EntityName,
    limit?: number,
  ): Promise<JsonCoverageHistory> {
    const entity = stringifyEntityRef(entityName);
    const hasValidLimit = limit && limit > 0;
    return (await this.fetch<JsonCoverageHistory>(
      `/api/code-coverage/history?entity=${entity}${
        hasValidLimit ? `&limit=${limit}` : ''
      }`,
    )) as JsonCoverageHistory;
  }
}

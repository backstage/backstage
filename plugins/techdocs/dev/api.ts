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
import { DiscoveryApi } from '@backstage/core';
import { Config } from '@backstage/config';
import { EntityName } from '@backstage/catalog-model';
import { TechDocsStorage } from '../src/api';

export class TechDocsDevStorageApi implements TechDocsStorage {
  public configApi: Config;
  public discoveryApi: DiscoveryApi;

  constructor({
    configApi,
    discoveryApi,
  }: {
    configApi: Config;
    discoveryApi: DiscoveryApi;
  }) {
    this.configApi = configApi;
    this.discoveryApi = discoveryApi;
  }

  async getApiOrigin() {
    return (
      this.configApi.getOptionalString('techdocs.requestUrl') ??
      (await this.discoveryApi.getBaseUrl('techdocs'))
    );
  }

  async getEntityDocs(entityId: EntityName, path: string) {
    const { name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const url = `${apiOrigin}/${name}/${path}`;

    const request = await fetch(
      `${url.endsWith('/') ? url : `${url}/`}index.html`,
    );

    if (request.status === 404) {
      throw new Error('Page not found');
    }

    return request.text();
  }

  async getBaseUrl(
    oldBaseUrl: string,
    entityId: EntityName,
    path: string,
  ): Promise<string> {
    const { name } = entityId;
    const apiOrigin = await this.getApiOrigin();
    return new URL(oldBaseUrl, `${apiOrigin}/${name}/${path}`).toString();
  }
}

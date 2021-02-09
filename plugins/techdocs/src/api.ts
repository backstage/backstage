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

import { createApiRef, DiscoveryApi } from '@backstage/core';
import { Config } from '@backstage/config';
import { EntityName } from '@backstage/catalog-model';
import { TechDocsMetadata } from './types';

export const techdocsStorageApiRef = createApiRef<TechDocsStorageApi>({
  id: 'plugin.techdocs.storageservice',
  description: 'Used to make requests towards the techdocs storage',
});

export const techdocsApiRef = createApiRef<TechDocsApi>({
  id: 'plugin.techdocs.service',
  description: 'Used to make requests towards techdocs API',
});

export interface TechDocsStorage {
  getEntityDocs(entityId: EntityName, path: string): Promise<string>;
  getBaseUrl(
    oldBaseUrl: string,
    entityId: EntityName,
    path: string,
  ): Promise<string>;
}

export interface TechDocs {
  getTechDocsMetadata(entityId: EntityName): Promise<TechDocsMetadata>;
  getEntityMetadata(entityId: EntityName): Promise<string>;
}

/**
 * API to talk to techdocs-backend.
 *
 * @property {string} apiOrigin Set to techdocs.requestUrl as the URL for techdocs-backend API
 */
export class TechDocsApi implements TechDocs {
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

  /**
   * Retrieve TechDocs metadata.
   *
   * When docs are built, we generate a techdocs_metadata.json and store it along with the generated
   * static files. It includes necessary data about the docs site. This method requests techdocs-backend
   * which retrieves the TechDocs metadata.
   *
   * @param {EntityName} entityId Object containing entity data like name, namespace, etc.
   */
  async getTechDocsMetadata(entityId: EntityName) {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const requestUrl = `${apiOrigin}/metadata/techdocs/${namespace}/${kind}/${name}`;

    const request = await fetch(`${requestUrl}`);
    const res = await request.json();

    return res;
  }

  /**
   * Retrieve metadata about an entity.
   *
   * This method requests techdocs-backend which uses the catalog APIs to respond with filtered
   * information required here.
   *
   * @param {EntityName} entityId Object containing entity data like name, namespace, etc.
   */
  async getEntityMetadata(entityId: EntityName) {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const requestUrl = `${apiOrigin}/metadata/entity/${namespace}/${kind}/${name}`;

    const request = await fetch(`${requestUrl}`);
    const res = await request.json();

    return res;
  }
}

/**
 * API which talks to TechDocs storage to fetch files to render.
 *
 * @property {string} apiOrigin Set to techdocs.requestUrl as the URL for techdocs-backend API
 */
export class TechDocsStorageApi implements TechDocsStorage {
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

  /**
   * Fetch HTML content as text for an individual docs page in an entity's docs site.
   *
   * @param {EntityName} entityId Object containing entity data like name, namespace, etc.
   * @param {string} path The unique path to an individual docs page e.g. overview/what-is-new
   * @returns {string} HTML content of the docs page as string
   * @throws {Error} Throws error when the page is not found.
   */
  async getEntityDocs(entityId: EntityName, path: string) {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();
    const url = `${apiOrigin}/docs/${namespace}/${kind}/${name}/${path}`;

    const request = await fetch(
      `${url.endsWith('/') ? url : `${url}/`}index.html`,
    );

    let errorMessage = '';
    switch (request.status) {
      case 404:
        errorMessage = 'Page not found. ';
        // path is empty for the home page of an entity's docs site
        if (!path) {
          errorMessage +=
            'This could be because there is no index.md file in the root of the docs directory of this repository.';
        }
        throw new Error(errorMessage);
      case 500:
        errorMessage =
          'Could not generate documentation or an error in the TechDocs backend. ';
        throw new Error(errorMessage);
      default:
        // Do nothing
        break;
    }

    return request.text();
  }

  async getBaseUrl(
    oldBaseUrl: string,
    entityId: EntityName,
    path: string,
  ): Promise<string> {
    const { kind, namespace, name } = entityId;

    const apiOrigin = await this.getApiOrigin();

    return new URL(
      oldBaseUrl,
      `${apiOrigin}/docs/${namespace}/${kind}/${name}/${path}`,
    ).toString();
  }
}

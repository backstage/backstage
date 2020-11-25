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

import { createApiRef, OAuthApi } from '@backstage/core';

import { ParsedEntityId } from './types';

export const techdocsStorageApiRef = createApiRef<TechDocsStorageApi>({
  id: 'plugin.techdocs.storageservice',
  description: 'Used to make requests towards the techdocs storage',
});

export const techdocsApiRef = createApiRef<TechDocsApi>({
  id: 'plugin.techdocs.service',
  description: 'Used to make requests towards techdocs API',
});

export interface TechDocsStorage {
  getEntityDocs(entityId: ParsedEntityId, path: string): Promise<string>;
  getBaseUrl(
    oldBaseUrl: string,
    entityId: ParsedEntityId,
    path: string,
  ): string;
}

export interface TechDocs {
  getMetadata(metadataType: string, entityId: ParsedEntityId): Promise<string>;
}

/**
 * API to talk to techdocs-backend.
 *
 * @property {string} apiOrigin Set to techdocs.requestUrl as the URL for techdocs-backend API
 */
export class TechDocsApi implements TechDocs {
  public apiOrigin: string;

  constructor({ apiOrigin }: { apiOrigin: string }) {
    this.apiOrigin = apiOrigin;
  }

  async getMetadata(metadataType: string, entityId: ParsedEntityId) {
    const { kind, namespace, name } = entityId;

    const requestUrl = `${this.apiOrigin}/metadata/${metadataType}/${namespace}/${kind}/${name}`;

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
  public apiOrigin: string;
  private readonly githubAuthApi: OAuthApi;

  constructor({
    apiOrigin,
    githubAuthApi,
  }: {
    apiOrigin: string;
    githubAuthApi: OAuthApi;
  }) {
    this.apiOrigin = apiOrigin;
    this.githubAuthApi = githubAuthApi;
  }

  /**
   * Fetch HTML content as text for an individual docs page in an entity's docs site.
   *
   * @param {ParsedEntityId} entityId Object containing entity data like name, namespace, etc.
   * @param {string} path The unique path to an individual docs page e.g. overview/what-is-new
   * @returns {string} HTML content of the docs page as string
   * @throws {Error} Throws error when the page is not found.
   */
  async getEntityDocs(entityId: ParsedEntityId, path: string) {
    const { kind, namespace, name } = entityId;

    const url = `${this.apiOrigin}/docs/${namespace}/${kind}/${name}/${path}`;

    const request = await fetch(
      `${url.endsWith('/') ? url : `${url}/`}index.html`,
      {
        headers: new Headers({
          Authorization: await this.getToken(),
        }),
      },
    );

    if (request.status === 404) {
      let errorMessage = 'Page not found. ';
      // path is empty for the home page of an entity's docs site
      if (!path) {
        errorMessage +=
          'This could be because there is no index.md file in the root of the docs directory of this repository.';
      }
      throw new Error(errorMessage);
    }

    return request.text();
  }

  getBaseUrl(
    oldBaseUrl: string,
    entityId: ParsedEntityId,
    path: string,
  ): string {
    const { kind, namespace, name } = entityId;

    return new URL(
      oldBaseUrl,
      `${this.apiOrigin}/docs/${namespace}/${kind}/${name}/${path}`,
    ).toString();
  }

  async getToken(): Promise<string> {
    // NOTE(freben): There's a .read-only variant of this scope that we could
    // use for readonly operations, but that means we would ask the user for a
    // second auth during creation and I decided to keep the wider scope for
    // all ops for now
    return this.githubAuthApi.getAccessToken();
  }
}

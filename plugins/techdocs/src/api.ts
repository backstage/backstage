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
      throw new Error('Page not found');
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

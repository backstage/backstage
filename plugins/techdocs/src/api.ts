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

import { ParsedEntityId } from './types';

export const techdocsStorageApiRef = createApiRef<TechDocsStorageApi>({
  id: 'plugin.techdocs.storageservice',
  description: 'Used to make requests towards the techdocs storage',
});

export interface TechDocsStorage {
  getEntityDocs(entityId: ParsedEntityId, path: string): Promise<string>;
  getBaseUrl(
    oldBaseUrl: string,
    entityId: ParsedEntityId,
    path: string,
  ): string;
}

export class TechDocsStorageApi implements TechDocsStorage {
  public apiOrigin: string;

  constructor({ apiOrigin }: { apiOrigin: string }) {
    this.apiOrigin = apiOrigin;
  }

  async getEntityDocs(entityId: ParsedEntityId, path: string) {
    const { kind, namespace, name } = entityId;

    const url = `${this.apiOrigin}/${kind}/${namespace ? namespace : 'default'}/${name}/${path}`;

    const request = await fetch(
      `${url.endsWith('/') ? url : `${url}/`}index.html`,
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
      `${this.apiOrigin}/${kind}/${namespace ? namespace : 'default'}/${name}/${path}`,
    ).toString();
  }
}

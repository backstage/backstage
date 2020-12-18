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

import { EntityName } from '@backstage/catalog-model';
import { createApiRef, DiscoveryApi } from '@backstage/core';

export const rocdocsApiRef = createApiRef<RocDocsApi>({
  id: 'plugin.rocdocs.service',
  description: 'Used to make requests towards rocdocs API',
});

type RocDocsResponse = {
  menu: any;
  page: any;
};

export interface RocDocs {
  getDocs(entityId: EntityName, path?: string): Promise<RocDocsResponse>;
}

export class RocDocsApi implements RocDocs {
  public discoveryApi: DiscoveryApi;

  constructor({ discoveryApi }: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = discoveryApi;
  }

  async getDocs(entityId: EntityName, path?: string): Promise<RocDocsResponse> {
    const { namespace, kind, name } = entityId;

    const rocdocsBaseUrl = await this.discoveryApi.getBaseUrl('rocdocs');

    const requestUrl = `${rocdocsBaseUrl}/docs/${namespace}/${kind}/${name}${
      path ? `/${path}` : ''
    }`;

    const request = await fetch(`${requestUrl}`);
    const res = await request.json();

    return res;
  }
}

/*
 * Copyright 2021 The Backstage Authors
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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import {
  createApiRef,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { BazaarProject, Status } from './types';

export const bazaarApiRef = createApiRef<BazaarApi>({
  id: 'bazaar',
  description: 'Used to make requests towards the bazaar backend',
});

export interface BazaarApi {
  updateMetadata(
    entity: Entity,
    name: string,
    community: string,
    announcement: string,
    status: Status,
  ): Promise<any>;

  getMetadata(entity: Entity): Promise<any>;

  getMembers(entity: Entity): Promise<any>;

  deleteMember(entity: Entity): Promise<void>;

  addMember(entity: Entity): Promise<void>;

  getEntities(): Promise<any>;

  deleteEntity(bazaarProject: BazaarProject): Promise<void>;
}

export class BazaarClient implements BazaarApi {
  private readonly identityApi: IdentityApi;
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: {
    identityApi: IdentityApi;
    discoveryApi: DiscoveryApi;
  }) {
    this.identityApi = options.identityApi;
    this.discoveryApi = options.discoveryApi;
  }

  async updateMetadata(
    entity: Entity,
    name: string,
    community: string,
    announcement: string,
    status: Status,
  ): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    return await fetch(`${baseUrl}/metadata`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_ref: stringifyEntityRef(entity),
        name: name,
        announcement: announcement,
        community: community,
        status: status,
      }),
    }).then(resp => resp.json());
  }

  async getMetadata(entity: Entity): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    const response = await fetch(
      `${baseUrl}/metadata/${encodeURIComponent(stringifyEntityRef(entity))}`,
      {
        method: 'GET',
      },
    );

    return response.ok ? response : null;
  }

  async getMembers(entity: Entity): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    return await fetch(
      `${baseUrl}/members/${encodeURIComponent(stringifyEntityRef(entity))}`,
      {
        method: 'GET',
      },
    ).then(resp => resp.json());
  }

  async addMember(entity: Entity): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    await fetch(`${baseUrl}/member`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_ref: stringifyEntityRef(entity),
        user_id: this.identityApi.getUserId(),
        picture: this.identityApi.getProfile()?.picture,
      }),
    });
  }

  async deleteMember(entity: Entity): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    await fetch(
      `${baseUrl}/member/${encodeURIComponent(
        stringifyEntityRef(entity),
      )}/${this.identityApi.getUserId()}`,
      {
        method: 'DELETE',
      },
    );
  }

  async getEntities(): Promise<any> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');

    return await fetch(`${baseUrl}/entities`, {
      method: 'GET',
    }).then(resp => resp.json());
  }

  async deleteEntity(bazaarProject: BazaarProject): Promise<void> {
    const baseUrl = await this.discoveryApi.getBaseUrl('bazaar');
    const entityRef = bazaarProject.entityRef as string;

    await fetch(`${baseUrl}/metadata/${encodeURIComponent(entityRef)}`, {
      method: 'DELETE',
    });

    if (bazaarProject.membersCount > 0) {
      await fetch(`${baseUrl}/members/${encodeURIComponent(entityRef)}`, {
        method: 'DELETE',
      });
    }
  }
}

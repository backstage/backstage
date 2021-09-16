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

import { Entity } from '@backstage/catalog-model';
import { createApiRef, IdentityApi } from '@backstage/core-plugin-api';
import { BazaarProject, Status } from './types';

export const getEntityRef = (entity: Entity) => {
  return `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
};

export const bazaarApiRef = createApiRef<BazaarApi>({
  id: 'bazaar',
  description: 'Used to make requests towards the bazaar backend',
});

export interface BazaarApi {
  updateMetadata(
    baseUrl: string,
    entity: Entity,
    name: string,
    announcement: string,
    status: Status,
  ): Promise<any>;

  getMetadata(baseUrl: string, entity: Entity): Promise<any>;

  getMemberCounts(
    bazaarProjects: BazaarProject[],
    baseUrl: string,
  ): Promise<Map<string, number>>;

  getMembers(baseUrl: string, entity: Entity): Promise<any>;

  deleteMember(baseUrl: string, entity: Entity): Promise<void>;

  deleteMembers(baseUrl: string, entity: Entity): Promise<void>;

  addMember(baseUrl: string, entity: Entity): Promise<void>;

  getEntities(baseUrl: string): Promise<any>;

  deleteEntity(baseUrl: string, entity: Entity): Promise<void>;
}

export class BazaarClient implements BazaarApi {
  private readonly identityApi: IdentityApi;

  constructor(options: { identityApi: IdentityApi }) {
    this.identityApi = options.identityApi;
  }

  async updateMetadata(
    baseUrl: string,
    entity: Entity,
    name: string,
    announcement: string,
    status: Status,
  ): Promise<any> {
    return await fetch(`${baseUrl}/api/bazaar/metadata`, {
      method: 'PUT',
      headers: {
        entity_ref: getEntityRef(entity),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        announcement: announcement,
        status: status,
      }),
    }).then(resp => resp.json());
  }

  async getMetadata(baseUrl: string, entity: Entity): Promise<any> {
    return await fetch(`${baseUrl}/api/bazaar/metadata`, {
      method: 'GET',
      headers: {
        entity_ref: getEntityRef(entity),
      },
    });
  }

  async getMemberCounts(
    bazaarProjects: BazaarProject[],
    baseUrl: string,
  ): Promise<Map<string, number>> {
    const members = new Map<string, number>();
    for (const project of bazaarProjects) {
      const response = await fetch(`${baseUrl}/api/bazaar/members`, {
        method: 'GET',
        headers: {
          entity_ref: project.entityRef,
        },
      });

      const json = await response.json();
      const nbrOfMembers = await json.data.length;
      members.set(project.entityRef, nbrOfMembers);
    }
    return members;
  }

  async getMembers(baseUrl: string, entity: Entity): Promise<any> {
    return await fetch(`${baseUrl}/api/bazaar/members`, {
      method: 'GET',
      headers: {
        entity_ref: getEntityRef(entity),
      },
    }).then(resp => resp.json());
  }

  async addMember(baseUrl: string, entity: Entity): Promise<void> {
    await fetch(`${baseUrl}/api/bazaar/member`, {
      method: 'PUT',
      headers: {
        user_id: this.identityApi.getUserId(),
        entity_ref: getEntityRef(entity),
      },
    });
  }

  async deleteMember(baseUrl: string, entity: Entity): Promise<void> {
    await fetch(`${baseUrl}/api/bazaar/member`, {
      method: 'DELETE',
      headers: {
        user_id: this.identityApi.getUserId(),
        entity_ref: getEntityRef(entity),
      },
    });
  }

  async deleteMembers(baseUrl: string, entity: Entity): Promise<void> {
    await fetch(`${baseUrl}/api/bazaar/members`, {
      method: 'DELETE',
      headers: {
        entity_ref: getEntityRef(entity),
      },
    });
  }

  async getEntities(baseUrl: string): Promise<any> {
    return await fetch(`${baseUrl}/api/bazaar/entities`, {
      method: 'GET',
    }).then(resp => resp.json());
  }

  async deleteEntity(baseUrl: string, entity: Entity): Promise<void> {
    await fetch(`${baseUrl}/api/bazaar/metadata`, {
      method: 'DELETE',
      headers: {
        entity_ref: getEntityRef(entity),
      },
    });

    await fetch(`${baseUrl}/api/bazaar/members`, {
      method: 'DELETE',
      headers: {
        user_id: this.identityApi.getUserId(),
        entity_ref: getEntityRef(entity),
      },
    });
  }
}

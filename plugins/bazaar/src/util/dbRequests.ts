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
import { IdentityApi } from '@backstage/core-plugin-api';
import { BazaarProject, Status } from './types';

export const getEntityRef = (entity: Entity) => {
  return `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
};

export const updateMetadata = async (
  entity: Entity,
  name: string,
  announcement: string,
  status: Status,
  baseUrl: string,
) => {
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
};

export const getBazaarMembers = async (
  bazaarProjects: BazaarProject[],
  baseUrl: string,
) => {
  const bazaarMembers = new Map<string, number>();
  for (const project of bazaarProjects) {
    const response = await fetch(`${baseUrl}/api/bazaar/members`, {
      method: 'GET',
      headers: {
        entity_ref: project.entityRef,
      },
    });

    const json = await response.json();
    const nbrOfMembers = await json.data.length;
    bazaarMembers.set(project.entityRef, nbrOfMembers);
  }
  return bazaarMembers;
};

export const deleteEntity = async (
  baseUrl: string,
  entity: Entity,
  identity: IdentityApi,
) => {
  await fetch(`${baseUrl}/api/bazaar/metadata`, {
    method: 'DELETE',
    headers: {
      entity_ref: getEntityRef(entity),
    },
  });

  await fetch(`${baseUrl}/api/bazaar/members/remove`, {
    method: 'DELETE',
    headers: {
      user_id: identity.getUserId(),
      entity_ref: getEntityRef(entity),
    },
  });
};

/*
 * Copyright 2023 The Backstage Authors
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

import {
  CatalogApi,
  GetEntitiesByRefsRequest,
  GetEntitiesRequest,
} from '@backstage/catalog-client';
import {
  CompoundEntityRef,
  Entity,
  GroupEntity,
  stringifyEntityRef,
} from '@backstage/catalog-model';

export const groupA: GroupEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'group-a',
    title: 'Group A',
    description: 'Testing Group A',
  },
  spec: {
    type: 'testing-group',
    children: [],
  },
  relations: [
    {
      type: 'parentOf',
      targetRef: 'group:default/group-b',
    },
    {
      type: 'parentOf',
      targetRef: 'group:default/group-c',
    },
  ],
};

export const groupAWithALeader: GroupEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'group-a',
    title: 'Group A',
    description: 'Testing Group A',
  },
  spec: {
    type: 'testing-group',
    children: [],
  },
  relations: [
    {
      type: 'teamLeadBy',
      targetRef: 'user:default/group-a-user-one',
    },
    {
      type: 'parentOf',
      targetRef: 'group:default/group-b',
    },
    {
      type: 'parentOf',
      targetRef: 'group:default/group-c',
    },
  ],
};

export const groupARef: CompoundEntityRef = {
  kind: 'group',
  name: 'group-a',
  namespace: 'default',
};

export const groupB: GroupEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'group-b',
    title: 'Group B',
    description: 'Testing Group B',
  },
  spec: {
    type: 'testing-group',
    children: [],
  },
  relations: [
    {
      type: 'parentOf',
      targetRef: 'group:default/group-a',
    },
    {
      type: 'parentOf',
      targetRef: 'group:default/group-d',
    },
  ],
};

export const groupBRef: CompoundEntityRef = {
  kind: 'group',
  name: 'group-b',
  namespace: 'default',
};

export const groupC: GroupEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'group-c',
    title: 'Group C',
    description: 'Testing Group C',
  },
  spec: {
    type: 'testing-group',
    children: [],
  },
};

export const groupCRef: CompoundEntityRef = {
  kind: 'group',
  name: 'group-c',
  namespace: 'default',
};

export const groupD: GroupEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'group-d',
    title: 'Group D',
    description: 'Testing Group D',
  },
  spec: {
    type: 'testing-group',
    children: [],
  },
  relations: [
    {
      type: 'parentOf',
      targetRef: 'group:default/group-c',
    },
    {
      type: 'parentOf',
      targetRef: 'group:default/group-e',
    },
  ],
};

export const groupDRef: CompoundEntityRef = {
  kind: 'group',
  name: 'group-d',
  namespace: 'default',
};

export const groupE: GroupEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'group-e',
    title: 'Group E',
    description: 'Testing Group E',
  },
  spec: {
    type: 'testing-group',
    children: [],
  },
};

export const groupERef: CompoundEntityRef = {
  kind: 'group',
  name: 'group-e',
  namespace: 'default',
};

export const groupF: GroupEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'group-f',
    title: 'Group F',
    description: 'Testing Group F',
  },
  spec: {
    type: 'testing-group',
    children: [],
  },
};

export const groupAUserOne: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'group-a-user-one',
  },
  spec: {
    profile: {
      displayName: 'Group A User One',
      email: 'group-a-user-one@testing.email',
      picture:
        'https://avatars.dicebear.com/api/avataaars/breanna-davison@example.com.svg',
    },
  },
};

export const groupBUserOne: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'group-b-user-one',
  },
  spec: {
    profile: {
      displayName: 'Group B User One',
      email: 'group-b-user-one@testing.email',
      picture:
        'https://avatars.dicebear.com/api/avataaars/breanna-davison@example.com.svg',
    },
  },
};

export const groupDUserOne: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'group-d-user-one',
  },
  spec: {
    profile: {
      displayName: 'Group D User One',
      email: 'group-d-user-one@testing.email',
      picture:
        'https://avatars.dicebear.com/api/avataaars/breanna-davison@example.com.svg',
    },
  },
};

export const groupEUserOne: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'group-e-user-one',
  },
  spec: {
    profile: {
      displayName: 'Group E User One',
      email: 'group-e-user-one@testing.email',
      picture:
        'https://avatars.dicebear.com/api/avataaars/breanna-davison@example.com.svg',
    },
  },
};

export const groupFUserOne: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'group-f-user-one',
  },
  spec: {
    profile: {
      displayName: 'Group F User One',
      email: 'group-f-user-one@testing.email',
      picture:
        'https://avatars.dicebear.com/api/avataaars/breanna-davison@example.com.svg',
    },
  },
};

export const duplicatedUser: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'duplicated-user',
  },
  spec: {
    profile: {
      displayName: 'Duplicated User',
      email: 'duplicated-user@testing.email',
      picture:
        'https://avatars.dicebear.com/api/avataaars/breanna-davison@example.com.svg',
    },
  },
};

const mockedRefsToRelationsMap = new Map<string, GroupEntity>([
  ['group:default/group-a', groupA],
  ['group:default/group-b', groupB],
  ['group:default/group-c', groupC],
  ['group:default/group-d', groupD],
  ['group:default/group-e', groupE],
  ['group:default/group-f', groupF],
]);

const mockedMembersMapping = new Map<string, Entity[]>([
  ['group:default/group-a', [groupAUserOne, duplicatedUser]],
  ['group:default/group-b', [groupBUserOne]],
  ['group:default/group-c', []],
  ['group:default/group-d', [groupDUserOne, duplicatedUser]],
  ['group:default/group-e', [groupEUserOne, duplicatedUser]],
  ['group:default/group-f', [groupFUserOne]],
]);

type Nullable<T> = T | undefined;

export const mockedCatalogApiSupportingGroups: Partial<CatalogApi> = {
  getEntities: async (request?: GetEntitiesRequest) => {
    const actualFilter = (request?.filter as Nullable<{
      'relations.memberof': string[];
    }>) ?? { 'relations.memberof': [] };
    const items =
      actualFilter['relations.memberof'].length > 0
        ? (actualFilter['relations.memberof']
            .map(group => mockedMembersMapping.get(group))
            .flat()
            .filter(entity => !!entity) as Entity[])
        : [...mockedMembersMapping.values()].flat();

    return { items };
  },
  getEntityByRef: async (entityRef: CompoundEntityRef) =>
    mockedRefsToRelationsMap.get(stringifyEntityRef(entityRef)),
  getEntitiesByRefs: async (request: GetEntitiesByRefsRequest) => {
    const items = request.entityRefs.map(entityRef =>
      mockedRefsToRelationsMap.get(entityRef),
    );
    return { items };
  },
};

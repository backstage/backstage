/*
 * Copyright 2022 The Backstage Authors
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

import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';

// TODO: owner is ignored in the score board as we are using "relations", see extendSystemScore
export const entityOnline: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'System',
  metadata: {
    name: 'Online',
    description: 'Online/Cumulus system',
    annotations: {},
  },
  relations: [
    {
      type: RELATION_OWNED_BY,
      targetRef: 'Group:team-online',
    },
  ],
};

export const entityAtpService: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'System',
  metadata: {
    name: 'our-great-system',
    description: '...',
    annotations: {},
  },
  relations: [
    {
      type: RELATION_OWNED_BY,
      targetRef: 'Group:team-market-operations',
    },
  ],
};

export const entityIdentity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'System',
  metadata: {
    name: 'Identity-backend',
    description: '...',
    annotations: {},
  },
  relations: [
    {
      type: RELATION_OWNED_BY,
      targetRef: 'Group:team-identity',
    },
  ],
};

export const entityNonExistent: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'System',
  metadata: {
    name: 'NonExistentSystem',
    description: 'Non existent system',
    annotations: {},
  },
};

export const entityTeamOnline: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'team-online',
    description: 'Team Online',
    annotations: {},
  },
};

export const entityGuestUser: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'Guest',
    description: 'Guest user',
    annotations: {},
  },
};

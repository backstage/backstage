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

export const entityAudioPlaybackSystem: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'System',
  metadata: {
    name: 'audio-playback',
    description: 'Audio playback system',
    annotations: {},
  },
  relations: [
    {
      type: RELATION_OWNED_BY,
      targetRef: 'Group:team-c',
    },
  ],
};

export const entityWithoutScoringData: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'System',
  metadata: {
    name: 'no-scoring-data-system',
    description: 'System without scoring data',
    annotations: {},
  },
};

export const entityTeamC: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'team-c',
    description: 'Team C',
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

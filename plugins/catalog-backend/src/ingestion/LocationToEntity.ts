/*
 * Copyright 2021 Spotify AB
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

import { Entity, EntityName } from '@backstage/catalog-model';

export function locationToEntity(type: string, target: string): Entity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Location',
    metadata: {
      name: `${type}:${target}`,
      namespace: 'default',
    },
    spec: {
      location: { type, target },
    },
  };
}

export function locationToEntityName(type: string, target: string): EntityName {
  return {
    kind: 'Location',
    namespace: 'default',
    name: `${type}:${target}`,
  };
}

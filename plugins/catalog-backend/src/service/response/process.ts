/*
 * Copyright 2024 The Backstage Authors
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
import { EntitiesResponseItems } from '../../catalog/types';

export function processRawEntitiesResult(
  serializedEntities: (string | null)[],
  transform?: (entity: Entity) => Entity,
): EntitiesResponseItems {
  if (transform) {
    return {
      type: 'object',
      entities: serializedEntities.map(e =>
        e !== null ? transform(JSON.parse(e)) : e,
      ),
    };
  }

  return {
    type: 'raw',
    entities: serializedEntities,
  };
}

export function processEntitiesResponseItems(
  response: EntitiesResponseItems,
  transform?: (entity: Entity) => Entity,
): EntitiesResponseItems {
  if (!transform) {
    return response;
  }
  if (response.type === 'raw') {
    return processRawEntitiesResult(response.entities, transform);
  }
  return {
    type: 'object',
    entities: response.entities.map(e => (e !== null ? transform(e) : e)),
  };
}

export function entitiesResponseToObjects(
  response: EntitiesResponseItems,
): (Entity | null)[] {
  if (response.type === 'object') {
    return response.entities;
  }
  return response.entities.map(e => (e !== null ? JSON.parse(e) : e));
}

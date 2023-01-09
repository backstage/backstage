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
import type { CatalogClient } from '@backstage/catalog-client';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import DataLoader from 'dataloader';
import { EnvelopError } from '@envelop/core';
import type { EntityRef, Loader } from './types';

export function createLoader(
  catalog: Pick<CatalogClient, 'getEntitiesByRefs'>,
): Loader {
  return new DataLoader<EntityRef, Entity>(
    async (refs): Promise<Array<Entity | Error>> => {
      const entityRefs: string[] = refs.map(ref =>
        typeof ref === 'string' ? ref : stringifyEntityRef(ref),
      );
      const result = await catalog.getEntitiesByRefs({ entityRefs });
      return result.items.map(
        (entity, index) =>
          entity ?? new EnvelopError(`no such node with ref: '${refs[index]}'`),
      );
    },
  );
}

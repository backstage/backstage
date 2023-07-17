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
import type { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { NodeQuery } from '@backstage/plugin-graphql-common';
import { GraphQLError } from 'graphql';

export const createEntitiesLoadFn =
  (catalog: CatalogApi) =>
  async (
    queries: readonly (NodeQuery | undefined)[],
  ): Promise<Array<Entity | GraphQLError>> => {
    // TODO: Support fields
    const entityRefs = queries.reduce(
      (refs, { ref } = {}, index) => (ref ? refs.set(index, ref) : refs),
      new Map<number, string>(),
    );
    const refEntries = [...entityRefs.entries()];
    const result = await catalog.getEntitiesByRefs({
      entityRefs: refEntries.map(([, ref]) => ref),
    });
    const entities: (Entity | GraphQLError)[] = Array.from({
      length: queries.length,
    });
    refEntries.forEach(
      ([key], index) =>
        (entities[key] =
          result.items[index] ??
          new GraphQLError(`no such entity with ref: '${queries[index]}'`)),
    );
    return entities;
  };

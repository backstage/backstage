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
import { useEffect } from 'react';
import { useEntityStore } from './useEntityStore';

/**
 * Discover the graph of entities connected by relations, starting from a set of
 * root entities. Filters are used to select which relations to includes.
 * Returns all discovered entities once they are loaded.
 */
export function useEntityRelationGraph({
  rootEntityRefs,
  filter: { maxDepth = Number.POSITIVE_INFINITY, relations, kinds } = {},
}: {
  rootEntityRefs: string[];
  filter?: {
    maxDepth?: number;
    relations?: string[];
    kinds?: string[];
  };
}): {
  entities?: { [key: string]: Entity };
  loading: boolean;
  error?: Error;
} {
  const { entities, loading, error, requestEntities } = useEntityStore();

  useEffect(() => {
    const expectedEntities = new Set([...rootEntityRefs]);
    const processedEntityRefs = new Set<string>();

    let nextDepthRefQueue = [...rootEntityRefs];
    let depth = 0;

    while (
      nextDepthRefQueue.length > 0 &&
      (!isFinite(maxDepth) || depth < maxDepth)
    ) {
      const entityRefQueue = nextDepthRefQueue;
      nextDepthRefQueue = [];

      while (entityRefQueue.length > 0) {
        const entityRef = entityRefQueue.shift()!;
        const entity = entities[entityRef];

        processedEntityRefs.add(entityRef);

        if (entity && entity.relations) {
          for (const rel of entity.relations) {
            if (
              (!relations || relations.includes(rel.type)) &&
              (!kinds || kinds.includes(rel.target.kind.toLowerCase()))
            ) {
              const relationEntityRef = stringifyEntityRef(rel.target);

              if (!processedEntityRefs.has(relationEntityRef)) {
                nextDepthRefQueue.push(relationEntityRef);
                expectedEntities.add(relationEntityRef);
              }
            }
          }
        }
      }

      ++depth;
    }

    requestEntities([...expectedEntities]);
  }, [entities, rootEntityRefs, maxDepth, relations, kinds, requestEntities]);

  return {
    entities,
    loading,
    error,
  };
}

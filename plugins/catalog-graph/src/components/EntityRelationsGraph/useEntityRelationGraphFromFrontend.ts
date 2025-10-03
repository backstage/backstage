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
import { useEffect, useMemo } from 'react';
import { useEntityStore } from './useEntityStore';
import { useRelations } from '../../hooks/useRelations';

/**
 * Discover the graph of entities connected by relations, starting from a set of
 * root entities. Filters are used to select which relations to includes.
 * Returns all discovered entities once they are loaded.
 */
export function useEntityRelationGraphFromFrontend(
  {
    rootEntityRefs,
    maxDepth = Number.POSITIVE_INFINITY,
    relations,
    kinds,
  }: {
    rootEntityRefs: string[];
    maxDepth?: number;
    relations?: string[];
    kinds?: string[];
  },
  { noFetch }: { noFetch: boolean },
): {
  entities?: { [ref: string]: Entity };
  loading: boolean;
  error?: Error;
} {
  const { entities, loading, error, requestEntities } = useEntityStore();
  const { includeRelation } = useRelations({ relations });

  useEffect(() => {
    if (noFetch) {
      return;
    }

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
              includeRelation(rel.type) &&
              (!kinds ||
                kinds.some(kind =>
                  rel.targetRef.startsWith(
                    `${kind.toLocaleLowerCase('en-US')}:`,
                  ),
                ))
            ) {
              if (!processedEntityRefs.has(rel.targetRef)) {
                nextDepthRefQueue.push(rel.targetRef);
                expectedEntities.add(rel.targetRef);
              }
            }
          }
        }
      }

      ++depth;
    }
    requestEntities([...expectedEntities]);
  }, [
    noFetch,
    entities,
    rootEntityRefs,
    maxDepth,
    includeRelation,
    kinds,
    requestEntities,
  ]);

  const filteredEntities = useMemo(() => {
    if (loading || noFetch) {
      return {};
    }

    return entities;
  }, [loading, noFetch, entities]);

  return {
    entities: filteredEntities,
    loading,
    error,
  };
}

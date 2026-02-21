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
import { useMemo } from 'react';
import { useRelations } from '../../hooks/useRelations';

const emptySet = {};

/**
 * Filter the graph entities already fetched from the backend, using
 * `entityFilter`, if such is provided.
 */
export function useEntityRelationGraphFilter({
  rootEntityRefs,
  maxDepth = Number.POSITIVE_INFINITY,
  relations,
  kinds,
  entityFilter,
  allEntities,
}: {
  rootEntityRefs: string[];
  maxDepth?: number;
  relations?: string[];
  kinds?: string[];
  entityFilter?: (entity: Entity) => boolean;
  allEntities?: { [ref: string]: Entity };
}): { [ref: string]: Entity } {
  const { includeRelation } = useRelations({ relations });

  return useMemo(() => {
    if (!allEntities || Object.keys(allEntities).length === 0) {
      return emptySet;
    }

    const entities: { [ref: string]: Entity } = {};

    const processedEntityRefs = new Set<string>();

    let nextDepthRefQueue = [...rootEntityRefs];
    let depth = 0;

    while (
      nextDepthRefQueue.length > 0 &&
      // The backend fetching uses maxDepth + 1 for small graphs, so to quickly
      // have the graph ready if depth is increased.
      // Hence necessary here as well.
      (!isFinite(maxDepth) || depth < maxDepth + 1)
    ) {
      const entityRefQueue = nextDepthRefQueue;
      nextDepthRefQueue = [];

      while (entityRefQueue.length > 0) {
        const entityRef = entityRefQueue.shift()!;
        const entity = allEntities[entityRef];

        processedEntityRefs.add(entityRef);

        if (entity) {
          entities[entityRef] = entity;
        }

        if (entity && entity.relations) {
          // If the entity is filtered out then no need to check any
          // of its outgoing relationships to other entities
          if (entityFilter && !entityFilter(entity)) {
            continue;
          }
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
              }
            }
          }
        }
      }

      ++depth;
    }

    return entities;
  }, [
    allEntities,
    rootEntityRefs,
    maxDepth,
    includeRelation,
    kinds,
    entityFilter,
  ]);
}

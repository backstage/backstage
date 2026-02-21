/*
 * Copyright 2025 The Backstage Authors
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

import type { EntityEdge, RelationPairs } from '../types';

export interface BuildGraphOptions {
  rootEntityRefs: readonly string[];
  entities: {
    [ref: string]: Entity;
  };
  includeRelation: (type: string) => boolean;
  kinds: readonly string[] | undefined;
  mergeRelations: boolean;
  relationPairs: RelationPairs;
  unidirectional: boolean;
}

function kindOfEntityRef(entityRef: string) {
  const i = entityRef.indexOf(':');
  return i >= 0 ? entityRef.substring(0, i) : '';
}

function getEdgeKey(from: string, to: string) {
  return `${from} ! ${to}`;
}

export function buildGraph({
  rootEntityRefs,
  entities,
  includeRelation,
  kinds,
  mergeRelations,
  relationPairs,
  unidirectional,
}: BuildGraphOptions): EntityEdge[] {
  const visitedNodes = new Set<string>();
  const nodeQueue = [...rootEntityRefs];

  const kindSet = kinds
    ? new Set(kinds.map(k => k.toLocaleLowerCase('en-US')))
    : undefined;

  // from-to map to edges
  const edgeMap = new Map<string, EntityEdge[]>();

  const addEdge = (edge: EntityEdge) => {
    const key = getEdgeKey(edge.from, edge.to);
    const curEdges = edgeMap.get(key);
    if (curEdges) {
      curEdges.push(edge);
    } else {
      edgeMap.set(key, [edge]);
    }
  };

  const hasEdge = (
    fromRef: string,
    toRef: string,
    relation: [string, string?],
  ): boolean => {
    const foundEdges = edgeMap.get(getEdgeKey(fromRef, toRef));
    return !!foundEdges?.some(edge =>
      edge.relations.some(
        rel => rel[0] === relation[0] && rel[1] === relation[1],
      ),
    );
  };

  while (nodeQueue.length > 0) {
    const entityRef = nodeQueue.pop()!;
    const entity = entities[entityRef];
    visitedNodes.add(entityRef);

    if (entity) {
      entity?.relations?.forEach(rel => {
        // Check if the related entity should be displayed, if not, ignore
        // the relation too
        if (!entities[rel.targetRef]) {
          return;
        }

        if (!includeRelation(rel.type)) {
          return;
        }

        if (kindSet && !kindSet.has(kindOfEntityRef(rel.targetRef))) {
          return;
        }

        if (mergeRelations) {
          const pair = relationPairs.find(
            ([l, r]) => l === rel.type || r === rel.type,
          ) ?? [rel.type];
          const [left] = pair;
          const from = left === rel.type ? entityRef : rel.targetRef;
          const to = left === rel.type ? rel.targetRef : entityRef;
          if (!unidirectional || !hasEdge(from, to, pair)) {
            addEdge({
              from,
              to,
              relations: pair,
              label: 'visible',
            });
          }
        } else {
          if (
            !unidirectional ||
            !hasEdge(entityRef, rel.targetRef, [rel.type])
          ) {
            addEdge({
              from: entityRef,
              to: rel.targetRef,
              relations: [rel.type],
              label: 'visible',
            });
          }
        }

        if (!visitedNodes.has(rel.targetRef)) {
          nodeQueue.push(rel.targetRef);
          visitedNodes.add(rel.targetRef);
        }

        // if unidirectional add missing relations as entities are only visited once
        if (unidirectional) {
          const foundEdge = edgeMap
            .get(getEdgeKey(entityRef, rel.targetRef))
            ?.find(edge => !edge.relations.includes(rel.type));
          if (foundEdge) {
            if (mergeRelations) {
              const pair = relationPairs.find(
                ([l, r]) => l === rel.type || r === rel.type,
              ) ?? [rel.type];
              foundEdge.relations = [...foundEdge.relations, ...pair];
            } else {
              foundEdge.relations = [...foundEdge.relations, rel.type];
            }
          }
        }
      });
    }
  }

  return Array.from(edgeMap.values()).flat(1);
}

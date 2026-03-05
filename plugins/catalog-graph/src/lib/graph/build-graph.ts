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

export function buildGraph({
  rootEntityRefs,
  entities,
  includeRelation,
  kinds,
  mergeRelations,
  relationPairs,
  unidirectional,
}: BuildGraphOptions): EntityEdge[] {
  const edges: EntityEdge[] = [];
  const visitedNodes = new Set<string>();
  const nodeQueue = [...rootEntityRefs];

  const hasEdge = (
    fromRef: string,
    toRef: string,
    relation: [string, string?],
  ): boolean => {
    return edges.some(
      edge =>
        fromRef === edge.from &&
        toRef === edge.to &&
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

        if (
          kinds &&
          !kinds.some(kind =>
            rel.targetRef.startsWith(`${kind.toLocaleLowerCase('en-US')}:`),
          )
        ) {
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
            edges.push({
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
            edges.push({
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
          const findIndex = edges.findIndex(
            edge =>
              entityRef === edge.from &&
              rel.targetRef === edge.to &&
              !edge.relations.includes(rel.type),
          );
          if (findIndex >= 0) {
            if (mergeRelations) {
              const pair = relationPairs.find(
                ([l, r]) => l === rel.type || r === rel.type,
              ) ?? [rel.type];
              edges[findIndex].relations = [
                ...edges[findIndex].relations,
                ...pair,
              ];
            } else {
              edges[findIndex].relations = [
                ...edges[findIndex].relations,
                rel.type,
              ];
            }
          }
        }
      });
    }
  }

  return edges;
}

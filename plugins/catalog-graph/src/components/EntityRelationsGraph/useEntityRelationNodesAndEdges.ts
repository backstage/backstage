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
import { MouseEvent, useState } from 'react';
import useDebounce from 'react-use/esm/useDebounce';
import { RelationPairs, ALL_RELATION_PAIRS } from './relations';
import { EntityEdge, EntityNode } from './types';
import { useEntityRelationGraph } from './useEntityRelationGraph';
import { Entity, DEFAULT_NAMESPACE } from '@backstage/catalog-model';

/**
 * Generate nodes and edges to render the entity graph.
 */
export function useEntityRelationNodesAndEdges({
  rootEntityRefs,
  maxDepth = Number.POSITIVE_INFINITY,
  unidirectional = true,
  mergeRelations = true,
  kinds,
  relations,
  entityFilter,
  onNodeClick,
  relationPairs = ALL_RELATION_PAIRS,
}: {
  rootEntityRefs: string[];
  maxDepth?: number;
  unidirectional?: boolean;
  mergeRelations?: boolean;
  kinds?: string[];
  relations?: string[];
  entityFilter?: (entity: Entity) => boolean;
  onNodeClick?: (value: EntityNode, event: MouseEvent<unknown>) => void;
  relationPairs?: RelationPairs;
}): {
  loading: boolean;
  nodes?: EntityNode[];
  edges?: EntityEdge[];
  error?: Error;
} {
  const [nodesAndEdges, setNodesAndEdges] = useState<{
    nodes?: EntityNode[];
    edges?: EntityEdge[];
  }>({});
  const { entities, loading, error } = useEntityRelationGraph({
    rootEntityRefs,
    filter: {
      maxDepth,
      kinds,
      relations,
      entityFilter,
    },
  });

  useDebounce(
    () => {
      if (!entities || Object.keys(entities).length === 0) {
        setNodesAndEdges({});
        return;
      }

      const nodes = Object.entries(entities).map(([entityRef, entity]) => {
        const focused = rootEntityRefs.includes(entityRef);
        const node: EntityNode = {
          id: entityRef,
          entity,
          focused,
          color: focused ? 'secondary' : 'primary',
          // @deprecated
          kind: entity.kind,
          name: entity.metadata.name,
          namespace: entity.metadata.namespace || DEFAULT_NAMESPACE,
          title: entity.metadata.title,
          spec: entity.spec,
        };

        if (onNodeClick) {
          node.onClick = event => onNodeClick(node, event);
        }

        return node;
      });

      const edges: EntityEdge[] = [];
      const visitedNodes = new Set<string>();
      const nodeQueue = [...rootEntityRefs];

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

            if (relations && !relations.includes(rel.type)) {
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

            if (!unidirectional || !visitedNodes.has(rel.targetRef)) {
              if (mergeRelations) {
                const pair = relationPairs.find(
                  ([l, r]) => l === rel.type || r === rel.type,
                ) ?? [rel.type];
                const [left] = pair;

                edges.push({
                  from: left === rel.type ? entityRef : rel.targetRef,
                  to: left === rel.type ? rel.targetRef : entityRef,
                  relations: pair,
                  label: 'visible',
                });
              } else {
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

      // Reduce edges as the dependency graph anyway ignores duplicated edges regarding from / to
      // Additionally, this will improve rendering speed for the dependency graph
      const finalEdges = edges.reduce((previousEdges, currentEdge) => {
        const indexFound = previousEdges.findIndex(
          previousEdge =>
            previousEdge.from === currentEdge.from &&
            previousEdge.to === currentEdge.to,
        );
        if (indexFound >= 0) {
          previousEdges[indexFound] = {
            ...previousEdges[indexFound],
            relations: Array.from(
              new Set([
                ...previousEdges[indexFound].relations,
                ...currentEdge.relations,
              ]),
            ),
          };
          return previousEdges;
        }
        return [...previousEdges, currentEdge];
      }, [] as EntityEdge[]);

      setNodesAndEdges({ nodes, edges: finalEdges });
    },
    100,
    [
      entities,
      rootEntityRefs,
      kinds,
      relations,
      unidirectional,
      mergeRelations,
      onNodeClick,
      relationPairs,
    ],
  );

  return {
    loading,
    error,
    ...nodesAndEdges,
  };
}

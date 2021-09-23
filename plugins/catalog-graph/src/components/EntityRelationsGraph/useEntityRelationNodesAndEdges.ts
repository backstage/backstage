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
import {
  ENTITY_DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { MouseEvent, useState } from 'react';
import { useDebounce } from 'react-use';
import { RelationPairs, ALL_RELATION_PAIRS } from './relations';
import { EntityEdge, EntityNode } from './types';
import { useEntityRelationGraph } from './useEntityRelationGraph';

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
  onNodeClick,
  relationPairs = ALL_RELATION_PAIRS,
}: {
  rootEntityRefs: string[];
  maxDepth?: number;
  unidirectional?: boolean;
  mergeRelations?: boolean;
  kinds?: string[];
  relations?: string[];
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
          title: entity.metadata?.title ?? undefined,
          kind: entity.kind,
          name: entity.metadata.name,
          namespace: entity.metadata.namespace ?? ENTITY_DEFAULT_NAMESPACE,
          focused,
          color: focused ? 'secondary' : 'primary',
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
            const targetRef = stringifyEntityRef(rel.target);

            // Check if the related entity should be displayed, if not, ignore
            // the relation too
            if (!entities[targetRef]) {
              return;
            }

            if (relations && !relations.includes(rel.type)) {
              return;
            }

            if (
              kinds &&
              !kinds.includes(rel.target.kind.toLocaleLowerCase('en-US'))
            ) {
              return;
            }

            if (!unidirectional || !visitedNodes.has(targetRef)) {
              if (mergeRelations) {
                const pair = relationPairs.find(
                  ([l, r]) => l === rel.type || r === rel.type,
                ) ?? [rel.type];
                const [left] = pair;

                edges.push({
                  from: left === rel.type ? entityRef : targetRef,
                  to: left === rel.type ? targetRef : entityRef,
                  relations: pair,
                  label: 'visible',
                });
              } else {
                edges.push({
                  from: entityRef,
                  to: targetRef,
                  relations: [rel.type],
                  label: 'visible',
                });
              }
            }

            if (!visitedNodes.has(targetRef)) {
              nodeQueue.push(targetRef);
              visitedNodes.add(targetRef);
            }
          });
        }
      }

      setNodesAndEdges({ nodes, edges });
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

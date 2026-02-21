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

import { EntityEdge } from '../types';
import { GraphTransformer } from './types';

/** Orders the edges direction so that the graph goes strictly forward */
export const orderForward: GraphTransformer = ({
  rootEntityRefs,
  nodes,
  edges,
}) => {
  const entityEdges = new Map<string, EntityEdge[]>();
  edges.forEach(edge => {
    let fromEdges = entityEdges.get(edge.from);
    if (!fromEdges) {
      fromEdges = [];
      entityEdges.set(edge.from, fromEdges);
    }
    fromEdges.push(edge);

    let toEdges = entityEdges.get(edge.to);
    if (!toEdges) {
      toEdges = [];
      entityEdges.set(edge.to, toEdges);
    }
    toEdges.push(edge);
  });

  const visitedNodes = new Set<string>();

  for (const rootEntityRef of rootEntityRefs) {
    let currentNodes: string[] = [rootEntityRef].filter(
      node => !visitedNodes.has(node),
    );

    while (currentNodes.length > 0) {
      for (const currentNode of currentNodes) {
        visitedNodes.add(currentNode);
      }

      const nextNodes = new Set<string>();

      currentNodes.forEach(node => {
        entityEdges.get(node)?.forEach(edge => {
          if (edge.to === node && !visitedNodes.has(edge.from)) {
            // Reverse direction
            const { from, to } = edge;
            edge.from = to;
            edge.to = from;
            edge.relations.reverse();
          }

          nextNodes.add(edge.from);
          nextNodes.add(edge.to);
        });
      });

      currentNodes = Array.from(nextNodes).filter(
        node => !visitedNodes.has(node),
      );
    }
  }

  const nodeOrder = Array.from(visitedNodes);

  nodes.sort((a, b) => {
    const aOrder = nodeOrder.findIndex(node => node === a.id);
    const bOrder = nodeOrder.findIndex(node => node === b.id);
    return aOrder - bOrder;
  });
};

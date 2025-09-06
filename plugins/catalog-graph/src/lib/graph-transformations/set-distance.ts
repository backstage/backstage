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

/** Set the distance of each edge to the distance from a root entity */
export const setDistances: GraphTransformer = ({
  nodeDistances,
  edges,
  rootEntityRefs,
}) => {
  const edgeMap = new Map<string, EntityEdge[]>();
  edges.forEach(edge => {
    const fromEdges = edgeMap.get(edge.from) ?? [];
    fromEdges.push(edge);
    edgeMap.set(edge.from, fromEdges);

    const toEdges = edgeMap.get(edge.to) ?? [];
    toEdges.push(edge);
    edgeMap.set(edge.to, toEdges);
  });

  rootEntityRefs.forEach(rootEntityRef => {
    nodeDistances.set(rootEntityRef, 0);
  });
  const visitedNodes = new Set<string>(rootEntityRefs);
  let currentNodes = rootEntityRefs;
  let distance = 0;

  while (currentNodes.length > 0) {
    const thisDistance = ++distance;

    const nextNodes: string[] = [];
    currentNodes.forEach(node => {
      edgeMap.get(node)?.forEach(edge => {
        edge.distance ??= thisDistance;

        const fromDistance = nodeDistances.get(edge.from) ?? thisDistance;
        nodeDistances.set(edge.from, fromDistance);
        nextNodes.push(edge.from);

        const toDistance = nodeDistances.get(edge.to) ?? thisDistance;
        nodeDistances.set(edge.to, toDistance);
        nextNodes.push(edge.to);
      });
    });

    for (const currentNode of currentNodes) {
      visitedNodes.add(currentNode);
    }

    currentNodes = Array.from(new Set(nextNodes)).filter(
      node => !visitedNodes.has(node),
    );
  }
};

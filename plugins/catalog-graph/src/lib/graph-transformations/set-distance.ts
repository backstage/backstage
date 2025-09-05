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

function minDistance(a: number | undefined, b: number | undefined) {
  if (typeof a === 'undefined') return b;
  if (typeof b === 'undefined') return a;
  return Math.min(a, b);
}

/** Set the distance of each edge to the distance from a root entity */
export const setDistances: GraphTransformer = ({
  nodeDistances,
  edges,
  rootEntityRefs,
}) => {
  const edgeMap = new Map<string, EntityEdge[]>();
  edges.forEach(edge => {
    const fromEdges = edgeMap.get(edge.from) ?? [];
    edgeMap.set(edge.from, [...fromEdges, edge]);

    const toEdges = edgeMap.get(edge.to) ?? [];
    edgeMap.set(edge.to, [...toEdges, edge]);
  });

  // Sets the distance on as many edges as possible.
  // Returns true if all edges have a distance
  const setEdgeDistances = () => {
    return (
      edges.filter(edge => {
        if (
          rootEntityRefs.includes(edge.from) ||
          rootEntityRefs.includes(edge.to)
        ) {
          edge.distance = 1;
          return false;
        }

        const distance = minDistance(
          edgeMap
            .get(edge.from)!
            .reduce(
              (prev, cur) => minDistance(prev, cur.distance),
              undefined as number | undefined,
            ),
          edgeMap
            .get(edge.to)!
            .reduce(
              (prev, cur) => minDistance(prev, cur.distance),
              undefined as number | undefined,
            ),
        );

        if (typeof distance !== 'undefined') {
          edge.distance = minDistance(edge.distance, distance + 1);
        }
        return typeof edge.distance === 'undefined';
      }).length === 0
    );
  };

  let distanceComplete = false;
  while (!distanceComplete) {
    distanceComplete = setEdgeDistances();
  }

  rootEntityRefs.forEach(rootEntityRef => {
    nodeDistances.set(rootEntityRef, 0);
  });
  edges.forEach(edge => {
    const curFrom = nodeDistances.get(edge.from);
    const curTo = nodeDistances.get(edge.to);

    const fromDistance = minDistance(curFrom, edge.distance);
    const toDistance = minDistance(curTo, edge.distance);
    if (typeof fromDistance !== 'undefined') {
      nodeDistances.set(edge.from, fromDistance);
    }
    if (typeof toDistance !== 'undefined') {
      nodeDistances.set(edge.to, toDistance);
    }
  });
};

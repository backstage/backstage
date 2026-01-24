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

/**
 * Removes edges that are further away then other edges leading up to the root.
 */
export const stripDistantEdges: GraphTransformer = options => {
  const entityEdges = new Map<string, EntityEdge[]>();
  options.edges.forEach(edge => {
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

  // Remove edges that are further away than other edges leading up to the root
  options.edges = options.edges.filter(edge => {
    // Get all edges of the 'from' node except this (and similar) edge
    const fromEdges = entityEdges
      .get(edge.from)!
      .filter(
        fromEdge =>
          !(fromEdge.from === edge.from && fromEdge.to === edge.to) &&
          !(fromEdge.from === edge.to && fromEdge.to === edge.from),
      );
    // Get all edges of the 'from' node except this (and similar) edge
    const toEdges = entityEdges
      .get(edge.to)!
      .filter(
        toEdge =>
          !(toEdge.from === edge.from && toEdge.to === edge.to) &&
          !(toEdge.from === edge.to && toEdge.to === edge.from),
      );

    if (fromEdges.length === 0 || toEdges.length === 0) {
      return true;
    }

    const shorterFrom = fromEdges.some(
      fromEdge => (fromEdge.distance ?? 0) < (edge.distance ?? 0),
    );
    const shorterTo = toEdges.some(
      toEdge => (toEdge.distance ?? 0) < (edge.distance ?? 0),
    );

    if (shorterFrom && shorterTo) {
      // There are shorter edges from both 'from' and 'to' leading to the root,
      // exclude this edge
      return false;
    }
    return true;
  });
};

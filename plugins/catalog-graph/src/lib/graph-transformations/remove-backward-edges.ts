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
 * Remove edges going backwards, if unidirectional and we haven't already
 * merged the relations
 */
export const removeBackwardEdges: GraphTransformer = ctx => {
  const { forwardRelations, edges } = ctx;

  const edgesMapFrom = new Map<string, EntityEdge[]>();

  edges.forEach(edge => {
    const theseEdges = edgesMapFrom.get(edge.from) ?? [];
    theseEdges.push(edge);
    edgesMapFrom.set(edge.from, theseEdges);
  });

  ctx.edges = edges.filter(edge => {
    if (edge.relations.length === 2) {
      // If there are two relations, only keep the forward one
      if (!forwardRelations.includes(edge.relations[1])) {
        edge.relations.pop();
      }
      if (!forwardRelations.includes(edge.relations[0])) {
        edge.relations.pop();
      }
      return edge.relations.length > 0;
    } else if (edge.relations.length === 1) {
      // If there is only one relation and it's backwards, remove it
      if (!forwardRelations.includes(edge.relations[0])) {
        return false;
      }
    }
    return true;
  });
};

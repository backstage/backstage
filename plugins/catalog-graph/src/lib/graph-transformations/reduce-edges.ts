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
 * Reduce edges as the dependency graph anyway ignores duplicated edges
 * regarding from / to
 * Additionally, this will improve rendering speed for the dependency graph
 */
export const reduceEdges: GraphTransformer = ctx => {
  ctx.edges = ctx.edges.reduce((previousEdges, currentEdge) => {
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
};

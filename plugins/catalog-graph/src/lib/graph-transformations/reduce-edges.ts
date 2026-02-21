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
  const edgeMap = new Map<string, EntityEdge>();

  ctx.edges.forEach(currentEdge => {
    const edgeKey = `${currentEdge.from} ! ${currentEdge.to}`;

    const edgeFound = edgeMap.get(edgeKey);

    if (edgeFound) {
      edgeFound.relations = Array.from(
        new Set([...edgeFound.relations, ...currentEdge.relations]),
      );
      return;
    }

    edgeMap.set(edgeKey, currentEdge);
  });

  ctx.edges = Array.from(edgeMap.values());
};

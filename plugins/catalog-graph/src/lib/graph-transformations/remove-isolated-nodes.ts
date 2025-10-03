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

import { GraphTransformer } from './types';

/**
 * Remove isolated nodes. These can occur if unidirectional is true, and all
 * edges have been removed (e.g. they are too far away from the roots).
 */
export const removeIsolatedNodes: GraphTransformer = ctx => {
  const nodesWithEdges = new Set<string>();

  ctx.edges.forEach(edge => {
    nodesWithEdges.add(edge.from);
    nodesWithEdges.add(edge.to);
  });

  ctx.nodes = ctx.nodes.filter(node => nodesWithEdges.has(node.id));
};

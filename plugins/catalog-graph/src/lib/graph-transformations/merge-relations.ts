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

function concatRelations(
  a: readonly string[] | undefined,
  b: readonly string[] | undefined,
): string[] {
  return Array.from(new Set<string>([...(a ?? []), ...(b ?? [])]));
}

/** Merge relations in multiple edges into one edge */
export const mergeRelations: GraphTransformer = options => {
  const mergedEdges = new Map<string, EntityEdge>();

  options.edges.forEach(edge => {
    const keyForward = `${edge.from}-${edge.to}`;
    const keyBackward = `${edge.to}-${edge.from}`;

    const edgeForward = mergedEdges.get(keyForward);
    const edgeBackward = mergedEdges.get(keyBackward);

    if (edgeForward) {
      edgeForward.relations = concatRelations(
        edgeForward.relations,
        edge.relations,
      );
    } else if (edgeBackward) {
      edgeBackward.relations = concatRelations(
        edgeBackward.relations,
        edge.relations,
      );
    } else {
      mergedEdges.set(keyForward, edge);
    }
  });

  options.edges = Array.from(mergedEdges.values());
};

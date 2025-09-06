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

import { EntityEdge, EntityNode } from '../types';

/**
 * Contextual information for a graph transformation.
 *
 * @public
 */
export interface TransformationContext {
  /**
   * The distance from an entity node to a root entity
   *
   * NOTE: This is empty until the 'set-distances' transformation is applied
   */
  nodeDistances: Map<string, number>;

  edges: EntityEdge[];
  nodes: EntityNode[];

  // Options:
  rootEntityRefs: string[];
  unidirectional: boolean;
  maxDepth: number;
}

/**
 * A function that transforms a graph. The function modifies `nodes` and `edges`
 * in place.
 *
 * @public
 */
export type GraphTransformer = (context: TransformationContext) => void;

/**
 * A function that debugs a graph transformation.
 * It is given the three arguments:
 *  * The transformation that was just applied (or undefined before the first
 *    transformation). If the transformation is a function, its `.name` property
 *    will be used.
 *  * The current state (context) of the graph, which _can_ be mutated
 *  * A cloned copy of the context, useful for logging (as transformations are
 *    made in place, the original context is modified and the logs will be
 *    confusing)
 *
 * @public
 */
export type GraphTransformationDebugger = (
  transformation: string | undefined,
  transformationContext: TransformationContext,
  clonedContext: TransformationContext,
) => void;

/** @internal */
export function cloneTransformationContext(
  transformationContext: TransformationContext,
): TransformationContext {
  const clonesContext = JSON.parse(
    JSON.stringify(transformationContext),
  ) as TransformationContext;
  clonesContext.edges = clonesContext.edges.sort((a, b) => {
    return a.from.localeCompare(b.from) || a.to.localeCompare(b.to);
  });

  clonesContext.nodeDistances = new Map(transformationContext.nodeDistances);

  return clonesContext;
}

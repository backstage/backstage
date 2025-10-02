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

export type { GraphTransformer, TransformationContext } from './types';

import { reduceEdges } from './reduce-edges';
import { setDistances } from './set-distance';
import { orderForward } from './order-forward';
import { stripDistantEdges } from './strip-distant-edges';
import { mergeRelations } from './merge-relations';
import { removeBackwardEdges } from './remove-backward-edges';

export const builtInTransformations = {
  'reduce-edges': reduceEdges,
  'set-distances': setDistances,
  'order-forward': orderForward,
  'strip-distant-edges': stripDistantEdges,
  'merge-relations': mergeRelations,
  'remove-backward-edges': removeBackwardEdges,
};

export type BuiltInTransformations = keyof typeof builtInTransformations;

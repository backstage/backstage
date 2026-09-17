/*
 * Copyright 2026 The Backstage Authors
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

import { OpDeclareAnnotationV1 } from './declareAnnotation';
import { OpDeclareKindV1 } from './declareKind';
import { OpDeclareKindVersionV1 } from './declareKindVersion';
import { OpDeclareLabelV1 } from './declareLabel';
import { OpDeclareRelationV1 } from './declareRelation';
import { OpDeclareTagV1 } from './declareTag';
import { OpRemoveAnnotationV1 } from './removeAnnotation';
import { OpRemoveKindV1 } from './removeKind';
import { OpRemoveLabelV1 } from './removeLabel';
import { OpRemoveTagV1 } from './removeTag';
import { OpUpdateAnnotationV1 } from './updateAnnotation';
import { OpUpdateKindV1 } from './updateKind';
import { OpUpdateKindVersionV1 } from './updateKindVersion';
import { OpUpdateLabelV1 } from './updateLabel';
import { OpUpdateRelationV1 } from './updateRelation';
import { OpUpdateTagV1 } from './updateTag';

export type {
  OpDeclareAnnotationV1,
  OpDeclareKindV1,
  OpDeclareKindVersionV1,
  OpDeclareLabelV1,
  OpDeclareRelationV1,
  OpDeclareTagV1,
  OpRemoveAnnotationV1,
  OpRemoveKindV1,
  OpRemoveLabelV1,
  OpRemoveTagV1,
  OpUpdateAnnotationV1,
  OpUpdateKindV1,
  OpUpdateKindVersionV1,
  OpUpdateLabelV1,
  OpUpdateRelationV1,
  OpUpdateTagV1,
};

export type CatalogModelOp =
  | OpDeclareAnnotationV1
  | OpDeclareKindV1
  | OpDeclareKindVersionV1
  | OpDeclareLabelV1
  | OpDeclareRelationV1
  | OpDeclareTagV1
  | OpRemoveAnnotationV1
  | OpRemoveKindV1
  | OpRemoveLabelV1
  | OpRemoveTagV1
  | OpUpdateAnnotationV1
  | OpUpdateKindV1
  | OpUpdateKindVersionV1
  | OpUpdateLabelV1
  | OpUpdateRelationV1
  | OpUpdateTagV1;

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

export { type CatalogModelAnnotationDefinition } from './addAnnotation';
export {
  type CatalogModelKindDefinition,
  type CatalogModelKindRelationFieldDefinition,
  type CatalogModelKindVersionDefinition,
} from './addKind';
export { type CatalogModelLabelDefinition } from './addLabel';
export { type CatalogModelRelationPairDefinition } from './addRelationPair';
export { type CatalogModelRemoveAnnotationDefinition } from './removeAnnotation';
export { type CatalogModelRemoveKindDefinition } from './removeKind';
export { type CatalogModelRemoveLabelDefinition } from './removeLabel';
export { type CatalogModelRemoveTagDefinition } from './removeTag';
export { type CatalogModelTagDefinition } from './addTag';
export { type CatalogModelUpdateAnnotationDefinition } from './updateAnnotation';
export {
  type CatalogModelUpdateKindDefinition,
  type CatalogModelUpdateKindVersionDefinition,
} from './updateKind';
export { type CatalogModelUpdateLabelDefinition } from './updateLabel';
export { type CatalogModelUpdateRelationPairDefinition } from './updateRelationPair';
export { type CatalogModelUpdateTagDefinition } from './updateTag';

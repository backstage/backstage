/*
 * Copyright 2020 The Backstage Authors
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

export * from './conditions';
export {
  DEFAULT_NAMESPACE,
  ANNOTATION_EDIT_URL,
  ANNOTATION_VIEW_URL,
  ANNOTATION_KUBERNETES_API_SERVER,
  ANNOTATION_KUBERNETES_API_SERVER_CA,
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
} from './constants';
export type {
  AlphaEntity,
  Entity,
  EntityLink,
  EntityMeta,
  EntityRelation,
} from './Entity';
export type { EntityEnvelope } from './EntityEnvelope';
export type {
  EntityStatus,
  EntityStatusItem,
  EntityStatusLevel,
} from './EntityStatus';
export * from './policies';
export {
  getCompoundEntityRef,
  parseEntityRef,
  stringifyEntityRef,
} from './ref';

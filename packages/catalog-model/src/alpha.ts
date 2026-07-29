/*
 * Copyright 2023 The Backstage Authors
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

export type {
  Entity,
  EntityLink,
  EntityMeta,
  EntityRelation,
} from './entity/Entity';
export type { KindValidator } from './kinds/types';
export type { AlphaEntity } from './entity/AlphaEntity';
export type {
  EntityStatus,
  EntityStatusItem,
  EntityStatusLevel,
} from './entity/EntityStatus';
export type {
  AiResourceEntityV1alpha1,
  AiResourceEntityV1alpha1Default,
  SkillAiResourceEntityV1alpha1,
  RuleAiResourceEntityV1alpha1,
} from './kinds/AiResourceEntityV1alpha1';
export {
  aiResourceEntityV1alpha1Validator,
  skillAiResourceEntityV1alpha1Validator,
  ruleAiResourceEntityV1alpha1Validator,
  isAiResourceEntity,
  isSkillAiResourceEntity,
  isRuleAiResourceEntity,
  aiResourceEntityModel,
} from './kinds/AiResourceEntityV1alpha1';
export type {
  ApiEntityV1alpha1 as ApiEntity,
  ApiEntityV1alpha1,
} from './kinds/ApiEntityV1alpha1';
export type {
  McpServerApiEntity,
  McpServerRemote,
} from './kinds/McpServerApiEntity';
export {
  mcpServerApiEntityValidator,
  isMcpServerApiEntity,
  mcpServerApiEntityModel,
} from './kinds/McpServerApiEntity';
export * from './model';
export { defaultCatalogEntityModel } from './model/defaultCatalogEntityModel';

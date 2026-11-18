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

/** @packageDocumentation @alpha */

export { aiModulesExtensionPoint } from './extensions';
export type { AiModulesExtensionPoint } from './extensions';
/**
 * Re-exported for policy authors who already depend on this plugin.
 *
 * @remarks
 * The rules, their conditions and the conditional decision helpers are defined
 * by `@backstage/ai-node/alpha`, which also evaluates them; this plugin owns no
 * rules of its own.
 */
export {
  aiModelConditions,
  aiModelPermissionRules,
  aiModelResourceRef,
  aiToolConditions,
  aiToolPermissionRules,
  aiToolResourceRef,
  createAiModelConditionalDecision,
  createAiToolConditionalDecision,
  isModel,
  isModelType,
  isProvider,
  isServer,
  isTool,
} from '@backstage/ai-node/alpha';

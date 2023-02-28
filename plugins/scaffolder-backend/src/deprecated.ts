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

import {
  ActionContext as ActionContextNode,
  createTemplateAction as createTemplateActionNode,
  TaskSecrets as TaskSecretsNode,
  TemplateAction as TemplateActionNode,
} from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';

/**
 * @public
 * @deprecated Import from {@link @backstage/plugin-scaffolder-node#ActionContext} instead
 */
export type ActionContext<TInput extends JsonObject> =
  ActionContextNode<TInput>;

/**
 * @public
 * @deprecated Use `createTemplateAction` from `@backstage/plugin-scaffolder-node` instead
 */
export const createTemplateAction = createTemplateActionNode;

/**
 * @public
 * @deprecated Use `TaskSecrets` from `@backstage/plugin-scaffolder-node` instead
 */
export type TaskSecrets = TaskSecretsNode;

/**
 * @public
 * @deprecated Use `TemplateAction` from `@backstage/plugin-scaffolder-node` instead
 */
export type TemplateAction<TInput extends JsonObject> =
  TemplateActionNode<TInput>;

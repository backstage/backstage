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
  executeShellCommand as executeShellCommandNode,
  ExecuteShellCommandOptions as ExecuteShellCommandOptionsNode,
  fetchContents as fetchContentsNode,
  TaskSecrets as TaskSecretsNode,
  TemplateAction as TemplateActionNode,
} from '@backstage/plugin-scaffolder-node';
import {
  ActionPermissionRuleInput as ActionPermissionRuleInputNode,
  TemplatePermissionRuleInput as TemplatePermissionRuleInputNode,
} from '@backstage/plugin-scaffolder-node/alpha';
import { JsonObject } from '@backstage/types';
import { ScaffolderEntitiesProcessor as ScaffolderEntitiesProcessorModule } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import { PermissionRuleParams } from '@backstage/plugin-permission-common';

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

/**
 * Options for {@link executeShellCommand}.
 *
 * @public
 * @deprecated Use `ExecuteShellCommandOptions` from `@backstage/plugin-scaffolder-node` instead
 */
export type RunCommandOptions = ExecuteShellCommandOptionsNode;

/**
 * Run a command in a sub-process, normally a shell command.
 *
 * @public
 * @deprecated Use `executeShellCommand` from `@backstage/plugin-scaffolder-node` instead
 */
export const executeShellCommand = executeShellCommandNode;

/**
 * A helper function that reads the contents of a directory from the given URL.
 * Can be used in your own actions, and also used behind fetch:template and fetch:plain
 *
 * @public
 * @deprecated Use `fetchContents` from `@backstage/plugin-scaffolder-node` instead
 */
export const fetchContents = fetchContentsNode;

/**
 * Adds support for scaffolder specific entity kinds to the catalog.
 *
 * @public
 * @deprecated Import from `@backstage/plugin-catalog-backend-module-scaffolder-entity-model` instead
 */
export const ScaffolderEntitiesProcessor = ScaffolderEntitiesProcessorModule;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-scaffolder-node/alpha` instead
 */
export type TemplatePermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = TemplatePermissionRuleInputNode<TParams>;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-scaffolder-node/alpha` instead
 */
export type ActionPermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = ActionPermissionRuleInputNode<TParams>;

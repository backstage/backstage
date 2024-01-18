/*
 * Copyright 2022 The Backstage Authors
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

import { createExtensionPoint } from '@backstage/backend-plugin-api';
import {
  TemplateAction,
  TemplateFilter,
  TemplateGlobal,
  TaskBroker,
} from '@backstage/plugin-scaffolder-node';

/**
 * Extension point for managing scaffolder actions.
 *
 * @alpha
 */
export interface ScaffolderActionsExtensionPoint {
  addActions(...actions: TemplateAction<any, any>[]): void;
}

/**
 * Extension point for managing scaffolder actions.
 *
 * @alpha
 */
export const scaffolderActionsExtensionPoint =
  createExtensionPoint<ScaffolderActionsExtensionPoint>({
    id: 'scaffolder.actions',
  });

/**
 * Extension point for replacing the scaffolder task broker.
 *
 * @alpha
 */
export interface ScaffolderTaskBrokerExtensionPoint {
  setTaskBroker(taskBroker: TaskBroker): void;
}

/**
 * Extension point for replacing the scaffolder task broker.
 *
 * @alpha
 */
export const scaffolderTaskBrokerExtensionPoint =
  createExtensionPoint<ScaffolderTaskBrokerExtensionPoint>({
    id: 'scaffolder.taskBroker',
  });

/**
 * Extension point for adding template filters and globals.
 *
 * @alpha
 */
export interface ScaffolderTemplatingExtensionPoint {
  addTemplateFilters(filters: Record<string, TemplateFilter>): void;
  addTemplateGlobals(filters: Record<string, TemplateGlobal>): void;
}

/**
 * Extension point for adding template filters and globals.
 *
 * @alpha
 */
export const scaffolderTemplatingExtensionPoint =
  createExtensionPoint<ScaffolderTemplatingExtensionPoint>({
    id: 'scaffolder.templating',
  });

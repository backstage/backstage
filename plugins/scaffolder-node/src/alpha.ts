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
  TaskBroker,
  TemplateAction,
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import { ScaffolderPermissionRule } from './permissions/alpha';

export * from './tasks/alpha';
export * from './permissions/alpha';

/**
 * Extension point for managing scaffolder actions.
 *
 * @alpha
 */
export interface ScaffolderPermissionsExtensionPoint {
  addRule(...rules: ScaffolderPermissionRule[]): void;
}

/**
 * Extension point for adding custom scaffolder permission rules.
 *
 * @alpha
 */
export const scaffolderPermissionsExtensionPoint =
  createExtensionPoint<ScaffolderPermissionsExtensionPoint>({
    id: 'scaffolder.permissions',
  });

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

/**
 * Autocomplete handler for the scaffolder.
 * @alpha
 */
export type AutocompleteHandler = ({
  resource,
  token,
  context,
}: {
  resource: string;
  token: string;
  context: Record<string, string>;
}) => Promise<{ results: { title: string }[] }>;

/**
 * Extension point for adding autocomplete handler providers
 * @alpha
 */
export interface ScaffolderAutocompleteExtensionPoint {
  addAutocompleteProvider({
    id,
    handler,
  }: {
    id: string;
    handler: AutocompleteHandler;
  }): void;
}

/**
 * Extension point for adding autocomplete handlers.
 *
 * @alpha
 */
export const scaffolderAutocompleteExtensionPoint =
  createExtensionPoint<ScaffolderAutocompleteExtensionPoint>({
    id: 'scaffolder.autocomplete',
  });

/**
 * This provider has to be implemented to make it possible to serialize/deserialize scaffolder workspace.
 *
 * @alpha
 */
export interface WorkspaceProvider {
  serializeWorkspace({
    path,
    taskId,
  }: {
    path: string;
    taskId: string;
  }): Promise<void>;

  cleanWorkspace(options: { taskId: string }): Promise<void>;

  rehydrateWorkspace(options: {
    taskId: string;
    targetPath: string;
  }): Promise<void>;
}

/**
 * Extension point for adding workspace providers.
 *
 * @alpha
 */
export interface ScaffolderWorkspaceProviderExtensionPoint {
  addProviders(providers: Record<string, WorkspaceProvider>): void;
}

/**
 * Extension point for adding workspace providers.
 *
 * @alpha
 */
export const scaffolderWorkspaceProviderExtensionPoint =
  createExtensionPoint<ScaffolderWorkspaceProviderExtensionPoint>({
    id: 'scaffolder.workspace.provider',
  });

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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import {
  TaskBroker,
  TemplateAction,
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import {
  AutocompleteHandler,
  scaffolderActionsExtensionPoint,
  scaffolderAutocompleteExtensionPoint,
  scaffolderTaskBrokerExtensionPoint,
  scaffolderTemplatingExtensionPoint,
  scaffolderWorkspaceProviderExtensionPoint,
  WorkspaceProvider,
} from '@backstage/plugin-scaffolder-node/alpha';
import {
  createCatalogRegisterAction,
  createCatalogWriteAction,
  createDebugLogAction,
  createFetchCatalogEntityAction,
  createFetchPlainAction,
  createFetchPlainFileAction,
  createFetchTemplateAction,
  createFetchTemplateFileAction,
  createFilesystemDeleteAction,
  createFilesystemReadDirAction,
  createFilesystemRenameAction,
  createWaitAction,
} from './scaffolder';
import { createRouter } from './service/router';

/**
 * Scaffolder plugin
 *
 * @public
 */
export const scaffolderPlugin = createBackendPlugin({
  pluginId: 'scaffolder',
  register(env) {
    const addedActions = new Array<TemplateAction<any, any>>();
    env.registerExtensionPoint(scaffolderActionsExtensionPoint, {
      addActions(...newActions: TemplateAction<any>[]) {
        addedActions.push(...newActions);
      },
    });

    let taskBroker: TaskBroker | undefined;
    env.registerExtensionPoint(scaffolderTaskBrokerExtensionPoint, {
      setTaskBroker(newTaskBroker) {
        if (taskBroker) {
          throw new Error('Task broker may only be set once');
        }
        taskBroker = newTaskBroker;
      },
    });

    const additionalTemplateFilters: Record<string, TemplateFilter> = {};
    const additionalTemplateGlobals: Record<string, TemplateGlobal> = {};
    env.registerExtensionPoint(scaffolderTemplatingExtensionPoint, {
      addTemplateFilters(newFilters) {
        Object.assign(additionalTemplateFilters, newFilters);
      },
      addTemplateGlobals(newGlobals) {
        Object.assign(additionalTemplateGlobals, newGlobals);
      },
    });

    const autocompleteHandlers: Record<string, AutocompleteHandler> = {};
    env.registerExtensionPoint(scaffolderAutocompleteExtensionPoint, {
      addAutocompleteProvider(provider) {
        autocompleteHandlers[provider.id] = provider.handler;
      },
    });

    const additionalWorkspaceProviders: Record<string, WorkspaceProvider> = {};
    env.registerExtensionPoint(scaffolderWorkspaceProviderExtensionPoint, {
      addProviders(provider) {
        Object.assign(additionalWorkspaceProviders, provider);
      },
    });

    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        lifecycle: coreServices.rootLifecycle,
        reader: coreServices.urlReader,
        permissions: coreServices.permissions,
        database: coreServices.database,
        auth: coreServices.auth,
        discovery: coreServices.discovery,
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
        auditor: coreServices.auditor,
        catalogClient: catalogServiceRef,
        events: eventsServiceRef,
      },
      async init({
        logger,
        config,
        lifecycle,
        reader,
        database,
        auth,
        discovery,
        httpRouter,
        httpAuth,
        catalogClient,
        permissions,
        events,
        auditor,
      }) {
        const log = loggerToWinstonLogger(logger);
        const integrations = ScmIntegrations.fromConfig(config);

        const actions = [
          // actions provided from other modules
          ...addedActions,

          // built-in actions for the scaffolder
          createFetchPlainAction({
            reader,
            integrations,
          }),
          createFetchPlainFileAction({
            reader,
            integrations,
          }),
          createFetchTemplateAction({
            integrations,
            reader,
            additionalTemplateFilters,
            additionalTemplateGlobals,
          }),
          createFetchTemplateFileAction({
            integrations,
            reader,
            additionalTemplateFilters,
            additionalTemplateGlobals,
          }),
          createDebugLogAction(),
          createWaitAction(),
          // todo(blam): maybe these should be a -catalog module?
          createCatalogRegisterAction({ catalogClient, integrations, auth }),
          createFetchCatalogEntityAction({ catalogClient, auth }),
          createCatalogWriteAction(),
          createFilesystemDeleteAction(),
          createFilesystemRenameAction(),
          createFilesystemReadDirAction(),
        ];

        const actionIds = actions.map(action => action.id).join(', ');

        log.info(
          `Starting scaffolder with the following actions enabled ${actionIds}`,
        );

        const router = await createRouter({
          logger: log,
          config,
          database,
          catalogClient,
          reader,
          lifecycle,
          actions,
          taskBroker,
          additionalTemplateFilters,
          additionalTemplateGlobals,
          auth,
          httpAuth,
          discovery,
          permissions,
          autocompleteHandlers,
          additionalWorkspaceProviders,
          events,
          auditor,
        });
        httpRouter.use(router);
      },
    });
  },
});

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
import {
  createBackendPlugin,
  coreServices,
  createExtensionPoint,
} from '@backstage/backend-plugin-api';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { TemplateFilter, TemplateGlobal } from './lib';
import { createBuiltinActions, TaskBroker, TemplateAction } from './scaffolder';
import { createRouter } from './service/router';

/**
 * Catalog plugin options
 * @alpha
 */
export type ScaffolderPluginOptions = {
  actions?: TemplateAction<any>[];
  taskWorkers?: number;
  taskBroker?: TaskBroker;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
};

/**
 * @alpha
 * TODO: MOVE to scaffolder-node.
 */
interface ScaffolderActionsExtensionPoint {
  addActions(...actions: TemplateAction<any>[]): void;
}

class ScaffolderActionsExtensionPointImpl
  implements ScaffolderActionsExtensionPoint
{
  #actions = new Array<TemplateAction<any>>();
  addActions(...actions: TemplateAction<any>[]): void {
    this.#actions.push(...actions);
  }
  get actions() {
    return this.#actions;
  }
}

/**
 * @alpha
 * TODO: MOVE to scaffolder-node.
 */
export const scaffolderActionsExtensionPoint =
  createExtensionPoint<ScaffolderActionsExtensionPoint>({
    id: 'scaffolder.actions',
  });

/**
 * Catalog plugin
 * @alpha
 */
export const scaffolderPlugin = createBackendPlugin(
  (options: ScaffolderPluginOptions) => ({
    id: 'scaffolder',
    register(env) {
      const actionsExtensions = new ScaffolderActionsExtensionPointImpl();
      env.registerExtensionPoint(
        scaffolderActionsExtensionPoint,
        actionsExtensions,
      );

      env.registerInit({
        deps: {
          logger: coreServices.logger,
          config: coreServices.config,
          reader: coreServices.urlReader,
          permissions: coreServices.permissions,
          database: coreServices.database,
          httpRouter: coreServices.httpRouter,
          catalogClient: catalogServiceRef,
        },
        async init({
          logger,
          config,
          reader,
          database,
          httpRouter,
          catalogClient,
        }) {
          const {
            additionalTemplateFilters,
            taskBroker,
            taskWorkers,
            additionalTemplateGlobals,
          } = options;
          const log = loggerToWinstonLogger(logger);

          const actions = options.actions || [
            ...actionsExtensions.actions,
            ...createBuiltinActions({
              integrations: ScmIntegrations.fromConfig(config),
              catalogClient,
              reader,
              config,
              additionalTemplateFilters,
              additionalTemplateGlobals,
            }),
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
            actions,
            taskBroker,
            taskWorkers,
            additionalTemplateFilters,
            additionalTemplateGlobals,
          });
          httpRouter.use(router);
        },
      });
    },
  }),
);

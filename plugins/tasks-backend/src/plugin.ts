/*
 * Copyright 2025 The Backstage Authors
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
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { createTaskService } from './service/TaskService';
import { tasksPermissions } from '@backstage/plugin-tasks-common';
import { taskPermissionResourceRef, taskPermissionRules } from './permission';

/**
 * tasksPlugin backend plugin
 *
 * @public
 */
export const tasksPlugin = createBackendPlugin({
  pluginId: 'tasks',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        httpRouter: coreServices.httpRouter,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        permissionsRegistry: coreServices.permissionsRegistry,
        permissions: coreServices.permissions,
        auditor: coreServices.auditor,
      },
      async init({
        logger,
        config,
        discovery,
        httpRouter,
        auth,
        httpAuth,
        permissionsRegistry,
        permissions,
        auditor,
      }) {
        // Register permissions
        permissionsRegistry.addPermissions(tasksPermissions);

        // Store subscription reference for cleanup
        let configSubscription:
          | { unsubscribe: () => void }
          | (() => void)
          | undefined;

        // Create initial task service
        let taskService = await createTaskService({
          logger,
          config,
          discovery,
          httpRouter,
          auth,
          httpAuth,
        });

        // Handle config changes if subscription is supported
        if (config && typeof config.subscribe === 'function') {
          logger.info('Setting up config subscription for tasks plugin');

          try {
            configSubscription = config.subscribe(async () => {
              logger.info('Configuration changed, recreating task service');

              try {
                // Recreate task service with new config
                const newTaskService = await createTaskService({
                  logger,
                  config,
                  discovery,
                  httpRouter,
                  auth,
                  httpAuth,
                });

                // Update reference to new service
                taskService = newTaskService;

                logger.info(
                  'Task service successfully recreated with new configuration',
                );
              } catch (error) {
                logger.error(
                  'Failed to recreate task service on config change',
                  error instanceof Error ? error : new Error(String(error)),
                );
              }
            });
          } catch (error) {
            logger.warn(
              'Failed to set up config subscription, continuing without hot reload',
              error instanceof Error ? error : new Error(String(error)),
            );
          }
        } else {
          logger.info(
            'Config subscription not available, changes will require restart',
          );
        }

        // Register resource type with permission rules
        permissionsRegistry.addResourceType({
          resourceRef: taskPermissionResourceRef,
          permissions: tasksPermissions,
          rules: taskPermissionRules,
          getResources: async resourceRefs => {
            // Get task resources for permission evaluation
            // Always use the current task service instance
            return Promise.all(
              resourceRefs.map(async ref => {
                const task = await taskService.getTask(ref);
                return task;
              }),
            );
          },
        });

        const router = await createRouter({
          taskService,
          logger,
          httpAuth,
          permissions, // Use the injected permissions service
          permissionsRegistry,
          auditor,
        });

        httpRouter.use(router);

        // Register cleanup for config subscription
        if (configSubscription) {
          // In Backstage, plugins typically don't have explicit shutdown hooks,
          // but we can handle cleanup if the framework supports it
          const cleanup = () => {
            if (configSubscription) {
              logger.info('Cleaning up tasks plugin config subscription');
              if (typeof configSubscription === 'function') {
                configSubscription();
              } else if (configSubscription.unsubscribe) {
                configSubscription.unsubscribe();
              }
              configSubscription = undefined;
            }
          };

          // Store cleanup function for potential use by framework
          (taskService as any).__cleanup = cleanup;
        }
      },
    });
  },
});

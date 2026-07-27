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
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { usageAnalyticsPermissions } from '@backstage/plugin-usage-analytics-common';
import { AnalyticsService } from './AnalyticsService';
import { DatabaseAnalyticsStore } from './DatabaseAnalyticsStore';
import { createRouter } from './router';

/**
 * Usage analytics backend plugin.
 *
 * @public
 */
export const usageAnalyticsPlugin = createBackendPlugin({
  pluginId: 'usage-analytics',
  register(env) {
    env.registerInit({
      deps: {
        auditor: coreServices.auditor,
        config: coreServices.rootConfig,
        database: coreServices.database,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        permissions: coreServices.permissions,
        permissionsRegistry: coreServices.permissionsRegistry,
        scheduler: coreServices.scheduler,
      },
      async init({
        auditor,
        config,
        database,
        httpAuth,
        httpRouter,
        logger,
        permissions,
        permissionsRegistry,
        scheduler,
      }) {
        permissionsRegistry.addPermissions(usageAnalyticsPermissions);
        let store: DatabaseAnalyticsStore;
        try {
          store = await DatabaseAnalyticsStore.create({ database });
        } catch (error) {
          logger.error('Usage analytics disabled: database unavailable', error);
          return;
        }
        const service = new AnalyticsService({ store, config });
        httpRouter.use(
          createRouter({
            auditor,
            httpAuth,
            logger,
            permissions,
            service,
            store,
          }),
        );

        const taskRunner = scheduler.createScheduledTaskRunner({
          frequency: { cron: '0 0 * * *' },
          timeout: { minutes: 30 },
          initialDelay: { hours: 1 },
          scope: 'global',
        });
        await taskRunner.run({
          id: 'usage-analytics-retention',
          fn: async () => {
            const deleted = await store.deleteExpiredData(
              service.retentionCutoffs(),
            );
            logger.info('Usage analytics retention completed', deleted);
          },
        });
      },
    });
  },
});

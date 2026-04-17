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
  createBackendModule,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { Knex } from 'knex';
import { metricsServiceRef } from '@backstage/backend-plugin-api/alpha';
import { notificationsProcessingExtensionPoint } from '@backstage/plugin-notifications-node';
import { SlackNotificationProcessor } from './lib/SlackNotificationProcessor';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import {
  notificationsSlackBlockKitExtensionPoint,
  SlackBlockKitRenderer,
} from './extensions';

const MIGRATIONS_DIR = resolvePackagePath(
  '@backstage/plugin-notifications-backend-module-slack',
  'migrations',
);

const DB_MIGRATIONS_TABLE = 'notifications_module_slack__knex_migrations';
const CLEANUP_RETENTION_SECONDS = 24 * 60 * 60; // 24 hours

function nowMinus(knex: Knex, seconds: number): Knex.Raw {
  if (knex.client.config.client.includes('sqlite3')) {
    return knex.raw(`datetime('now', ?)`, [`-${seconds} seconds`]);
  } else if (knex.client.config.client.includes('mysql')) {
    return knex.raw(`now() - interval ${seconds} second`);
  }
  return knex.raw(`now() - interval '${seconds} seconds'`);
}

/**
 * The Slack notification processor for use with the notifications plugin.
 * This allows sending of notifications via Slack DMs or to channels.
 *
 * @public
 */
export const notificationsModuleSlack = createBackendModule({
  pluginId: 'notifications',
  moduleId: 'slack',
  register(reg) {
    let blockKitRenderer: SlackBlockKitRenderer | undefined;
    reg.registerExtensionPoint(notificationsSlackBlockKitExtensionPoint, {
      setBlockKitRenderer(renderer) {
        if (blockKitRenderer) {
          throw new Error(`Slack block kit renderer was already registered`);
        }
        blockKitRenderer = renderer;
      },
    });

    reg.registerInit({
      deps: {
        auth: coreServices.auth,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        catalog: catalogServiceRef,
        notifications: notificationsProcessingExtensionPoint,
        metrics: metricsServiceRef,
        database: coreServices.database,
        scheduler: coreServices.scheduler,
      },
      async init({
        auth,
        config,
        logger,
        catalog,
        notifications,
        metrics,
        database,
        scheduler,
      }) {
        const processors = SlackNotificationProcessor.fromConfig(config, {
          auth,
          logger,
          catalog,
          metrics,
          blockKitRenderer,
        });

        if (processors.length === 0) {
          return;
        }

        const db = await database.getClient();

        if (!database.migrations?.skip) {
          await db.migrate.latest({
            directory: MIGRATIONS_DIR,
            tableName: DB_MIGRATIONS_TABLE,
          });
        }

        // Attach the DB to each processor now that migrations have run.
        for (const processor of processors) {
          processor.setDatabase(db);
        }

        notifications.addProcessor(processors);

        // Clean up old message timestamp records daily. These records are only
        // needed for the short window between initial send and scope-based
        // update (typically minutes), so a 24-hour retention is sufficient.
        await scheduler.scheduleTask({
          id: 'slack-message-timestamps-cleanup',
          frequency: { hours: 24 },
          timeout: { minutes: 5 },
          initialDelay: { hours: 2 },
          scope: 'global',
          fn: async () => {
            const deleted = await db('slack_message_timestamps')
              .where(
                'created_at',
                '<=',
                nowMinus(db, CLEANUP_RETENTION_SECONDS),
              )
              .delete();
            logger.info('Cleaned up old Slack message timestamps', {
              deleted,
            });
          },
        });
      },
    });
  },
});

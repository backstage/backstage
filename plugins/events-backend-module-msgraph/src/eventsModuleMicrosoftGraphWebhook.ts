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
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import { MicrosoftGraphSubscriptionsDatabaseClient } from './database/databaseClient';
import { applyDatabaseMigrations } from './database/migrations';
import { MicrosoftGraphClient } from './service/MicrosoftGraphClient';
import { MicrosoftGraphSubscriptionManager } from './service/MicrosoftGraphSubscriptionManager';
import { createWebhookRequestValidator } from './service/createWebhookRequestValidator';
import { MICROSOFT_GRAPH_TOPIC } from './topics';
import { HttpTextPlainBodyParser } from './HttpTextPlainBodyParser';

export default createBackendModule({
  pluginId: 'events',
  moduleId: 'msgraph-webhook',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        events: eventsExtensionPoint,
        logger: coreServices.logger,
        lifecycle: coreServices.rootLifecycle,
        database: coreServices.database,
        scheduler: coreServices.scheduler,
      },
      async init({ config, events, logger, lifecycle, database, scheduler }) {
        if (!database.migrations?.skip) {
          await applyDatabaseMigrations(await database.getClient());
        }

        if (!config.getOptionalConfig('events.modules.msgraph')) {
          logger.warn(
            'No configuration found for events.modules.msgraph, skipping Microsoft Graph events setup',
          );
          return;
        }

        const databaseClient = MicrosoftGraphSubscriptionsDatabaseClient.create(
          await database.getClient(),
        );

        const subscriptionManager =
          await MicrosoftGraphSubscriptionManager.fromConfig(config, {
            logger,
            databaseClient,
            msGraphClient: MicrosoftGraphClient.fromConfig(config),
          });

        events.addHttpPostBodyParser({
          contentType: 'text/plain',
          parser: HttpTextPlainBodyParser,
        });

        events.addHttpPostIngress({
          topic: MICROSOFT_GRAPH_TOPIC,
          validator: createWebhookRequestValidator(logger, databaseClient),
        });

        // endpoint listener should be up and running before subscribing, because
        // MS Graph will send a validation request as soon as we request to create a subscription
        lifecycle.addStartupHook(async () => {
          if (config.has('events.modules.msgraph.startupDelay')) {
            // start subscription manager after a delay if configured
            const delay = readDurationFromConfig(config, {
              key: 'events.modules.msgraph.startupDelay',
            });
            const timeoutMs = durationToMilliseconds(delay);
            await new Promise(resolve => {
              setTimeout(resolve, timeoutMs);
            });
          }

          await subscriptionManager.schedule({ scheduler });
        });
      },
    });
  },
});

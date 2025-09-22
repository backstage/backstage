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
} from '@backstage/backend-plugin-api';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { GooglePubSubConsumingEventPublisher } from './GooglePubSubConsumingEventPublisher';

/**
 * Reads messages off of Google Pub/Sub subscriptions and forwards them into the
 * Backstage events system.
 */
export const eventsModuleGooglePubsubConsumingEventPublisher =
  createBackendModule({
    pluginId: 'events',
    moduleId: 'google-pubsub-consuming-event-publisher',
    register(reg) {
      reg.registerInit({
        deps: {
          config: coreServices.rootConfig,
          logger: coreServices.logger,
          rootLifecycle: coreServices.rootLifecycle,
          events: eventsServiceRef,
        },
        async init({ config, logger, rootLifecycle, events }) {
          GooglePubSubConsumingEventPublisher.create({
            config,
            logger,
            rootLifecycle,
            events,
          });
        },
      });
    },
  });

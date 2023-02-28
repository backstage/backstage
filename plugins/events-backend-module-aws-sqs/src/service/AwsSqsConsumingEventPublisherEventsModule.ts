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
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import { AwsSqsConsumingEventPublisher } from '../publisher/AwsSqsConsumingEventPublisher';

/**
 * AWS SQS module for the Events plugin.
 *
 * @alpha
 */
export const awsSqsConsumingEventPublisherEventsModule = createBackendModule({
  pluginId: 'events',
  moduleId: 'awsSqsConsumingEventPublisherEventsModule',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.config,
        events: eventsExtensionPoint,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({ config, events, logger, scheduler }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        const sqs = AwsSqsConsumingEventPublisher.fromConfig({
          config: config,
          logger: winstonLogger,
          scheduler: scheduler,
        });

        events.addPublishers(sqs);
      },
    });
  },
});

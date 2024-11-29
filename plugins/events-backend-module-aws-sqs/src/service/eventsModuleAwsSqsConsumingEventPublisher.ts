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
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { AwsSqsConsumingEventPublisher } from '../publisher/AwsSqsConsumingEventPublisher';

/**
 * AWS SQS module for the Events plugin.
 *
 * @public
 */
export const eventsModuleAwsSqsConsumingEventPublisher = createBackendModule({
  pluginId: 'events',
  moduleId: 'aws-sqs-consuming-event-publisher',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        events: eventsServiceRef,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({ config, events, logger, scheduler }) {
        const sqs = AwsSqsConsumingEventPublisher.fromConfig({
          config,
          events,
          logger,
          scheduler,
        });

        await Promise.all(sqs.map(publisher => publisher.start()));
      },
    });
  },
});

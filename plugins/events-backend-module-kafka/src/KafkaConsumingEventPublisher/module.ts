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
import { KafkaConsumingEventPublisher } from './KafkaConsumingEventPublisher';

/**
 * Reads messages off of Kafka topics and forwards them into the Backstage events system.
 *
 * @public
 */
export const eventsModuleKafkaConsumingEventPublisher = createBackendModule({
  pluginId: 'events',
  moduleId: 'kafka-consuming-event-publisher',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        events: eventsServiceRef,
        logger: coreServices.logger,
        lifecycle: coreServices.rootLifecycle,
      },
      async init({ config, logger, events, lifecycle }) {
        const consumers = KafkaConsumingEventPublisher.fromConfig({
          config,
          events,
          logger,
        });

        lifecycle.addStartupHook(async () => {
          await Promise.all(consumers.map(consumer => consumer.start()));
        });

        lifecycle.addShutdownHook(async () => {
          await Promise.all(consumers.map(consumer => consumer.shutdown()));
        });
      },
    });
  },
});

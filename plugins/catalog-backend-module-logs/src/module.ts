/*
 * Copyright 2024 The Backstage Authors
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
import { CATALOG_ERRORS_TOPIC } from '@backstage/plugin-catalog-backend';
import { eventsServiceRef, EventParams } from '@backstage/plugin-events-node';

interface EventsPayload {
  entity: string;
  location?: string;
  errors: Error[];
}

interface EventsParamsWithPayload extends EventParams {
  eventPayload: EventsPayload;
}

/**
 * A catalog module that logs catalog errors using the logger service.
 *
 * @public
 */
export const catalogModuleLogs = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'logs',
  register(env) {
    env.registerInit({
      deps: {
        events: eventsServiceRef,
        logger: coreServices.logger,
      },
      async init({ events, logger }) {
        events.subscribe({
          id: 'catalog',
          topics: [CATALOG_ERRORS_TOPIC],
          async onEvent(params: EventParams): Promise<void> {
            const event = params as EventsParamsWithPayload;
            const { entity, location, errors } = event.eventPayload;
            for (const error of errors) {
              logger.warn(error.message, {
                entity,
                location,
              });
            }
          },
        });
      },
    });
  },
});

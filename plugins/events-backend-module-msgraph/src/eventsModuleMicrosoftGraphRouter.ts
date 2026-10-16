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
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { MicrosoftGraphEventRouter } from './router/MicrosoftGraphEventRouter';

export default createBackendModule({
  pluginId: 'events',
  moduleId: 'msgraph-event-router',
  register(reg) {
    reg.registerInit({
      deps: {
        events: eventsServiceRef,
        logger: coreServices.logger,
        auth: coreServices.auth,
        catalog: catalogServiceRef,
      },
      async init({ events, logger, auth, catalog }) {
        const eventRouter = new MicrosoftGraphEventRouter({
          events,
          logger,
          auth,
          catalog,
        });

        await eventRouter.subscribe();
      },
    });
  },
});

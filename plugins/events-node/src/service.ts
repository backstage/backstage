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
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { EventsService, DefaultEventsService } from './api';

/**
 * The {@link EventsService} that allows to publish events, and subscribe to topics.
 * Uses the `root` scope so that events can be shared across all plugins, modules, and more.
 *
 * @public
 */
export const eventsServiceRef = createServiceRef<EventsService>({
  id: 'events.service',
  scope: 'plugin',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        pluginMetadata: coreServices.pluginMetadata,
        rootLogger: coreServices.rootLogger,
      },
      async createRootContext({ rootLogger }) {
        return DefaultEventsService.create({ logger: rootLogger });
      },
      async factory({ pluginMetadata }, eventsService) {
        return eventsService.forPlugin(pluginMetadata.getId());
      },
    }),
});

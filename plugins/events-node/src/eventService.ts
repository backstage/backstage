/*
 * Copyright 2023 The Backstage Authors
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
  createServiceFactory,
  createServiceRef,
  coreServices,
} from '@backstage/backend-plugin-api';
import { EventBroker } from './api/EventBroker';
import { InMemoryEventBroker } from './api/InMemoryEventBroker';

/**
 * A service to publish and subscribe to events.
 * @alpha
 */
export const eventServiceRef = createServiceRef<EventBroker>({
  id: 'events',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        logger: coreServices.logger,
      },
      async factory({ logger }) {
        return new InMemoryEventBroker(logger);
      },
    }),
});

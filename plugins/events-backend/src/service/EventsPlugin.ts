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
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import {
  eventsExtensionPoint,
  EventsExtensionPoint,
} from '@backstage/plugin-events-node/alpha';
import {
  eventsServiceRef,
  HttpPostIngressOptions,
} from '@backstage/plugin-events-node';
import Router from 'express-promise-router';
import { HttpPostIngressEventPublisher } from './http';
import { createEventBusRouter } from './hub';

class EventsExtensionPointImpl implements EventsExtensionPoint {
  #httpPostIngresses: HttpPostIngressOptions[] = [];

  setEventBroker(_: any): void {
    throw new Error(
      'setEventBroker is not supported anymore; use eventsServiceRef instead',
    );
  }

  addPublishers(_: any): void {
    throw new Error(
      'addPublishers is not supported anymore; use EventsService instead',
    );
  }

  addSubscribers(_: any): void {
    throw new Error(
      'addSubscribers is not supported anymore; use EventsService instead',
    );
  }

  addHttpPostIngress(options: HttpPostIngressOptions) {
    this.#httpPostIngresses.push(options);
  }

  get httpPostIngresses() {
    return this.#httpPostIngresses;
  }
}

/**
 * Events plugin
 *
 * @public
 */
export const eventsPlugin = createBackendPlugin({
  pluginId: 'events',
  register(env) {
    const extensionPoint = new EventsExtensionPointImpl();
    env.registerExtensionPoint(eventsExtensionPoint, extensionPoint);

    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        events: eventsServiceRef,
        database: coreServices.database,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        lifecycle: coreServices.lifecycle,
        httpAuth: coreServices.httpAuth,
        router: coreServices.httpRouter,
      },
      async init({
        config,
        events,
        database,
        logger,
        scheduler,
        lifecycle,
        httpAuth,
        router,
      }) {
        const ingresses = Object.fromEntries(
          extensionPoint.httpPostIngresses.map(ingress => [
            ingress.topic,
            ingress as Omit<HttpPostIngressOptions, 'topic'>,
          ]),
        );

        const http = HttpPostIngressEventPublisher.fromConfig({
          config,
          events,
          ingresses,
          logger,
        });
        const eventsRouter = Router();
        http.bind(eventsRouter);

        router.use(
          await createEventBusRouter({
            database,
            logger,
            httpAuth,
            scheduler,
            lifecycle,
          }),
        );

        router.use(eventsRouter);
        router.addAuthPolicy({
          allow: 'unauthenticated',
          path: '/http',
        });
      },
    });
  },
});

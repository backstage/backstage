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
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import {
  eventsExtensionPoint,
  EventsExtensionPoint,
  eventsService,
} from '@backstage/plugin-events-node/alpha';
import {
  EventPublisher,
  EventSubscriber,
  HttpPostIngressOptions,
} from '@backstage/plugin-events-node';
import Router from 'express-promise-router';
import { HttpPostIngressEventPublisher } from './http';

class EventsExtensionPointImpl implements EventsExtensionPoint {
  #httpPostIngresses: HttpPostIngressOptions[] = [];
  #publishers: EventPublisher[] = [];
  #subscribers: EventSubscriber[] = [];

  addPublishers(
    ...publishers: Array<EventPublisher | Array<EventPublisher>>
  ): void {
    this.#publishers.push(...publishers.flat());
  }

  addSubscribers(
    ...subscribers: Array<EventSubscriber | Array<EventSubscriber>>
  ): void {
    this.#subscribers.push(...subscribers.flat());
  }

  addHttpPostIngress(options: HttpPostIngressOptions) {
    this.#httpPostIngresses.push(options);
  }

  get publishers() {
    return this.#publishers;
  }

  get subscribers() {
    return this.#subscribers;
  }

  get httpPostIngresses() {
    return this.#httpPostIngresses;
  }
}

/**
 * Events plugin
 *
 * @alpha
 */
export const eventsPlugin = createBackendPlugin({
  pluginId: 'events',
  register(env) {
    const extensionPoint = new EventsExtensionPointImpl();
    env.registerExtensionPoint(eventsExtensionPoint, extensionPoint);

    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        router: coreServices.httpRouter,
        events: eventsService,
      },
      async init({ config, logger, router, events }) {
        const ingresses = Object.fromEntries(
          extensionPoint.httpPostIngresses.map(ingress => [
            ingress.topic,
            ingress as Omit<HttpPostIngressOptions, 'topic'>,
          ]),
        );

        const http = HttpPostIngressEventPublisher.fromConfig({
          config,
          ingresses,
          logger,
        });
        const eventsRouter = Router();
        http.bind(eventsRouter);
        await http.setEventBroker(events);

        router.use(eventsRouter);
        events.subscribe(extensionPoint.subscribers);
        [extensionPoint.publishers, http]
          .flat()
          .forEach(publisher => publisher.setEventBroker(events));
      },
    });
  },
});

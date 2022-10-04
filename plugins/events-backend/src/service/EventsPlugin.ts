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
  configServiceRef,
  createBackendPlugin,
  httpRouterServiceRef,
  loggerServiceRef,
  loggerToWinstonLogger,
} from '@backstage/backend-plugin-api';
import {
  EventBroker,
  EventPublisher,
  EventSubscriber,
  eventsExtensionPoint,
  EventsExtensionPoint,
  HttpPostIngressOptions,
} from '@backstage/plugin-events-node';
import { InMemoryEventBroker } from './InMemoryEventBroker';
import Router from 'express-promise-router';
import { HttpPostIngressEventPublisher } from './http';

class EventsExtensionPointImpl implements EventsExtensionPoint {
  #eventBroker: EventBroker | undefined;
  #httpPostIngresses: HttpPostIngressOptions[] = [];
  #publishers: EventPublisher[] = [];
  #subscribers: EventSubscriber[] = [];

  setEventBroker(eventBroker: EventBroker): void {
    this.#eventBroker = eventBroker;
  }

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

  get eventBroker() {
    return this.#eventBroker;
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
  id: 'events',
  register(env) {
    const extensionPoint = new EventsExtensionPointImpl();
    env.registerExtensionPoint(eventsExtensionPoint, extensionPoint);

    env.registerInit({
      deps: {
        config: configServiceRef,
        httpRouter: httpRouterServiceRef,
        logger: loggerServiceRef,
      },
      async init({ config, httpRouter, logger }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        const eventsRouter = Router();
        const router = Router();
        eventsRouter.use('/http', router);

        const ingresses = Object.fromEntries(
          extensionPoint.httpPostIngresses.map(ingress => [
            ingress.topic,
            ingress as Omit<HttpPostIngressOptions, 'topic'>,
          ]),
        );

        const http = HttpPostIngressEventPublisher.fromConfig({
          config,
          logger: winstonLogger,
          router,
          ingresses,
        });

        if (!extensionPoint.eventBroker) {
          extensionPoint.setEventBroker(new InMemoryEventBroker(winstonLogger));
        }

        extensionPoint.eventBroker!.subscribe(extensionPoint.subscribers);
        [extensionPoint.publishers, http]
          .flat()
          .forEach(publisher =>
            publisher.setEventBroker(extensionPoint.eventBroker!),
          );

        httpRouter.use(eventsRouter);
      },
    });
  },
});

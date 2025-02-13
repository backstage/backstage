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
  HttpBodyParserOptions,
  HttpPostIngressOptions,
} from '@backstage/plugin-events-node';
import Router from 'express-promise-router';
import { HttpPostIngressEventPublisher } from './http';
import { createEventBusRouter } from './hub';

class EventsExtensionPointImpl implements EventsExtensionPoint {
  readonly #httpPostIngresses: HttpPostIngressOptions[] = [];
  readonly #httpBodyParsers: HttpBodyParserOptions[] = [];

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

  addHttpPostBodyParser(options: HttpBodyParserOptions): void {
    this.#httpBodyParsers.push(options);
  }

  get httpPostIngresses() {
    return this.#httpPostIngresses;
  }

  get httpBodyParsers() {
    return this.#httpBodyParsers;
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
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        lifecycle: coreServices.lifecycle,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({
        config,
        events,
        database,
        httpAuth,
        httpRouter,
        lifecycle,
        logger,
        scheduler,
      }) {
        const ingresses = Object.fromEntries(
          extensionPoint.httpPostIngresses.map(ingress => [
            ingress.topic,
            ingress as Omit<HttpPostIngressOptions, 'topic'>,
          ]),
        );

        const bodyParsers = Object.fromEntries(
          extensionPoint.httpBodyParsers.map(option => [
            option.contentType,
            option.parser,
          ]),
        );

        const http = HttpPostIngressEventPublisher.fromConfig({
          config,
          events,
          ingresses,
          bodyParsers,
          logger,
        });
        const eventsRouter = Router();
        http.bind(eventsRouter);

        // MUST be registered *before* the event bus router.
        // Otherwise, it would already make use of `express.json()`
        // that is used there as part of the middleware stack.
        httpRouter.use(eventsRouter);

        const notifyTimeoutMs = config.getOptionalNumber(
          'events.notifyTimeoutMs',
        );

        httpRouter.use(
          await createEventBusRouter({
            database,
            lifecycle,
            logger,
            httpAuth,
            scheduler,
            notifyTimeoutMs,
          }),
        );

        httpRouter.addAuthPolicy({
          allow: 'unauthenticated',
          path: '/http',
        });
      },
    });
  },
});

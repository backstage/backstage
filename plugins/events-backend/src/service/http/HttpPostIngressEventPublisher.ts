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

import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import {
  EventBroker,
  EventPublisher,
  HttpPostIngressOptions,
  RequestValidator,
} from '@backstage/plugin-events-node';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { RequestValidationContextImpl } from './validation';

/**
 * Publishes events received from their origin (e.g., webhook events from an SCM system)
 * via HTTP POST endpoint and passes the request body as event payload to the registered subscribers.
 *
 * @public
 */
// TODO(pjungermann): add prom metrics? (see plugins/catalog-backend/src/util/metrics.ts, etc.)
export class HttpPostIngressEventPublisher implements EventPublisher {
  private eventBroker?: EventBroker;

  static fromConfig(env: {
    config: Config;
    ingresses?: { [topic: string]: Omit<HttpPostIngressOptions, 'topic'> };
    logger: Logger;
  }): HttpPostIngressEventPublisher {
    const topics =
      env.config.getOptionalStringArray('events.http.topics') ?? [];

    const ingresses = env.ingresses ?? {};
    topics.forEach(topic => {
      // don't overwrite topic settings
      // (e.g., added at the config as well as argument)
      if (!ingresses[topic]) {
        ingresses[topic] = {};
      }
    });

    return new HttpPostIngressEventPublisher(env.logger, ingresses);
  }

  private constructor(
    private readonly logger: Logger,
    private readonly ingresses: {
      [topic: string]: Omit<HttpPostIngressOptions, 'topic'>;
    },
  ) {}

  bind(router: express.Router): void {
    router.use('/http', this.createRouter(this.ingresses));
  }

  async setEventBroker(eventBroker: EventBroker): Promise<void> {
    this.eventBroker = eventBroker;
  }

  private createRouter(ingresses: {
    [topic: string]: Omit<HttpPostIngressOptions, 'topic'>;
  }): express.Router {
    const router = Router();
    router.use(express.json());

    Object.keys(ingresses).forEach(topic =>
      this.addRouteForTopic(router, topic, ingresses[topic].validator),
    );

    router.use(errorHandler());
    return router;
  }

  private addRouteForTopic(
    router: express.Router,
    topic: string,
    validator?: RequestValidator,
  ): void {
    const path = `/${topic}`;

    router.post(path, async (request, response) => {
      const requestDetails = {
        body: request.body,
        headers: request.headers,
      };
      const context = new RequestValidationContextImpl();
      await validator?.(requestDetails, context);
      if (context.wasRejected()) {
        response
          .status(context.rejectionDetails!.status)
          .json(context.rejectionDetails!.payload);
        return;
      }

      const eventPayload = request.body;
      await this.eventBroker!.publish({
        topic,
        eventPayload,
        metadata: request.headers,
      });

      response.status(202).json({ status: 'accepted' });
    });

    // TODO(pjungermann): We don't really know the externally defined path prefix here,
    //  however it is more useful for users to have it. Is there a better way?
    this.logger.info(`Registered /api/events/http${path} to receive events`);
  }
}

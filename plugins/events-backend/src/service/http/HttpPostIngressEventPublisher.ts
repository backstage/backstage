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

import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import {
  EventsService,
  HttpBodyParser,
  HttpPostIngressOptions,
  RequestValidator,
} from '@backstage/plugin-events-node';
import contentType from 'content-type';
import express from 'express';
import Router from 'express-promise-router';
import { defaultHttpBodyParsers } from './body-parser';
import { RequestValidationContextImpl } from './validation';
import { UnsupportedMediaTypeError } from './errors';
/**
 * Publishes events received from their origin (e.g., webhook events from an SCM system)
 * via HTTP POST endpoint and passes the request body as event payload to the registered subscribers.
 *
 * @public
 */
// TODO(pjungermann): add prom metrics? (see plugins/catalog-backend/src/util/metrics.ts, etc.)
export class HttpPostIngressEventPublisher {
  static fromConfig(env: {
    config: Config;
    events: EventsService;
    ingresses?: { [topic: string]: Omit<HttpPostIngressOptions, 'topic'> };
    bodyParsers?: { [contentType: string]: HttpBodyParser };
    logger: LoggerService;
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

    const parsers = { ...defaultHttpBodyParsers, ...env.bodyParsers };

    return new HttpPostIngressEventPublisher(
      env.events,
      env.logger,
      ingresses,
      parsers,
    );
  }

  private constructor(
    private readonly events: EventsService,
    private readonly logger: LoggerService,
    private readonly ingresses: {
      [topic: string]: Omit<HttpPostIngressOptions, 'topic'>;
    },
    private readonly bodyParsers: {
      [contentType: string]: HttpBodyParser;
    },
  ) {}

  bind(router: express.Router): void {
    router.use('/http', this.createRouter(this.ingresses));
  }

  private createRouter(ingresses: {
    [topic: string]: Omit<HttpPostIngressOptions, 'topic'>;
  }): express.Router {
    const router = Router();
    router.use(express.raw({ type: '*/*', limit: '5mb' }));

    Object.keys(ingresses).forEach(topic =>
      this.addRouteForTopic(router, topic, ingresses[topic].validator),
    );

    return router;
  }

  private addRouteForTopic(
    router: express.Router,
    topic: string,
    validator?: RequestValidator,
  ): void {
    const path = `/${topic}`;
    const logger = this.logger;

    router.post(path, async (request, response) => {
      const requestContentType = contentType.parse(request);
      const bodyParser = this.bodyParsers[requestContentType.type ?? ''];

      if (!bodyParser) {
        throw new UnsupportedMediaTypeError(requestContentType.type);
      }

      const { bodyParsed, bodyBuffer, encoding } = await bodyParser(
        request,
        requestContentType,
        topic,
      );

      if (validator) {
        const requestDetails = {
          body: bodyParsed,
          headers: request.headers,
          raw: {
            body: bodyBuffer,
            encoding: encoding as BufferEncoding,
          },
        };

        const context = new RequestValidationContextImpl();
        await validator(requestDetails, context);

        if (context.wasRejected()) {
          response
            .status(context.rejectionDetails!.status)
            .json(context.rejectionDetails!.payload);
          return;
        }
      }

      await this.events.publish({
        topic,
        eventPayload: bodyParsed,
        metadata: request.headers,
      });

      response.status(202).json({ status: 'accepted' });
    });

    // TODO(pjungermann): We don't really know the externally defined path prefix here,
    //  however it is more useful for users to have it. Is there a better way?
    logger.info(`Registered /api/events/http${path} to receive events`);
  }
}

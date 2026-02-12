/*
 * Copyright 2025 The Backstage Authors
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
import { CatalogScmEventsService } from '@backstage/plugin-catalog-node/alpha';
import { EventParams, EventsService } from '@backstage/plugin-events-node';
import { analyzeGithubWebhookEvent } from './analyzeGithubWebhookEvent';
import { OctokitProviderService } from '../util/octokitProviderService';

/**
 * Takes GitHub webhook events, analyzes them, and publishes them as catalog SCM
 * events that entity providers and others can subscribe to.
 */
export class GithubScmEventsBridge {
  readonly #logger: LoggerService;
  readonly #events: EventsService;
  readonly #octokitProvider: OctokitProviderService;
  readonly #catalogScmEvents: CatalogScmEventsService;
  #shuttingDown: boolean;
  #pendingPublish: Promise<void> | undefined;

  constructor(options: {
    logger: LoggerService;
    events: EventsService;
    octokitProvider: OctokitProviderService;
    catalogScmEvents: CatalogScmEventsService;
  }) {
    this.#logger = options.logger;
    this.#events = options.events;
    this.#octokitProvider = options.octokitProvider;
    this.#catalogScmEvents = options.catalogScmEvents;
    this.#shuttingDown = false;
  }

  async start() {
    await this.#events.subscribe({
      id: 'catalog-github-scm-events-bridge',
      topics: ['github'],
      onEvent: this.#onEvent.bind(this),
    });
  }

  async stop() {
    this.#shuttingDown = true;
    await this.#pendingPublish;
  }

  async #onEvent(params: EventParams): Promise<void> {
    const eventType = params.metadata?.['x-github-event'] as string | undefined;
    const eventPayload = params.eventPayload;
    if (!eventType || !eventPayload) {
      return;
    }

    while (this.#pendingPublish) {
      await this.#pendingPublish;
    }

    if (this.#shuttingDown) {
      this.#logger.warn(
        `Skipping GitHub webhook event of type "${eventType}" on topic "${params.topic}" because the bridge is shutting down`,
      );
      return;
    }

    this.#pendingPublish = Promise.resolve().then(async () => {
      try {
        const output = await analyzeGithubWebhookEvent(
          eventType,
          eventPayload,
          {
            octokitProvider: this.#octokitProvider,
            logger: this.#logger,
            isRelevantPath: path =>
              path.endsWith('.yaml') || path.endsWith('.yml'),
          },
        );

        if (output.result === 'ok') {
          await this.#catalogScmEvents.publish(output.events);
        } else if (output.result === 'ignored') {
          this.#logger.debug(
            `Skipping GitHub webhook event of type "${eventType}" on topic "${params.topic}" because it is ignored: ${output.reason}`,
          );
        } else if (output.result === 'aborted') {
          this.#logger.warn(
            `Skipping GitHub webhook event of type "${eventType}" on topic "${params.topic}" because it is aborted: ${output.reason}`,
          );
        } else if (output.result === 'unsupported-event') {
          this.#logger.debug(
            `Skipping GitHub webhook event of type "${eventType}" on topic "${params.topic}" because it is unsupported: ${output.event}`,
          );
        }
      } catch (error) {
        this.#logger.warn(
          `Failed to handle GitHub webhook event of type "${eventType}"`,
          error,
        );
      } finally {
        this.#pendingPublish = undefined;
      }
    });

    await this.#pendingPublish;
  }
}

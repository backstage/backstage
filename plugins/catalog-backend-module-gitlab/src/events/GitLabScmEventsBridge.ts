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

import { LoggerService } from '@backstage/backend-plugin-api';
import { CatalogScmEventsService } from '@backstage/plugin-catalog-node/alpha';
import { EventParams, EventsService } from '@backstage/plugin-events-node';
import { analyzeGitLabWebhookEvent } from './analyzeGitLabWebhookEvent';

function determineEventType(params: EventParams): string | undefined {
  const payload = params.eventPayload;

  if (
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    typeof (payload as { object_kind?: unknown }).object_kind === 'string'
  ) {
    return (payload as { object_kind: string }).object_kind;
  }

  const eventName =
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    typeof (payload as { event_name?: unknown }).event_name === 'string'
      ? (payload as { event_name: string }).event_name
      : undefined;
  if (eventName) {
    return eventName;
  }

  const metadataType = params.metadata?.['x-gitlab-event'];
  if (typeof metadataType === 'string' && metadataType.trim()) {
    return metadataType
      .trim()
      .toLowerCase()
      .replace(/\s+hook$/, '')
      .replace(/\s+/g, '_');
  }

  if (params.topic.startsWith('gitlab.')) {
    return params.topic.slice('gitlab.'.length);
  }

  return undefined;
}

/**
 * Takes GitLab webhook events, analyzes them, and publishes them as catalog
 * SCM events that entity providers and others can subscribe to.
 */
export class GitLabScmEventsBridge {
  readonly #logger: LoggerService;
  readonly #events: EventsService;
  readonly #catalogScmEvents: CatalogScmEventsService;
  #shuttingDown: boolean;
  #pendingPublish: Promise<void> | undefined;

  constructor(options: {
    logger: LoggerService;
    events: EventsService;
    catalogScmEvents: CatalogScmEventsService;
  }) {
    this.#logger = options.logger;
    this.#events = options.events;
    this.#catalogScmEvents = options.catalogScmEvents;
    this.#shuttingDown = false;
  }

  async start() {
    await this.#events.subscribe({
      id: 'catalog-gitlab-scm-events-bridge',
      topics: ['gitlab'],
      onEvent: this.#onEvent.bind(this),
    });
  }

  async stop() {
    this.#shuttingDown = true;
    await this.#pendingPublish;
  }

  async #onEvent(params: EventParams): Promise<void> {
    const eventType = determineEventType(params);
    if (!eventType || !params.eventPayload) {
      return;
    }

    if (this.#shuttingDown) {
      this.#logger.warn(
        `Skipping GitLab webhook event of type "${eventType}" on topic "${params.topic}" because the bridge is shutting down`,
      );
      return;
    }

    const previous = this.#pendingPublish ?? Promise.resolve();
    const current = previous.then(async () => {
      try {
        const output = await analyzeGitLabWebhookEvent(
          eventType,
          params.eventPayload,
          {
            logger: this.#logger,
            isRelevantPath: path =>
              path.endsWith('.yaml') || path.endsWith('.yml'),
          },
        );

        if (output.result === 'ok') {
          await this.#catalogScmEvents.publish(output.events);
        } else if (output.result === 'ignored') {
          this.#logger.debug(
            `Skipping GitLab webhook event of type "${eventType}" on topic "${params.topic}" because it is ignored: ${output.reason}`,
          );
        } else if (output.result === 'aborted') {
          this.#logger.warn(
            `Skipping GitLab webhook event of type "${eventType}" on topic "${params.topic}" because it is aborted: ${output.reason}`,
          );
        } else if (output.result === 'unsupported-event') {
          this.#logger.debug(
            `Skipping GitLab webhook event of type "${eventType}" on topic "${params.topic}" because it is unsupported: ${output.event}`,
          );
        }
      } catch (error) {
        this.#logger.warn(
          `Failed to handle GitLab webhook event of type "${eventType}"`,
          error,
        );
      } finally {
        // no-op; chain handles ordering
      }
    });
    this.#pendingPublish = current;
    await current;
  }
}

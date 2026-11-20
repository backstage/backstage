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
import { Config } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { CatalogScmEventsService } from '@backstage/plugin-catalog-node/alpha';
import { EventParams, EventsService } from '@backstage/plugin-events-node';
import { analyzeGerritWebhookEvent } from './analyzeGerritWebhookEvent';

/**
 * Takes Gerrit events, analyzes them, and publishes them as catalog SCM events
 * that entity providers and others can subscribe to.
 *
 * Gerrit events don't carry the host they came from, so the bridge only runs
 * when exactly one Gerrit integration is configured.
 */
export class GerritScmEventsBridge {
  readonly #logger: LoggerService;
  readonly #config: Config;
  readonly #events: EventsService;
  readonly #catalogScmEvents: CatalogScmEventsService;
  #gitilesBaseUrl: string | undefined;
  #shuttingDown: boolean;
  #pendingPublish: Promise<void> | undefined;

  constructor(options: {
    logger: LoggerService;
    config: Config;
    events: EventsService;
    catalogScmEvents: CatalogScmEventsService;
  }) {
    this.#logger = options.logger;
    this.#config = options.config;
    this.#events = options.events;
    this.#catalogScmEvents = options.catalogScmEvents;
    this.#shuttingDown = false;
  }

  async start() {
    const integrations = ScmIntegrations.fromConfig(this.#config).gerrit.list();
    if (integrations.length === 0) {
      return;
    }
    if (integrations.length > 1) {
      this.#logger.warn(
        `Gerrit SCM event handling is disabled because ${integrations.length} Gerrit integrations are configured, and Gerrit events don't say which instance they came from`,
      );
      return;
    }

    this.#gitilesBaseUrl = integrations[0].config.gitilesBaseUrl;

    await this.#events.subscribe({
      id: 'catalog-gerrit-scm-events-bridge',
      topics: ['gerrit'],
      onEvent: this.#onEvent.bind(this),
    });
  }

  async stop() {
    this.#shuttingDown = true;
    await this.#pendingPublish;
  }

  async #onEvent(params: EventParams): Promise<void> {
    const gitilesBaseUrl = this.#gitilesBaseUrl;
    const payload = params.eventPayload as { type?: unknown } | undefined;
    const eventType = payload?.type;
    if (!gitilesBaseUrl || typeof eventType !== 'string') {
      return;
    }

    while (this.#pendingPublish) {
      await this.#pendingPublish;
    }

    if (this.#shuttingDown) {
      this.#logger.warn(
        `Skipping Gerrit event of type "${eventType}" on topic "${params.topic}" because the bridge is shutting down`,
      );
      return;
    }

    this.#pendingPublish = Promise.resolve().then(async () => {
      try {
        const output = await analyzeGerritWebhookEvent(
          eventType,
          params.eventPayload,
          { gitilesBaseUrl },
        );

        if (output.result === 'ok') {
          await this.#catalogScmEvents.publish(output.events);
        } else if (output.result === 'ignored') {
          this.#logger.debug(
            `Skipping Gerrit event of type "${eventType}" on topic "${params.topic}" because it is ignored: ${output.reason}`,
          );
        } else if (output.result === 'aborted') {
          this.#logger.warn(
            `Skipping Gerrit event of type "${eventType}" on topic "${params.topic}" because it is aborted: ${output.reason}`,
          );
        } else if (output.result === 'unsupported-event') {
          this.#logger.debug(
            `Skipping Gerrit event of type "${eventType}" on topic "${params.topic}" because it is unsupported: ${output.event}`,
          );
        }
      } catch (error) {
        this.#logger.warn(
          `Failed to handle Gerrit event of type "${eventType}"`,
          error,
        );
      } finally {
        this.#pendingPublish = undefined;
      }
    });

    await this.#pendingPublish;
  }
}

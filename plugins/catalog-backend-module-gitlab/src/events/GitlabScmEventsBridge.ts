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
import { analyzeGitlabWebhookEvent } from './analyzeGitlabWebhookEvent';

/**
 * Takes GitLab webhook events, analyzes them, and publishes them as catalog SCM
 * events that entity providers and others can subscribe to.
 */
export class GitlabScmEventsBridge {
    readonly #logger: LoggerService;
    readonly #events: EventsService;
    readonly #catalogScmEvents: CatalogScmEventsService;

    constructor(options: {
        logger: LoggerService;
        events: EventsService;
        catalogScmEvents: CatalogScmEventsService;
    }) {
        this.#logger = options.logger;
        this.#events = options.events;
        this.#catalogScmEvents = options.catalogScmEvents;
    }

    async start() {
        await this.#events.subscribe({
            id: 'catalog-gitlab-scm-events-bridge',
            topics: ['gitlab'],
            onEvent: this.#onEvent.bind(this),
        });
    }

    async #onEvent(params: EventParams): Promise<void> {
        const eventPayload = params.eventPayload;
        const metadata = params.metadata;
        // GitLab events usually have object_kind in payload.
        // Sometimes headers help, but payload is primary source for type.

        try {
            const output = await analyzeGitlabWebhookEvent(
                eventPayload,
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
                    `Skipping GitLab webhook event on topic "${params.topic}" because it is ignored: ${output.reason}`,
                );
            } else if (output.result === 'aborted') {
                this.#logger.warn(
                    `Skipping GitLab webhook event on topic "${params.topic}" because it is aborted: ${output.reason}`,
                );
            } else if (output.result === 'unsupported-event') {
                this.#logger.debug(
                    `Skipping GitLab webhook event on topic "${params.topic}" because it is unsupported: ${output.event}`,
                );
            }
        } catch (error) {
            this.#logger.warn(
                `Failed to handle GitLab webhook event`,
                error as Error,
            );
        }
    }
}

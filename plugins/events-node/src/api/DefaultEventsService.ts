/*
 * Copyright 2024 The Backstage Authors
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
import { EventParams } from './EventParams';
import { EventsService, EventsServiceSubscribeOptions } from './EventsService';

/**
 * In-process event broker which will pass the event to all registered subscribers
 * interested in it.
 * Events will not be persisted in any form.
 * Events will not be passed to subscribers at other instances of the same cluster.
 *
 * @public
 */
// TODO(pjungermann): add opentelemetry? (see plugins/catalog-backend/src/util/opentelemetry.ts, etc.)
export class DefaultEventsService implements EventsService {
  private readonly subscribers = new Map<
    string,
    Omit<EventsServiceSubscribeOptions, 'topics'>[]
  >();

  private constructor(private readonly logger: LoggerService) {}

  static create(options: { logger: LoggerService }): DefaultEventsService {
    return new DefaultEventsService(options.logger);
  }

  /**
   * Returns a plugin-scoped context of the `EventService`
   * that ensures to prefix subscriber IDs with the plugin ID.
   *
   * @param pluginId - The plugin that the `EventService` should be created for.
   */
  forPlugin(pluginId: string): EventsService {
    return {
      publish: (params: EventParams): Promise<void> => {
        return this.publish(params);
      },
      subscribe: (options: EventsServiceSubscribeOptions): Promise<void> => {
        return this.subscribe({
          ...options,
          id: `${pluginId}.${options.id}`,
        });
      },
    };
  }

  async publish(params: EventParams): Promise<void> {
    this.logger.debug(
      `Event received: topic=${params.topic}, metadata=${JSON.stringify(
        params.metadata,
      )}, payload=${JSON.stringify(params.eventPayload)}`,
    );

    if (!this.subscribers.has(params.topic)) {
      return;
    }

    const onEventPromises: Promise<void>[] = [];
    this.subscribers.get(params.topic)?.forEach(subscription => {
      onEventPromises.push(
        (async () => {
          try {
            await subscription.onEvent(params);
          } catch (error) {
            this.logger.warn(
              `Subscriber "${subscription.id}" failed to process event for topic "${params.topic}"`,
              error,
            );
          }
        })(),
      );
    });

    await Promise.all(onEventPromises);
  }

  async subscribe(options: EventsServiceSubscribeOptions): Promise<void> {
    options.topics.forEach(topic => {
      if (!this.subscribers.has(topic)) {
        this.subscribers.set(topic, []);
      }

      this.subscribers.get(topic)!.push({
        id: options.id,
        onEvent: options.onEvent,
      });
    });
  }
}

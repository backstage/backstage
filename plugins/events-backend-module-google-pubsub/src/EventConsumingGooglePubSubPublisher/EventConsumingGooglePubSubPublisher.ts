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

import {
  LoggerService,
  RootConfigService,
  RootLifecycleService,
} from '@backstage/backend-plugin-api';
import { EventsService } from '@backstage/plugin-events-node';
import { PubSub } from '@google-cloud/pubsub';
import { Counter, metrics } from '@opentelemetry/api';
import { readSubscriptionTasksFromConfig } from './config';
import { SubscriptionTask } from './types';

/**
 * Reads messages off of the events system and forwards them into Google Pub/Sub
 * topics.
 */
export class EventConsumingGooglePubSubPublisher {
  readonly #logger: LoggerService;
  readonly #events: EventsService;
  readonly #tasks: SubscriptionTask[];
  readonly #pubSubFactory: (projectId: string) => PubSub;
  readonly #metrics: { messages: Counter };
  #activeClientsByProjectId: Map<string, PubSub>;

  static create(options: {
    config: RootConfigService;
    logger: LoggerService;
    rootLifecycle: RootLifecycleService;
    events: EventsService;
  }) {
    const publisher = new EventConsumingGooglePubSubPublisher({
      logger: options.logger,
      events: options.events,
      tasks: readSubscriptionTasksFromConfig(options.config),
      pubSubFactory: projectId => new PubSub({ projectId }),
    });

    options.rootLifecycle.addStartupHook(async () => {
      await publisher.start();
    });

    options.rootLifecycle.addBeforeShutdownHook(async () => {
      await publisher.stop();
    });

    return publisher;
  }

  constructor(options: {
    logger: LoggerService;
    events: EventsService;
    tasks: SubscriptionTask[];
    pubSubFactory: (projectId: string) => PubSub;
  }) {
    this.#logger = options.logger;
    this.#events = options.events;
    this.#tasks = options.tasks;
    this.#pubSubFactory = options.pubSubFactory;

    const meter = metrics.getMeter('default');
    this.#metrics = {
      messages: meter.createCounter(
        'events.google.pubsub.publisher.messages.total',
        {
          description:
            'Number of Pub/Sub messages sent by EventConsumingGooglePubSubPublisher',
          unit: 'short',
        },
      ),
    };

    this.#activeClientsByProjectId = new Map();
  }

  async start() {
    for (const task of this.#tasks) {
      this.#logger.info(
        `Starting publisher: id=${
          task.id
        } sourceTopics=${task.sourceTopics.join(',')} targetTopic=${
          task.targetTopicPattern
        }`,
      );

      await this.#events.subscribe({
        id: `EventConsumingGooglePubSubPublisher.${task.id}`,
        topics: task.sourceTopics,
        onEvent: async event => {
          let status: 'success' | 'failed' | 'ignored' = 'failed';
          try {
            const topic = task.mapToTopic(event);
            if (!topic) {
              status = 'ignored';
              return;
            }

            let pubsub = this.#activeClientsByProjectId.get(topic.project);
            if (!pubsub) {
              pubsub = this.#pubSubFactory(topic.project);
              this.#activeClientsByProjectId.set(topic.project, pubsub);
            }

            await pubsub.topic(topic.topic).publishMessage({
              json: event.eventPayload,
              attributes: task.mapToAttributes(event),
            });

            status = 'success';
          } catch (error) {
            this.#logger.error(
              'Error publishing Google Pub/Sub message',
              error,
            );
            status = 'failed';
            throw error;
          } finally {
            this.#metrics.messages.add(1, {
              subscription: task.id,
              status: status,
            });
          }
        },
      });
    }
  }

  async stop() {
    const clients = Array.from(this.#activeClientsByProjectId.values());
    this.#activeClientsByProjectId = new Map();

    await Promise.allSettled(
      clients.map(async client => {
        this.#logger.info(`Closing Google Pub/Sub client: ${client.projectId}`);
        await client.close();
      }),
    );
  }
}

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
import { EventParams, EventsService } from '@backstage/plugin-events-node';
import { Message, PubSub, Subscription } from '@google-cloud/pubsub';
import { Counter, metrics } from '@opentelemetry/api';
import { readSubscriptionTasksFromConfig } from './config';
import { SubscriptionTask } from './types';

/**
 * Reads messages off of Google Pub/Sub subscriptions and forwards them into the
 * Backstage events system.
 */
export class GooglePubSubConsumingEventPublisher {
  readonly #logger: LoggerService;
  readonly #events: EventsService;
  readonly #tasks: SubscriptionTask[];
  readonly #pubSubFactory: (projectId: string) => PubSub;
  readonly #metrics: { messages: Counter };
  #activeClientsByProjectId: Map<string, PubSub>;
  #activeSubscriptions: Subscription[];

  static create(options: {
    config: RootConfigService;
    logger: LoggerService;
    rootLifecycle: RootLifecycleService;
    events: EventsService;
  }) {
    const publisher = new GooglePubSubConsumingEventPublisher({
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
        'events.google.pubsub.consumer.messages.total',
        {
          description:
            'Number of Pub/Sub messages received by GooglePubSubConsumingEventPublisher',
          unit: 'short',
        },
      ),
    };

    this.#activeClientsByProjectId = new Map();
    this.#activeSubscriptions = [];
  }

  async start() {
    for (const task of this.#tasks) {
      this.#logger.info(
        `Starting subscription: id=${task.id} project=${task.project} subscription=${task.subscription}`,
      );

      let pubsub = this.#activeClientsByProjectId.get(task.project);
      if (!pubsub) {
        pubsub = this.#pubSubFactory(task.project);
        this.#activeClientsByProjectId.set(task.project, pubsub);
      }

      // You cannot control the actual batch size delivered to the client from
      // pubsub, so these settings actually instead control the rate at which
      // messages are released to our event handlers by the pubsub library. This
      // means that there may be significantly more than maxMessages messages
      // pending in memory before we see them. Thus, the settings here are rather
      // chosen so as to limit the concurrency of hammering consumers (the catalog
      // etc).
      const subscription = pubsub.subscription(task.subscription, {
        flowControl: {
          maxMessages: 5,
          allowExcessMessages: false,
        },
      });

      this.#activeSubscriptions.push(subscription);

      subscription.on('error', error => {
        this.#logger.error(
          `Error reading Google Pub/Sub subscription: ${task.id}`,
          error,
        );
      });

      subscription.on('message', async message => {
        let event: EventParams;
        try {
          event = this.#messageToEvent(message, task)!;
          if (!event) {
            this.#metrics.messages.add(1, {
              subscription: task.id,
              status: 'ignored',
            });
            return;
          }
        } catch (error) {
          this.#logger.error('Error processing Google Pub/Sub message', error);
          this.#metrics.messages.add(1, {
            subscription: task.id,
            status: 'failed',
          });
          // We unconditionally ACK the message in this case, because if it's
          // broken, it will still be broken next time around, so there is no
          // point in re-delivering it.
          message.ack();
          return;
        }

        try {
          await this.#events.publish(event);
          this.#metrics.messages.add(1, {
            subscription: task.id,
            status: 'success',
          });
          message.ack();
        } catch (error) {
          this.#logger.error('Error processing Google Pub/Sub message', error);
          this.#metrics.messages.add(1, {
            subscription: task.id,
            status: 'failed',
          });
          // We fast-NACK the message in this case because this may be a
          // transient problem with the events backend.
          message.nack();
        }
      });
    }
  }

  async stop() {
    const subscriptions = this.#activeSubscriptions;
    const clients = Array.from(this.#activeClientsByProjectId.values());

    this.#activeSubscriptions = [];
    this.#activeClientsByProjectId = new Map();

    await Promise.allSettled(
      subscriptions.map(async subscription => {
        this.#logger.info(
          `Closing Google Pub/Sub subscription: ${subscription.name}`,
        );
        await subscription.close();
      }),
    );

    await Promise.allSettled(
      clients.map(async client => {
        this.#logger.info(`Closing Google Pub/Sub client: ${client.projectId}`);
        await client.close();
      }),
    );
  }

  #messageToEvent(
    message: Message,
    task: SubscriptionTask,
  ): EventParams | undefined {
    const topic = task.mapToTopic(message);
    if (!topic) {
      return undefined;
    }
    return {
      topic,
      eventPayload: JSON.parse(message.data.toString()),
      metadata: task.mapToMetadata(message),
    };
  }
}

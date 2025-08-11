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
import { EventParams, EventsService } from '@backstage/plugin-events-node';
import { Consumer, ConsumerSubscribeTopics, IHeaders, Kafka } from 'kafkajs';
import { KafkaConsumerConfig } from './config';

type EventMetadata = EventParams['metadata'];

/**
 * This class subscribes to Kafka topics and publishes events received to the registered subscriber.
 * The message payload will be used as the event payload and passed to the subscribers.
 */
export class KafkaConsumingEventPublisher {
  private readonly kafkaConsumer: Consumer;
  private readonly consumerSubscribeTopics: ConsumerSubscribeTopics;
  private readonly backstageTopic: string;
  private readonly logger: LoggerService;

  static fromConfig(env: {
    kafkaClient: Kafka;
    config: KafkaConsumerConfig;
    events: EventsService;
    logger: LoggerService;
  }): KafkaConsumingEventPublisher {
    return new KafkaConsumingEventPublisher(
      env.kafkaClient,
      env.logger,
      env.events,
      env.config,
    );
  }

  private constructor(
    kafkaClient: Kafka,
    logger: LoggerService,
    private readonly events: EventsService,
    config: KafkaConsumerConfig,
  ) {
    this.kafkaConsumer = kafkaClient.consumer(config.consumerConfig);
    this.consumerSubscribeTopics = config.consumerSubscribeTopics;
    this.backstageTopic = config.backstageTopic;
    const id = `events.kafka.publisher:${this.backstageTopic}`;
    this.logger = logger.child({
      class: KafkaConsumingEventPublisher.prototype.constructor.name,
      groupId: config.consumerConfig.groupId,
      kafkaTopics: config.consumerSubscribeTopics.topics.toString(),
      backstageTopic: config.backstageTopic,
      taskId: id,
    });
  }

  async start(): Promise<void> {
    try {
      await this.kafkaConsumer.connect();

      await this.kafkaConsumer.subscribe(this.consumerSubscribeTopics);

      await this.kafkaConsumer.run({
        eachMessage: async ({ message }) => {
          this.events.publish({
            topic: this.backstageTopic,
            eventPayload: JSON.parse(message.value?.toString()!),
            metadata: this.convertHeadersToMetadata(message.headers),
          });
        },
      });
    } catch (error: any) {
      this.logger.error('Kafka consumer connection failed ', error);
    }
  }

  async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  private convertHeadersToMetadata = (
    headers: IHeaders | undefined,
  ): EventParams['metadata'] => {
    if (!headers) return undefined;

    const metadata: EventMetadata = {};

    Object.entries(headers).forEach(([key, value]) => {
      // If value is an array use toString() on all values converting any Buffer types to valid strings
      if (Array.isArray(value)) metadata[key] = value.map(v => v.toString());
      // Always return the values using toString() to catch all Buffer types that should be converted to strings
      else metadata[key] = value?.toString();
    });

    return metadata;
  };
}

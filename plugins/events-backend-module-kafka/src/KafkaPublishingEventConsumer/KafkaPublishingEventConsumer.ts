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
import { Kafka, Producer } from 'kafkajs';
import {
  KafkaPublisherConfig,
  KafkaPublishingEventConsumerConfig,
  readPublisherConfig,
} from './config';
import { Config } from '@backstage/config';
import { loggerServiceAdapter } from '../utils/LoggerServiceAdapter';
import { payloadToBuffer } from '../utils/kafkaTransformers';

type KafkaPublisher = {
  producer: Producer;
  config: KafkaPublisherConfig;
};

/**
 * This class subscribes to Backstage internal events and publishes them to Kafka topics.
 * The internal event payload will be serialized and sent to the configured Kafka topic.
 */
export class KafkaPublishingEventConsumer {
  private readonly kafkaPublishers: KafkaPublisher[];
  private readonly logger: LoggerService;

  static fromConfig(env: {
    config: Config;
    events: EventsService;
    logger: LoggerService;
  }): KafkaPublishingEventConsumer[] {
    const configs = readPublisherConfig(env.config);

    return configs.map(
      kafkaConfig =>
        new KafkaPublishingEventConsumer(env.logger, env.events, kafkaConfig),
    );
  }

  private constructor(
    logger: LoggerService,
    private readonly events: EventsService,
    config: KafkaPublishingEventConsumerConfig,
  ) {
    this.logger = logger.child({
      class: KafkaPublishingEventConsumer.prototype.constructor.name,
      instance: config.instance,
    });

    const kafka = new Kafka({
      ...config.kafkaConfig,
      logCreator: loggerServiceAdapter(this.logger),
    });

    this.kafkaPublishers = config.kafkaPublisherConfigs.map(
      publisherConfig => ({
        producer: kafka.producer(publisherConfig.producerConfig),
        config: publisherConfig,
      }),
    );
  }

  async start(): Promise<void> {
    await Promise.all(
      this.kafkaPublishers.map(async ({ producer, config }) => {
        try {
          await producer.connect();

          this.events.subscribe({
            id: `kafka:publisher:${config.backstageTopic}`,
            topics: [config.backstageTopic],
            onEvent: async (params: EventParams) => {
              await producer.send({
                topic: config.kafkaTopic,
                messages: [
                  {
                    value: payloadToBuffer(params.eventPayload),
                  },
                ],
              });
            },
          });
          this.logger.info(
            `Subscribed to EventService, publishing events to external topic: ${config.backstageTopic}`,
          );
        } catch (error: any) {
          this.logger.error(
            `Kafka producer connection failed for topic ${config.backstageTopic}`,
            error,
          );
        }
      }),
    );
  }

  async shutdown(): Promise<void> {
    await Promise.all(
      this.kafkaPublishers.map(({ producer }) => producer.disconnect()),
    );
  }
}

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
import { Config } from '@backstage/config';
import { EventsService } from '@backstage/plugin-events-node';
import { Kafka } from 'kafkajs';
import { KafkaEventSourceConfig, readConfig } from './config';
import { KafkaConsumingEventPublisher } from './KafkaConsumingEventPublisher';
import { loggerServiceAdapter } from './LoggerServiceAdapter';

/**
 * KafkaConsumerClient
 *
 * This class creates the Kafka client that will be used to create the KafkaConsumingEventPublisher
 */
export class KafkaConsumerClient {
  private readonly kafka: Kafka;
  private readonly consumers: KafkaConsumingEventPublisher[];

  static fromConfig(options: {
    config: Config;
    events: EventsService;
    logger: LoggerService;
  }): KafkaConsumerClient | undefined {
    const kafkaConfig = readConfig(options.config);

    if (!kafkaConfig) {
      options.logger.info(
        'Kafka consumer not configured, skipping initialization',
      );
      return undefined;
    }

    return new KafkaConsumerClient(options.logger, options.events, kafkaConfig);
  }

  private constructor(
    logger: LoggerService,
    events: EventsService,
    config: KafkaEventSourceConfig,
  ) {
    this.kafka = new Kafka({
      ...config.kafkaConfig,
      logCreator: loggerServiceAdapter(logger),
    });

    this.consumers = config.kafkaConsumerConfigs.map(consumerConfig =>
      KafkaConsumingEventPublisher.fromConfig({
        kafkaClient: this.kafka,
        config: consumerConfig,
        logger,
        events,
      }),
    );
  }

  async start(): Promise<void> {
    this.consumers.map(async consumer => await consumer.start());
  }

  async shutdown(): Promise<void> {
    this.consumers.map(async consumer => await consumer.shutdown());
  }
}

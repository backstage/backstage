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
import { EventsService } from '@backstage/plugin-events-node';
import { Consumer, Kafka } from 'kafkajs';
import {
  KafkaConsumerConfig,
  KafkaConsumingEventPublisherConfig,
  readConsumerConfig,
} from './config';
import { Config } from '@backstage/config';
import { loggerServiceAdapter } from '../utils/LoggerServiceAdapter';
import { convertHeadersToMetadata } from '../utils/kafkaTransformers';

type KafkaConsumer = {
  consumer: Consumer;
  config: KafkaConsumerConfig;
};

/**
 * This class subscribes to Kafka topics and publishes events received to the registered subscriber.
 * The message payload will be used as the event payload and passed to the subscribers.
 */
export class KafkaConsumingEventPublisher {
  private readonly kafkaConsumers: KafkaConsumer[];
  private readonly logger: LoggerService;

  static fromConfig(env: {
    config: Config;
    events: EventsService;
    logger: LoggerService;
  }): KafkaConsumingEventPublisher[] {
    const configs = readConsumerConfig(env.config, env.logger);

    return configs.map(
      kafkaConfig =>
        new KafkaConsumingEventPublisher(env.logger, env.events, kafkaConfig),
    );
  }

  private constructor(
    logger: LoggerService,
    private readonly events: EventsService,
    config: KafkaConsumingEventPublisherConfig,
  ) {
    this.logger = logger.child({
      class: KafkaConsumingEventPublisher.prototype.constructor.name,
      instance: config.instance,
    });

    const kafka = new Kafka({
      ...config.kafkaConfig,
      logCreator: loggerServiceAdapter(this.logger),
    });

    this.kafkaConsumers = config.kafkaConsumerConfigs.map(consumerConfig => ({
      consumer: kafka.consumer(consumerConfig.consumerConfig),
      config: consumerConfig,
    }));
  }

  async start(): Promise<void> {
    await Promise.all(
      this.kafkaConsumers.map(async ({ consumer, config }) => {
        const consumerLogger = this.logger.child({
          id: `events.kafka.publisher:${config.backstageTopic}`,
          groupId: config.consumerConfig.groupId,
          kafkaTopics: config.consumerSubscribeTopics.topics.toString(),
          backstageTopic: config.backstageTopic,
        });
        try {
          await consumer.connect();
          await consumer.subscribe(config.consumerSubscribeTopics);

          await consumer.run({
            autoCommit: config.autoCommit,
            eachMessage: async ({
              topic,
              partition,
              message,
              heartbeat,
              pause,
            }) => {
              try {
                await this.events.publish({
                  topic: config.backstageTopic,
                  eventPayload: JSON.parse(message.value?.toString()!),
                  metadata: convertHeadersToMetadata(message.headers),
                });

                // Only commit offset manually if autoCommit is disabled
                if (!config.autoCommit) {
                  await consumer.commitOffsets([
                    {
                      topic,
                      partition,
                      offset: (parseInt(message.offset, 10) + 1).toString(),
                    },
                  ]);
                }

                await heartbeat();
              } catch (error: any) {
                consumerLogger.error(
                  `Failed to process message at offset ${message.offset} on partition ${partition} of topic ${topic}`,
                  error,
                );

                if (config.pauseOnError) {
                  pause();
                  throw error;
                }

                // Skip the failed message by committing its offset if autoCommit is disabled
                if (!config.autoCommit) {
                  await consumer.commitOffsets([
                    {
                      topic,
                      partition,
                      offset: (parseInt(message.offset, 10) + 1).toString(),
                    },
                  ]);
                }
              }
            },
          });
        } catch (error: any) {
          consumerLogger.error('Kafka consumer connection failed', error);
        }
      }),
    );
  }

  async shutdown(): Promise<void> {
    await Promise.all(
      this.kafkaConsumers.map(({ consumer }) => consumer.disconnect()),
    );
  }
}

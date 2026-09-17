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
import { Config } from '@backstage/config';
import {
  readKafkaConfig,
  readOptionalHumanDurationInMs,
  readRetryConfig,
} from '../utils/config';
import { KafkaConfig, ProducerConfig } from 'kafkajs';

export interface KafkaPublisherConfig {
  backstageTopic: string;
  kafkaTopic: string;
  producerConfig: ProducerConfig;
}

export interface KafkaPublishingEventConsumerConfig {
  instance: string;
  kafkaConfig: KafkaConfig;
  kafkaPublisherConfigs: KafkaPublisherConfig[];
}

const CONFIG_PREFIX_PUBLISHER =
  'events.modules.kafka.kafkaPublishingEventConsumer';

export const readPublisherConfig = (
  config: Config,
): KafkaPublishingEventConsumerConfig[] => {
  const publishers = config.getOptionalConfig(CONFIG_PREFIX_PUBLISHER);

  return (
    publishers?.keys()?.map(publisherKey => {
      const publisherConfig = publishers.getConfig(publisherKey);

      return {
        instance: publisherKey,
        kafkaConfig: readKafkaConfig(publisherConfig),
        kafkaPublisherConfigs: publisherConfig
          .getConfigArray('topics')
          .map(topicConfig => {
            return {
              backstageTopic: topicConfig.getString('topic'),
              kafkaTopic: topicConfig.getString('kafka.topic'),
              producerConfig: {
                allowAutoTopicCreation: topicConfig.getOptionalBoolean(
                  'kafka.allowAutoTopicCreation',
                ),
                metadataMaxAge: readOptionalHumanDurationInMs(
                  topicConfig,
                  'kafka.metadataMaxAge',
                ),
                transactionTimeout: readOptionalHumanDurationInMs(
                  topicConfig,
                  'kafka.transactionTimeout',
                ),
                idempotent: topicConfig.getOptionalBoolean('kafka.idempotent'),
                maxInFlightRequests: topicConfig.getOptionalNumber(
                  'kafka.maxInFlightRequests',
                ),
                retry: readRetryConfig(
                  topicConfig.getOptionalConfig('kafka.retry'),
                ),
              },
            };
          }),
      };
    }) ?? []
  );
};

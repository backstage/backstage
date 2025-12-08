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
import { ConsumerConfig, ConsumerSubscribeTopics, KafkaConfig } from 'kafkajs';
import {
  readKafkaConfig,
  readOptionalHumanDurationInMs,
} from '../utils/config';

export interface KafkaConsumerConfig {
  backstageTopic: string;
  consumerConfig: ConsumerConfig;
  consumerSubscribeTopics: ConsumerSubscribeTopics;
}

export interface KafkaConsumingEventPublisherConfig {
  instance: string;
  kafkaConfig: KafkaConfig;
  kafkaConsumerConfigs: KafkaConsumerConfig[];
}

const CONFIG_PREFIX_PUBLISHER =
  'events.modules.kafka.kafkaConsumingEventPublisher';

export const readConsumerConfig = (
  config: Config,
): KafkaConsumingEventPublisherConfig[] => {
  const publishers = config.getOptionalConfig(CONFIG_PREFIX_PUBLISHER);

  return (
    publishers?.keys()?.map(publisherKey => {
      const publisherConfig = publishers.getConfig(publisherKey);

      return {
        instance: publisherKey,
        kafkaConfig: readKafkaConfig(publisherConfig),
        kafkaConsumerConfigs: publisherConfig
          .getConfigArray('topics')
          .map(topicConfig => {
            return {
              backstageTopic: topicConfig.getString('topic'),
              consumerConfig: {
                groupId: topicConfig.getString('kafka.groupId'),
                sessionTimeout: readOptionalHumanDurationInMs(
                  topicConfig,
                  'kafka.sessionTimeout',
                ),
                rebalanceTimeout: readOptionalHumanDurationInMs(
                  topicConfig,
                  'kafka.rebalanceTimeout',
                ),
                heartbeatInterval: readOptionalHumanDurationInMs(
                  topicConfig,
                  'kafka.heartbeatInterval',
                ),
                metadataMaxAge: readOptionalHumanDurationInMs(
                  topicConfig,
                  'kafka.metadataMaxAge',
                ),
                maxBytesPerPartition: topicConfig.getOptionalNumber(
                  'kafka.maxBytesPerPartition',
                ),
                minBytes: topicConfig.getOptionalNumber('kafka.minBytes'),
                maxBytes: topicConfig.getOptionalNumber('kafka.maxBytes'),
                maxWaitTimeInMs: readOptionalHumanDurationInMs(
                  topicConfig,
                  'kafka.maxWaitTime',
                ),
              },
              consumerSubscribeTopics: {
                topics: topicConfig.getStringArray('kafka.topics'),
              },
            };
          }),
      };
    }) ?? []
  );
};

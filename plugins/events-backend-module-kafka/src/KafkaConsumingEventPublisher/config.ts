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
import { LoggerService } from '@backstage/backend-plugin-api';

export interface KafkaConsumerConfig {
  backstageTopic: string;
  consumerConfig: ConsumerConfig;
  consumerSubscribeTopics: ConsumerSubscribeTopics;
  autoCommit: boolean;
  pauseOnError: boolean;
}

export interface KafkaConsumingEventPublisherConfig {
  instance: string;
  kafkaConfig: KafkaConfig;
  kafkaConsumerConfigs: KafkaConsumerConfig[];
}

const CONFIG_PREFIX_PUBLISHER =
  'events.modules.kafka.kafkaConsumingEventPublisher';

const processSinglePublisher = (
  instanceName: string,
  publisherConfig: Config,
): KafkaConsumingEventPublisherConfig => {
  return {
    instance: instanceName,
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
            fromBeginning: topicConfig.getOptionalBoolean(
              'kafka.fromBeginning',
            ),
          },
          // Default autoCommit to true to match KafkaJS default and ensure consistency
          // between KafkaJS's auto-commit behavior and our manual commit logic
          autoCommit:
            topicConfig.getOptionalBoolean('kafka.autoCommit') ?? true,
          pauseOnError:
            topicConfig.getOptionalBoolean('kafka.pauseOnError') ?? false,
        };
      }),
  };
};

export const readConsumerConfig = (
  config: Config,
  logger: LoggerService,
): KafkaConsumingEventPublisherConfig[] => {
  const publishersConfig = config.getOptionalConfig(CONFIG_PREFIX_PUBLISHER);

  // Check for legacy single publisher format
  if (publishersConfig?.getOptionalString('clientId')) {
    logger.warn(
      'Legacy single config format detected at events.modules.kafka.kafkaConsumingEventPublisher.',
    );
    return [
      processSinglePublisher(
        'default', // use `default` as instance name for legacy single config
        publishersConfig,
      ),
    ];
  }

  return (
    publishersConfig
      ?.keys()
      ?.map(publisherKey =>
        processSinglePublisher(
          publisherKey,
          publishersConfig.getConfig(publisherKey),
        ),
      ) ?? []
  );
};

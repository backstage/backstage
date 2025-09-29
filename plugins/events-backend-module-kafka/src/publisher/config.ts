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
import { Config, readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';
import { ConsumerConfig, ConsumerSubscribeTopics, KafkaConfig } from 'kafkajs';

export interface KafkaConsumerConfig {
  backstageTopic: string;
  consumerConfig: ConsumerConfig;
  consumerSubscribeTopics: ConsumerSubscribeTopics;
}

export interface KafkaEventSourceConfig {
  kafkaConfig: KafkaConfig;
  kafkaConsumerConfigs: KafkaConsumerConfig[];
}

const CONFIG_PREFIX_PUBLISHER =
  'events.modules.kafka.kafkaConsumingEventPublisher';

/**
 * Reads an optional HumanDuration from the config and returns the value in milliseconds if the key is defined.
 *
 * @param config - The configuration object to read from.
 * @param key - The key to look up in the configuration.
 * @returns The duration in milliseconds, or undefined if the key is not defined.
 */
const readOptionalHumanDurationInMs = (
  config: Config,
  key: string,
): number | undefined => {
  const humanDuration = config.has(key)
    ? readDurationFromConfig(config, { key })
    : undefined;

  if (!humanDuration) return undefined;

  return durationToMilliseconds(humanDuration);
};

export const readConfig = (
  config: Config,
): KafkaEventSourceConfig | undefined => {
  const kafkaConfig = config.getOptionalConfig(CONFIG_PREFIX_PUBLISHER);

  if (!kafkaConfig) {
    return undefined;
  }

  const clientId = kafkaConfig.getString('clientId');
  const brokers = kafkaConfig.getStringArray('brokers');

  const authenticationTimeout = readOptionalHumanDurationInMs(
    kafkaConfig,
    'authenticationTimeout',
  );

  const connectionTimeout = readOptionalHumanDurationInMs(
    kafkaConfig,
    'connectionTimeout',
  );
  const requestTimeout = readOptionalHumanDurationInMs(
    kafkaConfig,
    'requestTimeout',
  );
  const enforceRequestTimeout = kafkaConfig.getOptionalBoolean(
    'enforceRequestTimeout',
  );

  const ssl = kafkaConfig.getOptional('ssl') as KafkaConfig['ssl'];
  const sasl = kafkaConfig.getOptional('sasl') as KafkaConfig['sasl'];

  const retry: KafkaConfig['retry'] = {
    maxRetryTime: readOptionalHumanDurationInMs(
      kafkaConfig,
      'retry.maxRetryTime',
    ),
    initialRetryTime: readOptionalHumanDurationInMs(
      kafkaConfig,
      'retry.initialRetryTime',
    ),
    factor: kafkaConfig.getOptionalNumber('retry.factor'),
    multiplier: kafkaConfig.getOptionalNumber('retry.multiplier'),
    retries: kafkaConfig.getOptionalNumber('retry.retries'),
  };

  const kafkaConsumerConfigs: KafkaConsumerConfig[] = kafkaConfig
    .getConfigArray('topics')
    .map(topic => {
      return {
        backstageTopic: topic.getString('topic'),
        consumerConfig: {
          groupId: topic.getString('kafka.groupId'),
          sessionTimeout: readOptionalHumanDurationInMs(
            topic,
            'kafka.sessionTimeout',
          ),
          rebalanceTimeout: readOptionalHumanDurationInMs(
            topic,
            'kafka.rebalanceTimeout',
          ),
          heartbeatInterval: readOptionalHumanDurationInMs(
            topic,
            'kafka.heartbeatInterval',
          ),
          metadataMaxAge: readOptionalHumanDurationInMs(
            topic,
            'kafka.metadataMaxAge',
          ),
          maxBytesPerPartition: topic.getOptionalNumber(
            'kafka.maxBytesPerPartition',
          ),
          minBytes: topic.getOptionalNumber('kafka.minBytes'),
          maxBytes: topic.getOptionalNumber('kafka.maxBytes'),
          maxWaitTimeInMs: readOptionalHumanDurationInMs(
            topic,
            'kafka.maxWaitTime',
          ),
        },
        consumerSubscribeTopics: {
          topics: topic.getStringArray('kafka.topics'),
        },
      };
    });

  return {
    kafkaConfig: {
      clientId,
      brokers,
      ssl,
      sasl,
      authenticationTimeout,
      connectionTimeout,
      requestTimeout,
      enforceRequestTimeout,
      retry,
    },
    kafkaConsumerConfigs,
  };
};

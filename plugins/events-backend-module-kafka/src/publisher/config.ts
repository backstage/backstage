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

/**
 * @public
 */
export interface KafkaConsumerConfig {
  backstageTopic: string;
  consumerConfig: ConsumerConfig;
  consumerSubscribeConfig: ConsumerSubscribeTopics;
}

/**
 * @public
 */
export interface KafkaEventSourceConfig {
  kafkaConfig: KafkaConfig;
  kafkaConsumerConfig: KafkaConsumerConfig[];
}

const CONFIG_PREFIX_PUBLISHER =
  'events.modules.kafka.kafkaConsumingEventPublisher';

export const readConfig = (config: Config): KafkaEventSourceConfig => {
  const kafkaConfig = config.getConfig(CONFIG_PREFIX_PUBLISHER);

  const clientId = kafkaConfig.getString('clientId');
  const brokers = kafkaConfig.getStringArray('brokers');

  const authenticationTimeout = kafkaConfig.getOptionalNumber(
    'authenticationTimeout',
  );
  const connectionTimeout = kafkaConfig.getOptionalNumber('connectionTimeout');
  const requestTimeout = kafkaConfig.getOptionalNumber('requestTimeout');
  const enforceRequestTimeout = kafkaConfig.getOptionalBoolean(
    'enforceRequestTimeout',
  );

  const ssl = kafkaConfig.getOptional('ssl') as KafkaConfig['ssl'];
  const sasl = kafkaConfig.getOptional('sasl') as KafkaConfig['sasl'];
  const retry = kafkaConfig.getOptional('retry') as KafkaConfig['retry'];

  const kafkaConsumerConfig: KafkaConsumerConfig[] = kafkaConfig
    .getConfigArray('topics')
    .map(topic => {
      return {
        backstageTopic: topic.getString('topic'),
        consumerConfig: {
          groupId: topic.getString('kafka.groupId'),
          sessionTimeout: topic.getOptionalNumber('kafka.sessionTimeout'),
          rebalanceTimeout: topic.getOptionalNumber('kafka.rebalanceTimeout'),
          heartbeatInterval: topic.getOptionalNumber('kafka.heartbeatInterval'),
          metadataMaxAge: topic.getOptionalNumber('kafka.metadataMaxAge'),
          maxBytesPerPartition: topic.getOptionalNumber(
            'kafka.maxBytesPerPartition',
          ),
          minBytes: topic.getOptionalNumber('kafka.minBytes'),
          maxBytes: topic.getOptionalNumber('kafka.maxBytes'),
          maxWaitTimeInMs: topic.getOptionalNumber('kafka.maxWaitTimeInMs'),
        },
        consumerSubscribeConfig: {
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
    kafkaConsumerConfig,
  };
};

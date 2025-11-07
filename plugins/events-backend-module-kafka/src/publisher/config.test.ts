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
import { ConfigReader } from '@backstage/config';
import { readConfig } from './config';

describe('readConfig', () => {
  it('not configured', () => {
    const publisherConfigs = readConfig(new ConfigReader({}));

    expect(publisherConfigs).toBeUndefined();
  });

  it('only required fields configured', () => {
    const config = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaConsumingEventPublisher: {
              clientId: 'backstage-events',
              brokers: ['kafka1:9092', 'kafka2:9092'],
              topics: [
                {
                  topic: 'fake1',
                  kafka: {
                    topics: ['topic-A'],
                    groupId: 'my-group',
                  },
                },
                {
                  topic: 'fake2',
                  kafka: {
                    topics: ['topic-B'],
                    groupId: 'my-group',
                  },
                },
              ],
            },
          },
        },
      },
    });

    const publisherConfigs = readConfig(config);

    expect(publisherConfigs).toBeDefined();

    expect(publisherConfigs?.kafkaConsumerConfigs.length).toBe(2);

    expect(publisherConfigs?.kafkaConfig.clientId).toEqual('backstage-events');
    expect(publisherConfigs?.kafkaConfig.brokers).toEqual([
      'kafka1:9092',
      'kafka2:9092',
    ]);
    expect(publisherConfigs?.kafkaConsumerConfigs[0].backstageTopic).toEqual(
      'fake1',
    );
    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerConfig.groupId,
    ).toEqual('my-group');
    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerSubscribeTopics.topics,
    ).toEqual(['topic-A']);
  });

  it('all fields configured', () => {
    const config = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaConsumingEventPublisher: {
              clientId: 'backstage-events',
              brokers: ['kafka1:9092', 'kafka2:9092'],
              ssl: true,
              sasl: {
                mechanism: 'plain',
                username: 'username',
                password: 'password',
              },
              retry: {
                maxRetryTime: { milliseconds: 20000 },
                initialRetryTime: { milliseconds: 200 },
                factor: '0.4',
                multiplier: '4',
                retries: '10',
              },
              authenticationTimeout: { milliseconds: 20000 },
              connectionTimeout: { milliseconds: 1500 },
              requestTimeout: { milliseconds: 20000 },
              enforceRequestTimeout: false,
              topics: [
                {
                  topic: 'fake1',
                  kafka: {
                    topics: ['topic-A'],
                    groupId: 'my-group',
                    sessionTimeout: { milliseconds: 20000 },
                    rebalanceTimeout: { milliseconds: 50000 },
                    heartbeatInterval: { milliseconds: 2000 },
                    metadataMaxAge: { milliseconds: 400000 },
                    maxBytesPerPartition: 50000,
                    minBytes: 2,
                    maxBytes: 500000,
                    maxWaitTime: { milliseconds: 4000 },
                  },
                },
                {
                  topic: 'fake2',
                  kafka: {
                    topics: ['topic-B'],
                    groupId: 'my-group',
                  },
                },
              ],
            },
          },
        },
      },
    });

    const publisherConfigs = readConfig(config);

    expect(publisherConfigs).toBeDefined();

    // Client configuration
    expect(publisherConfigs?.kafkaConfig.clientId).toEqual('backstage-events');
    expect(publisherConfigs?.kafkaConfig.brokers).toEqual([
      'kafka1:9092',
      'kafka2:9092',
    ]);
    expect(publisherConfigs?.kafkaConfig.ssl).toBeTruthy();
    expect(publisherConfigs?.kafkaConfig.sasl).toStrictEqual({
      mechanism: 'plain',
      username: 'username',
      password: 'password',
    });
    expect(publisherConfigs?.kafkaConfig.authenticationTimeout).toBe(20000);
    expect(publisherConfigs?.kafkaConfig.connectionTimeout).toBe(1500);
    expect(publisherConfigs?.kafkaConfig.requestTimeout).toBe(20000);
    expect(publisherConfigs?.kafkaConfig.enforceRequestTimeout).toBeFalsy();
    expect(publisherConfigs?.kafkaConfig.retry).toStrictEqual({
      maxRetryTime: 20000,
      initialRetryTime: 200,
      factor: 0.4,
      multiplier: 4,
      retries: 10,
    });

    // Consumer configuration
    expect(publisherConfigs?.kafkaConsumerConfigs.length).toBe(2);
    expect(publisherConfigs?.kafkaConsumerConfigs[0].backstageTopic).toEqual(
      'fake1',
    );
    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerConfig.groupId,
    ).toEqual('my-group');
    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerSubscribeTopics.topics,
    ).toEqual(['topic-A']);

    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerConfig.sessionTimeout,
    ).toBe(20000);
    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerConfig.rebalanceTimeout,
    ).toBe(50000);
    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerConfig
        .heartbeatInterval,
    ).toBe(2000);
    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerConfig.metadataMaxAge,
    ).toBe(400000);
    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerConfig
        .maxBytesPerPartition,
    ).toBe(50000);
    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerConfig.minBytes,
    ).toBe(2);
    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerConfig.maxBytes,
    ).toBe(500000);
    expect(
      publisherConfigs?.kafkaConsumerConfigs[0].consumerConfig.maxWaitTimeInMs,
    ).toBe(4000);
  });

  it('should handle HumanDuration and string values for durations and timeouts', () => {
    const config = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaConsumingEventPublisher: {
              clientId: 'backstage-events',
              brokers: ['kafka1:9092', 'kafka2:9092'],
              retry: {
                maxRetryTime: { seconds: 1 },
                initialRetryTime: { minutes: 1 },
                factor: 0.4,
                multiplier: 4,
                retries: 10,
              },
              authenticationTimeout: { hours: 1 },
              connectionTimeout: { days: 1 },
              topics: [],
              requestTimeout: '1m',
            },
          },
        },
      },
    });

    const publisherConfigs = readConfig(config);

    expect(publisherConfigs).toBeDefined();

    // Client configuration
    expect(publisherConfigs?.kafkaConfig.clientId).toEqual('backstage-events');
    expect(publisherConfigs?.kafkaConfig.brokers).toEqual([
      'kafka1:9092',
      'kafka2:9092',
    ]);
    expect(publisherConfigs?.kafkaConfig.authenticationTimeout).toBe(3600000);
    expect(publisherConfigs?.kafkaConfig.connectionTimeout).toBe(86400000);
    expect(publisherConfigs?.kafkaConfig.requestTimeout).toBe(60000);
    expect(publisherConfigs?.kafkaConfig.retry).toStrictEqual({
      maxRetryTime: 1000,
      initialRetryTime: 60000,
      factor: 0.4,
      multiplier: 4,
      retries: 10,
    });

    // Consumer configuration
    expect(publisherConfigs?.kafkaConsumerConfigs.length).toBe(0);
  });
});

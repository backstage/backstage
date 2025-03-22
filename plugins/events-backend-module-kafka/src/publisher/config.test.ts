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
    const config = new ConfigReader({});

    expect(() => {
      readConfig(config);
    }).toThrow();
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

    expect(publisherConfigs.kafkaConsumerConfig.length).toBe(2);

    expect(publisherConfigs.kafkaConfig.clientId).toEqual('backstage-events');
    expect(publisherConfigs.kafkaConfig.brokers).toEqual([
      'kafka1:9092',
      'kafka2:9092',
    ]);
    expect(publisherConfigs.kafkaConsumerConfig[0].backstageTopic).toEqual(
      'fake1',
    );
    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerConfig.groupId,
    ).toEqual('my-group');
    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerSubscribeConfig.topics,
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
                maxRetryTime: '20000',
                initialRetryTime: '200',
                factor: '0.4',
                multiplier: '4',
                retries: '10',
              },
              authenticationTimeout: 20000,
              connectionTimeout: 1500,
              requestTimeout: 20000,
              enforceRequestTimeout: false,
              topics: [
                {
                  topic: 'fake1',
                  kafka: {
                    topics: ['topic-A'],
                    groupId: 'my-group',
                    sessionTimeout: 20000,
                    rebalanceTimeout: 50000,
                    heartbeatInterval: 2000,
                    metadataMaxAge: 400000,
                    maxBytesPerPartition: 50000,
                    minBytes: 2,
                    maxBytes: 500000,
                    maxWaitTimeInMs: 4000,
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

    // Client configuration
    expect(publisherConfigs.kafkaConfig.clientId).toEqual('backstage-events');
    expect(publisherConfigs.kafkaConfig.brokers).toEqual([
      'kafka1:9092',
      'kafka2:9092',
    ]);
    expect(publisherConfigs.kafkaConfig.ssl).toBeTruthy();
    expect(publisherConfigs.kafkaConfig.sasl).toStrictEqual({
      mechanism: 'plain',
      username: 'username',
      password: 'password',
    });
    expect(publisherConfigs.kafkaConfig.authenticationTimeout).toBe(20000);
    expect(publisherConfigs.kafkaConfig.connectionTimeout).toBe(1500);
    expect(publisherConfigs.kafkaConfig.requestTimeout).toBe(20000);
    expect(publisherConfigs.kafkaConfig.enforceRequestTimeout).toBeFalsy();
    expect(publisherConfigs.kafkaConfig.retry).toStrictEqual({
      maxRetryTime: '20000',
      initialRetryTime: '200',
      factor: '0.4',
      multiplier: '4',
      retries: '10',
    });

    // Consumer configuration
    expect(publisherConfigs.kafkaConsumerConfig.length).toBe(2);
    expect(publisherConfigs.kafkaConsumerConfig[0].backstageTopic).toEqual(
      'fake1',
    );
    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerConfig.groupId,
    ).toEqual('my-group');
    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerSubscribeConfig.topics,
    ).toEqual(['topic-A']);

    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerConfig.sessionTimeout,
    ).toBe(20000);
    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerConfig.rebalanceTimeout,
    ).toBe(50000);
    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerConfig.heartbeatInterval,
    ).toBe(2000);
    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerConfig.metadataMaxAge,
    ).toBe(400000);
    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerConfig
        .maxBytesPerPartition,
    ).toBe(50000);
    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerConfig.minBytes,
    ).toBe(2);
    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerConfig.maxBytes,
    ).toBe(500000);
    expect(
      publisherConfigs.kafkaConsumerConfig[0].consumerConfig.maxWaitTimeInMs,
    ).toBe(4000);
  });
});

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
import { readConsumerConfig } from './config';
import { mockServices } from '@backstage/backend-test-utils';

const mockLogger = mockServices.logger.mock();

describe('readConsumerConfig', () => {
  it('not configured', () => {
    const publisherConfigs = readConsumerConfig(
      new ConfigReader({}),
      mockLogger,
    );

    expect(publisherConfigs).toEqual([]);
  });

  it('only required fields configured', () => {
    const config = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaConsumingEventPublisher: {
              dev: {
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
      },
    });

    const publisherConfigs = readConsumerConfig(config, mockLogger);

    expect(publisherConfigs).toBeDefined();
    expect(Array.isArray(publisherConfigs)).toBe(true);
    expect(publisherConfigs).toHaveLength(1);

    const devConfig = publisherConfigs[0];
    expect(devConfig.instance).toBe('dev');
    expect(devConfig.kafkaConsumerConfigs.length).toBe(2);

    expect(devConfig.kafkaConfig.clientId).toEqual('backstage-events');
    expect(devConfig.kafkaConfig.brokers).toEqual([
      'kafka1:9092',
      'kafka2:9092',
    ]);

    expect(devConfig.kafkaConsumerConfigs).toEqual([
      {
        backstageTopic: 'fake1',
        consumerConfig: {
          groupId: 'my-group',
        },
        consumerSubscribeTopics: {
          topics: ['topic-A'],
        },
        autoCommit: true,
        pauseOnError: false,
      },
      {
        backstageTopic: 'fake2',
        consumerConfig: {
          groupId: 'my-group',
        },
        consumerSubscribeTopics: {
          topics: ['topic-B'],
        },
        autoCommit: true,
        pauseOnError: false,
      },
    ]);
  });

  it('all fields configured', () => {
    const config = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaConsumingEventPublisher: {
              dev: {
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
      },
    });

    const publisherConfigs = readConsumerConfig(config, mockLogger);

    expect(publisherConfigs).toBeDefined();
    expect(Array.isArray(publisherConfigs)).toBe(true);
    expect(publisherConfigs).toHaveLength(1);

    const devConfig = publisherConfigs[0];
    expect(devConfig.instance).toBe('dev');

    // Client configuration
    expect(devConfig.kafkaConfig.clientId).toEqual('backstage-events');
    expect(devConfig.kafkaConfig.brokers).toEqual([
      'kafka1:9092',
      'kafka2:9092',
    ]);
    expect(devConfig.kafkaConfig.ssl).toBeTruthy();
    expect(devConfig.kafkaConfig.sasl).toStrictEqual({
      mechanism: 'plain',
      username: 'username',
      password: 'password',
    });
    expect(devConfig.kafkaConfig.authenticationTimeout).toBe(20000);
    expect(devConfig.kafkaConfig.connectionTimeout).toBe(1500);
    expect(devConfig.kafkaConfig.requestTimeout).toBe(20000);
    expect(devConfig.kafkaConfig.enforceRequestTimeout).toBeFalsy();
    expect(devConfig.kafkaConfig.retry).toStrictEqual({
      maxRetryTime: 20000,
      initialRetryTime: 200,
      factor: 0.4,
      multiplier: 4,
      retries: 10,
    });

    // Consumer configuration
    expect(devConfig.kafkaConsumerConfigs.length).toBe(2);

    expect(devConfig.kafkaConsumerConfigs).toEqual([
      {
        backstageTopic: 'fake1',
        consumerConfig: {
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
        consumerSubscribeTopics: {
          topics: ['topic-A'],
        },
        autoCommit: true,
        pauseOnError: false,
      },
      {
        backstageTopic: 'fake2',
        consumerConfig: {
          groupId: 'my-group',
        },
        consumerSubscribeTopics: {
          topics: ['topic-B'],
        },
        autoCommit: true,
        pauseOnError: false,
      },
    ]);
  });

  it('should handle HumanDuration and string values for durations and timeouts', () => {
    const config = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaConsumingEventPublisher: {
              dev: {
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
      },
    });

    const publisherConfigs = readConsumerConfig(config, mockLogger);

    expect(publisherConfigs).toBeDefined();
    expect(Array.isArray(publisherConfigs)).toBe(true);
    expect(publisherConfigs).toHaveLength(1);

    const devConfig = publisherConfigs[0];
    expect(devConfig.instance).toBe('dev');

    // Client configuration
    expect(devConfig.kafkaConfig.clientId).toEqual('backstage-events');
    expect(devConfig.kafkaConfig.brokers).toEqual([
      'kafka1:9092',
      'kafka2:9092',
    ]);
    expect(devConfig.kafkaConfig.authenticationTimeout).toBe(3600000);
    expect(devConfig.kafkaConfig.connectionTimeout).toBe(86400000);
    expect(devConfig.kafkaConfig.requestTimeout).toBe(60000);
    expect(devConfig.kafkaConfig.retry).toStrictEqual({
      maxRetryTime: 1000,
      initialRetryTime: 60000,
      factor: 0.4,
      multiplier: 4,
      retries: 10,
    });

    // Consumer configuration
    expect(devConfig.kafkaConsumerConfigs.length).toBe(0);
  });

  it('single instance configuration (legacy format)', () => {
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

    const publisherConfigs = readConsumerConfig(config, mockLogger);

    expect(publisherConfigs).toBeDefined();
    expect(Array.isArray(publisherConfigs)).toBe(true);
    expect(publisherConfigs).toHaveLength(1);

    const defaultConfig = publisherConfigs[0];
    expect(defaultConfig.instance).toBe('default');
    expect(defaultConfig.kafkaConsumerConfigs.length).toBe(2);

    expect(defaultConfig.kafkaConfig.clientId).toEqual('backstage-events');
    expect(defaultConfig.kafkaConfig.brokers).toEqual([
      'kafka1:9092',
      'kafka2:9092',
    ]);

    expect(defaultConfig.kafkaConsumerConfigs).toEqual([
      {
        backstageTopic: 'fake1',
        consumerConfig: {
          groupId: 'my-group',
        },
        consumerSubscribeTopics: {
          topics: ['topic-A'],
        },
        autoCommit: true,
        pauseOnError: false,
      },
      {
        backstageTopic: 'fake2',
        consumerConfig: {
          groupId: 'my-group',
        },
        consumerSubscribeTopics: {
          topics: ['topic-B'],
        },
        autoCommit: true,
        pauseOnError: false,
      },
    ]);

    // Verify deprecation warning was logged
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Legacy single config format detected at events.modules.kafka.kafkaConsumingEventPublisher.',
    );
  });

  it('offset management fields (autoCommit, pauseOnError, fromBeginning)', () => {
    const config = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaConsumingEventPublisher: {
              dev: {
                clientId: 'backstage-events',
                brokers: ['kafka1:9092'],
                topics: [
                  {
                    topic: 'fake1',
                    kafka: {
                      topics: ['topic-A'],
                      groupId: 'my-group',
                      autoCommit: false,
                      pauseOnError: true,
                      fromBeginning: true,
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });

    const publisherConfigs = readConsumerConfig(config, mockLogger);

    expect(publisherConfigs).toBeDefined();
    expect(publisherConfigs).toHaveLength(1);

    const devConfig = publisherConfigs[0];
    expect(devConfig.kafkaConsumerConfigs).toEqual([
      {
        backstageTopic: 'fake1',
        consumerConfig: {
          groupId: 'my-group',
        },
        consumerSubscribeTopics: {
          topics: ['topic-A'],
          fromBeginning: true,
        },
        autoCommit: false,
        pauseOnError: true,
      },
    ]);
  });
});

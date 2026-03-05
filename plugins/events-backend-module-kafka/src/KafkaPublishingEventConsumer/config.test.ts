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
import { readPublisherConfig } from './config';

describe('readPublisherConfig', () => {
  it('not configured', () => {
    const publisherConfigs = readPublisherConfig(new ConfigReader({}));

    expect(publisherConfigs).toEqual([]);
  });

  it('only required fields configured', () => {
    const config = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaPublishingEventConsumer: {
              dev: {
                clientId: 'backstage-events',
                brokers: ['kafka1:9092', 'kafka2:9092'],
                topics: [
                  {
                    topic: 'fake1',
                    kafka: {
                      topic: 'topic-A',
                    },
                  },
                  {
                    topic: 'fake2',
                    kafka: {
                      topic: 'topic-B',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });

    const publisherConfigs = readPublisherConfig(config);

    expect(publisherConfigs).toBeDefined();
    expect(Array.isArray(publisherConfigs)).toBe(true);
    expect(publisherConfigs).toHaveLength(1);

    const devConfig = publisherConfigs[0];
    expect(devConfig.instance).toBe('dev');
    expect(devConfig.kafkaPublisherConfigs.length).toBe(2);

    expect(devConfig.kafkaConfig.clientId).toEqual('backstage-events');
    expect(devConfig.kafkaConfig.brokers).toEqual([
      'kafka1:9092',
      'kafka2:9092',
    ]);

    expect(devConfig.kafkaPublisherConfigs).toEqual([
      {
        backstageTopic: 'fake1',
        kafkaTopic: 'topic-A',
        producerConfig: {
          allowAutoTopicCreation: undefined,
          metadataMaxAge: undefined,
          transactionTimeout: undefined,
          idempotent: undefined,
          maxInFlightRequests: undefined,
          retry: {},
        },
      },
      {
        backstageTopic: 'fake2',
        kafkaTopic: 'topic-B',
        producerConfig: {
          allowAutoTopicCreation: undefined,
          metadataMaxAge: undefined,
          transactionTimeout: undefined,
          idempotent: undefined,
          maxInFlightRequests: undefined,
          retry: {},
        },
      },
    ]);
  });

  it('all fields configured', () => {
    const config = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaPublishingEventConsumer: {
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
                      topic: 'topic-A',
                      allowAutoTopicCreation: true,
                      metadataMaxAge: { milliseconds: 400000 },
                      transactionTimeout: { milliseconds: 30000 },
                      idempotent: true,
                      maxInFlightRequests: 5,
                      retry: {
                        maxRetryTime: { milliseconds: 15000 },
                        initialRetryTime: { milliseconds: 100 },
                        factor: '0.2',
                        multiplier: '2',
                        retries: '5',
                      },
                    },
                  },
                  {
                    topic: 'fake2',
                    kafka: {
                      topic: 'topic-B',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });

    const publisherConfigs = readPublisherConfig(config);

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

    // Publisher configuration
    expect(devConfig.kafkaPublisherConfigs.length).toBe(2);

    expect(devConfig.kafkaPublisherConfigs).toEqual([
      {
        backstageTopic: 'fake1',
        kafkaTopic: 'topic-A',
        producerConfig: {
          allowAutoTopicCreation: true,
          metadataMaxAge: 400000,
          transactionTimeout: 30000,
          idempotent: true,
          maxInFlightRequests: 5,
          retry: {
            maxRetryTime: 15000,
            initialRetryTime: 100,
            factor: 0.2,
            multiplier: 2,
            retries: 5,
          },
        },
      },
      {
        backstageTopic: 'fake2',
        kafkaTopic: 'topic-B',
        producerConfig: {
          allowAutoTopicCreation: undefined,
          metadataMaxAge: undefined,
          transactionTimeout: undefined,
          idempotent: undefined,
          maxInFlightRequests: undefined,
          retry: {},
        },
      },
    ]);
  });

  it('should handle HumanDuration and string values for durations and timeouts', () => {
    const config = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaPublishingEventConsumer: {
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
                topics: [
                  {
                    topic: 'fake1',
                    kafka: {
                      topic: 'topic-A',
                      metadataMaxAge: { seconds: 300 },
                      transactionTimeout: '30s',
                    },
                  },
                ],
                requestTimeout: '1m',
              },
            },
          },
        },
      },
    });

    const publisherConfigs = readPublisherConfig(config);

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

    // Publisher configuration
    expect(devConfig.kafkaPublisherConfigs.length).toBe(1);
    expect(
      devConfig.kafkaPublisherConfigs[0].producerConfig.metadataMaxAge,
    ).toBe(300000);
    expect(
      devConfig.kafkaPublisherConfigs[0].producerConfig.transactionTimeout,
    ).toBe(30000);
  });

  it('should handle multiple instances', () => {
    const config = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaPublishingEventConsumer: {
              dev: {
                clientId: 'backstage-dev',
                brokers: ['kafka-dev:9092'],
                topics: [
                  {
                    topic: 'dev-topic',
                    kafka: {
                      topic: 'kafka-dev-topic',
                    },
                  },
                ],
              },
              prod: {
                clientId: 'backstage-prod',
                brokers: ['kafka-prod1:9092', 'kafka-prod2:9092'],
                topics: [
                  {
                    topic: 'prod-topic',
                    kafka: {
                      topic: 'kafka-prod-topic',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });

    const publisherConfigs = readPublisherConfig(config);

    expect(publisherConfigs).toBeDefined();
    expect(Array.isArray(publisherConfigs)).toBe(true);
    expect(publisherConfigs).toHaveLength(2);

    const devConfig = publisherConfigs.find(c => c.instance === 'dev')!;
    expect(devConfig.kafkaConfig.clientId).toBe('backstage-dev');
    expect(devConfig.kafkaConfig.brokers).toEqual(['kafka-dev:9092']);
    expect(devConfig.kafkaPublisherConfigs).toHaveLength(1);
    expect(devConfig.kafkaPublisherConfigs[0].backstageTopic).toBe('dev-topic');

    const prodConfig = publisherConfigs.find(c => c.instance === 'prod')!;
    expect(prodConfig.kafkaConfig.clientId).toBe('backstage-prod');
    expect(prodConfig.kafkaConfig.brokers).toEqual([
      'kafka-prod1:9092',
      'kafka-prod2:9092',
    ]);
    expect(prodConfig.kafkaPublisherConfigs).toHaveLength(1);
    expect(prodConfig.kafkaPublisherConfigs[0].backstageTopic).toBe(
      'prod-topic',
    );
  });
});

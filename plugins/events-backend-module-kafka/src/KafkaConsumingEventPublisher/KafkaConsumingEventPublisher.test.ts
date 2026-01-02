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
import { KafkaConsumingEventPublisher } from './KafkaConsumingEventPublisher';
import { Kafka } from 'kafkajs';
import { ConfigReader } from '@backstage/config';
import { mockServices } from '@backstage/backend-test-utils';

jest.mock('kafkajs');

describe('KafkaConsumingEventPublisher', () => {
  const mockLogger = mockServices.logger.mock();
  const mockEvents = mockServices.events.mock();

  const mockConsumer = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribe: jest.fn(),
    run: jest.fn(),
  };

  const mockKafkaClient = {
    consumer: jest.fn().mockReturnValue(mockConsumer),
  } as unknown as Kafka;

  jest.mocked(Kafka).mockImplementation(() => mockKafkaClient);

  const mockConfig = new ConfigReader({
    events: {
      modules: {
        kafka: {
          kafkaConsumingEventPublisher: {
            dev: {
              clientId: 'backstage-events',
              brokers: ['kafka1:9092', 'kafka2:9092'],
              topics: [
                {
                  topic: 'backstage-topic',
                  kafka: {
                    topics: ['test-topic'],
                    groupId: 'test-group',
                  },
                },
              ],
            },
          },
        },
      },
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create instances from config', () => {
    const consumers = KafkaConsumingEventPublisher.fromConfig({
      config: mockConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    expect(consumers).toBeInstanceOf(Array);
    expect(consumers).toHaveLength(1);
    expect(consumers[0]).toBeInstanceOf(KafkaConsumingEventPublisher);
  });

  it('should return empty array when no config', () => {
    const consumers = KafkaConsumingEventPublisher.fromConfig({
      config: new ConfigReader({}),
      events: mockEvents,
      logger: mockLogger,
    });

    expect(consumers).toEqual([]);
  });

  it('should start all consumers', async () => {
    const consumers = KafkaConsumingEventPublisher.fromConfig({
      config: mockConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    expect(consumers).toHaveLength(1);

    await consumers[0].start();

    expect(mockConsumer.connect).toHaveBeenCalled();
    expect(mockConsumer.subscribe).toHaveBeenCalledWith({
      topics: ['test-topic'],
    });
    expect(mockConsumer.run).toHaveBeenCalled();
  });

  it('should shutdown all consumers', async () => {
    const consumers = KafkaConsumingEventPublisher.fromConfig({
      config: mockConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    expect(consumers).toHaveLength(1);

    await consumers[0].shutdown();

    expect(mockConsumer.disconnect).toHaveBeenCalled();
  });

  it('should handle multiple consumer configs', () => {
    const multiConsumerConfig = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaConsumingEventPublisher: {
              dev: {
                clientId: 'backstage-events',
                brokers: ['kafka1:9092'],
                topics: [
                  {
                    topic: 'topic1',
                    kafka: {
                      topics: ['kafka-topic-1'],
                      groupId: 'group1',
                    },
                  },
                  {
                    topic: 'topic2',
                    kafka: {
                      topics: ['kafka-topic-2'],
                      groupId: 'group2',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });

    const consumers = KafkaConsumingEventPublisher.fromConfig({
      config: multiConsumerConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    expect(consumers).toHaveLength(1);
    expect(mockKafkaClient.consumer).toHaveBeenCalledTimes(2);
  });
});

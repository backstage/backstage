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
    commitOffsets: jest.fn(),
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

  describe('Offset Management', () => {
    it('should commit offset after successful message processing when autoCommit is false', async () => {
      const configWithManualCommit = new ConfigReader({
        events: {
          modules: {
            kafka: {
              kafkaConsumingEventPublisher: {
                dev: {
                  clientId: 'backstage-events',
                  brokers: ['kafka1:9092'],
                  topics: [
                    {
                      topic: 'backstage-topic',
                      kafka: {
                        topics: ['test-topic'],
                        groupId: 'test-group',
                        autoCommit: false,
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
        config: configWithManualCommit,
        events: mockEvents,
        logger: mockLogger,
      });

      mockConsumer.run.mockImplementation(async ({ eachMessage }: any) => {
        await eachMessage({
          topic: 'test-kafka-topic',
          partition: 2,
          message: {
            key: Buffer.from('test-key'),
            value: Buffer.from(JSON.stringify({ data: 'test-data' })),
            offset: '12345',
            timestamp: '1234567890',
            headers: {
              'custom-header': Buffer.from('header-value'),
            },
          },
          heartbeat: jest.fn(),
          pause: jest.fn(),
        });
      });

      await consumers[0].start();

      expect(mockEvents.publish).toHaveBeenCalledWith({
        topic: 'backstage-topic',
        eventPayload: { data: 'test-data' },
        metadata: {
          'custom-header': 'header-value',
        },
      });

      // Verify offset + 1
      expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
        { topic: 'test-kafka-topic', partition: 2, offset: '12346' },
      ]);
    });

    it('should not commit offset when autoCommit is true (default)', async () => {
      const configWithAutoCommit = new ConfigReader({
        events: {
          modules: {
            kafka: {
              kafkaConsumingEventPublisher: {
                dev: {
                  clientId: 'backstage-events',
                  brokers: ['kafka1:9092'],
                  topics: [
                    {
                      topic: 'backstage-topic',
                      kafka: {
                        topics: ['test-topic'],
                        groupId: 'test-group',
                        autoCommit: true,
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
        config: configWithAutoCommit,
        events: mockEvents,
        logger: mockLogger,
      });

      mockConsumer.run.mockImplementation(async ({ eachMessage }: any) => {
        await eachMessage({
          topic: 'test-kafka-topic',
          partition: 2,
          message: {
            value: Buffer.from(JSON.stringify({ data: 'test-data' })),
            offset: '12345',
          },
          heartbeat: jest.fn(),
          pause: jest.fn(),
        });
      });

      await consumers[0].start();

      expect(mockEvents.publish).toHaveBeenCalled();
      expect(mockConsumer.commitOffsets).not.toHaveBeenCalled();
    });

    it('should not commit offset when message processing fails and pauseOnError is true', async () => {
      const pauseMock = jest.fn();
      const failingEvents = {
        ...mockEvents,
        publish: jest.fn().mockRejectedValue(new Error('Processing failed')),
      };

      const configWithPauseOnError = new ConfigReader({
        events: {
          modules: {
            kafka: {
              kafkaConsumingEventPublisher: {
                dev: {
                  clientId: 'backstage-events',
                  brokers: ['kafka1:9092'],
                  topics: [
                    {
                      topic: 'backstage-topic',
                      kafka: {
                        topics: ['test-topic'],
                        groupId: 'test-group',
                        autoCommit: false,
                        pauseOnError: true,
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
        config: configWithPauseOnError,
        events: failingEvents,
        logger: mockLogger,
      });

      mockConsumer.run.mockImplementation(async ({ eachMessage }: any) => {
        await expect(
          eachMessage({
            topic: 'test-kafka-topic',
            partition: 2,
            message: {
              value: Buffer.from(JSON.stringify({ data: 'test-data' })),
              offset: '12345',
            },
            heartbeat: jest.fn(),
            pause: pauseMock,
          }),
        ).rejects.toThrow('Processing failed');
      });

      await consumers[0].start();

      expect(mockConsumer.commitOffsets).not.toHaveBeenCalled();
      expect(pauseMock).toHaveBeenCalled();
    });

    it('should skip failed message and commit offset when pauseOnError is false and autoCommit is false', async () => {
      const pauseMock = jest.fn();
      const failingEvents = {
        ...mockEvents,
        publish: jest.fn().mockRejectedValue(new Error('Processing failed')),
      };

      const configWithSkipOnError = new ConfigReader({
        events: {
          modules: {
            kafka: {
              kafkaConsumingEventPublisher: {
                dev: {
                  clientId: 'backstage-events',
                  brokers: ['kafka1:9092'],
                  topics: [
                    {
                      topic: 'backstage-topic',
                      kafka: {
                        topics: ['test-topic'],
                        groupId: 'test-group',
                        autoCommit: false,
                        pauseOnError: false,
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
        config: configWithSkipOnError,
        events: failingEvents,
        logger: mockLogger,
      });

      mockConsumer.run.mockImplementation(async ({ eachMessage }: any) => {
        await eachMessage({
          topic: 'test-kafka-topic',
          partition: 2,
          message: {
            value: Buffer.from(JSON.stringify({ data: 'test-data' })),
            offset: '12345',
          },
          heartbeat: jest.fn(),
          pause: pauseMock,
        });
      });

      await consumers[0].start();

      // Should commit offset to skip the failed message
      expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
        { topic: 'test-kafka-topic', partition: 2, offset: '12346' },
      ]);
      expect(pauseMock).not.toHaveBeenCalled();
    });

    it('should skip failed message without committing when pauseOnError is false and autoCommit is true', async () => {
      const pauseMock = jest.fn();
      const failingEvents = {
        ...mockEvents,
        publish: jest.fn().mockRejectedValue(new Error('Processing failed')),
      };

      const configWithAutoCommitSkipOnError = new ConfigReader({
        events: {
          modules: {
            kafka: {
              kafkaConsumingEventPublisher: {
                dev: {
                  clientId: 'backstage-events',
                  brokers: ['kafka1:9092'],
                  topics: [
                    {
                      topic: 'backstage-topic',
                      kafka: {
                        topics: ['test-topic'],
                        groupId: 'test-group',
                        autoCommit: true,
                        pauseOnError: false,
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
        config: configWithAutoCommitSkipOnError,
        events: failingEvents,
        logger: mockLogger,
      });

      mockConsumer.run.mockImplementation(async ({ eachMessage }: any) => {
        await eachMessage({
          topic: 'test-kafka-topic',
          partition: 2,
          message: {
            value: Buffer.from(JSON.stringify({ data: 'test-data' })),
            offset: '12345',
          },
          heartbeat: jest.fn(),
          pause: pauseMock,
        });
      });

      await consumers[0].start();

      // Should not commit offset (autoCommit handles it)
      expect(mockConsumer.commitOffsets).not.toHaveBeenCalled();
      expect(pauseMock).not.toHaveBeenCalled();
    });

    it('should pass autoCommit setting to consumer.run()', async () => {
      const configWithManualCommit = new ConfigReader({
        events: {
          modules: {
            kafka: {
              kafkaConsumingEventPublisher: {
                dev: {
                  clientId: 'backstage-events',
                  brokers: ['kafka1:9092'],
                  topics: [
                    {
                      topic: 'backstage-topic',
                      kafka: {
                        topics: ['test-topic'],
                        groupId: 'test-group',
                        autoCommit: false,
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
        config: configWithManualCommit,
        events: mockEvents,
        logger: mockLogger,
      });

      await consumers[0].start();

      expect(mockConsumer.run).toHaveBeenCalledWith(
        expect.objectContaining({
          autoCommit: false,
        }),
      );
    });
  });
});

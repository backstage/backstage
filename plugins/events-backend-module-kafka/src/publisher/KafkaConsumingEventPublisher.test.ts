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
import { KafkaConsumerConfig } from './config';
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

  const kafkaConsumerConfig: KafkaConsumerConfig = {
    consumerConfig: {
      groupId: 'test-group',
    },
    consumerSubscribeTopics: {
      topics: ['test-topic'],
    },
    backstageTopic: 'backstage-topic',
    autoCommit: true,
    pauseOnError: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance from config', () => {
    const consumer = KafkaConsumingEventPublisher.fromConfig({
      kafkaClient: mockKafkaClient,
      config: kafkaConsumerConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    expect(consumer).toBeInstanceOf(KafkaConsumingEventPublisher);
  });

  it('should start the consumer', async () => {
    const consumer = KafkaConsumingEventPublisher.fromConfig({
      kafkaClient: mockKafkaClient,
      config: kafkaConsumerConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    await consumer.start();

    expect(mockConsumer.connect).toHaveBeenCalled();
    expect(mockConsumer.subscribe).toHaveBeenCalledWith(
      kafkaConsumerConfig.consumerSubscribeTopics,
    );
    expect(mockConsumer.run).toHaveBeenCalled();
  });

  it('should shutdown the consumer', async () => {
    const consumer = KafkaConsumingEventPublisher.fromConfig({
      kafkaClient: mockKafkaClient,
      config: kafkaConsumerConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    await consumer.shutdown();

    expect(mockConsumer.disconnect).toHaveBeenCalled();
  });

  it('should commit offset after successful message processing when autoCommit is false', async () => {
    mockConsumer.commitOffsets = jest.fn();

    const consumer = KafkaConsumingEventPublisher.fromConfig({
      kafkaClient: mockKafkaClient,
      config: {
        ...kafkaConsumerConfig,
        autoCommit: false,
      },
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

    await consumer.start();

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

  it('should not commit offset when autoCommit is not specified (default behavior)', async () => {
    mockConsumer.commitOffsets = jest.fn();

    const consumer = KafkaConsumingEventPublisher.fromConfig({
      kafkaClient: mockKafkaClient,
      config: kafkaConsumerConfig,
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

    await consumer.start();

    expect(mockEvents.publish).toHaveBeenCalled();
    expect(mockConsumer.commitOffsets).not.toHaveBeenCalled();
  });

  it('should not commit offset when autoCommit is explicitly true', async () => {
    mockConsumer.commitOffsets = jest.fn();

    const consumer = KafkaConsumingEventPublisher.fromConfig({
      kafkaClient: mockKafkaClient,
      config: {
        ...kafkaConsumerConfig,
        autoCommit: true,
      },
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

    await consumer.start();

    expect(mockEvents.publish).toHaveBeenCalled();
    expect(mockConsumer.commitOffsets).not.toHaveBeenCalled();
  });

  it('should not commit offset when message processing fails and pauseOnError is true', async () => {
    mockConsumer.commitOffsets = jest.fn();
    const pauseMock = jest.fn();

    const failingEvents = {
      ...mockEvents,
      publish: jest.fn().mockRejectedValue(new Error('Processing failed')),
    };

    const consumer = KafkaConsumingEventPublisher.fromConfig({
      kafkaClient: mockKafkaClient,
      config: {
        ...kafkaConsumerConfig,
        autoCommit: false,
        pauseOnError: true,
      },
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

    await consumer.start();

    expect(mockConsumer.commitOffsets).not.toHaveBeenCalled();
    expect(pauseMock).toHaveBeenCalled();
  });

  it('should skip failed message and commit offset when pauseOnError is not specified (default) and autoCommit is false', async () => {
    mockConsumer.commitOffsets = jest.fn();
    const pauseMock = jest.fn();

    const failingEvents = {
      ...mockEvents,
      publish: jest.fn().mockRejectedValue(new Error('Processing failed')),
    };

    const consumer = KafkaConsumingEventPublisher.fromConfig({
      kafkaClient: mockKafkaClient,
      config: {
        ...kafkaConsumerConfig,
        autoCommit: false,
        // pauseOnError, default to false
      },
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

    await consumer.start();

    // Should commit offset to skip the failed message
    expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
      { topic: 'test-kafka-topic', partition: 2, offset: '12346' },
    ]);
    expect(pauseMock).not.toHaveBeenCalled();
  });

  it('should skip failed message and commit offset when pauseOnError is false and autoCommit is false', async () => {
    mockConsumer.commitOffsets = jest.fn();
    const pauseMock = jest.fn();

    const failingEvents = {
      ...mockEvents,
      publish: jest.fn().mockRejectedValue(new Error('Processing failed')),
    };

    const consumer = KafkaConsumingEventPublisher.fromConfig({
      kafkaClient: mockKafkaClient,
      config: {
        ...kafkaConsumerConfig,
        autoCommit: false,
        pauseOnError: false,
      },
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

    await consumer.start();

    // Should commit offset to skip the failed message
    expect(mockConsumer.commitOffsets).toHaveBeenCalledWith([
      { topic: 'test-kafka-topic', partition: 2, offset: '12346' },
    ]);
    expect(pauseMock).not.toHaveBeenCalled();
  });

  it('should skip failed message without committing when pauseOnError is false and autoCommit is true', async () => {
    mockConsumer.commitOffsets = jest.fn();
    const pauseMock = jest.fn();

    const failingEvents = {
      ...mockEvents,
      publish: jest.fn().mockRejectedValue(new Error('Processing failed')),
    };

    const consumer = KafkaConsumingEventPublisher.fromConfig({
      kafkaClient: mockKafkaClient,
      config: {
        ...kafkaConsumerConfig,
        autoCommit: true,
        pauseOnError: false,
      },
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

    await consumer.start();

    // Should not commit offset (autoCommit handles it)
    expect(mockConsumer.commitOffsets).not.toHaveBeenCalled();
    expect(pauseMock).not.toHaveBeenCalled();
  });

  it('should pause on error when pauseOnError is true', async () => {
    mockConsumer.commitOffsets = jest.fn();
    const pauseMock = jest.fn();

    const failingEvents = {
      ...mockEvents,
      publish: jest.fn().mockRejectedValue(new Error('Processing failed')),
    };

    const consumer = KafkaConsumingEventPublisher.fromConfig({
      kafkaClient: mockKafkaClient,
      config: {
        ...kafkaConsumerConfig,
        autoCommit: false,
        pauseOnError: true,
      },
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

    await consumer.start();

    expect(mockConsumer.commitOffsets).not.toHaveBeenCalled();
    expect(pauseMock).toHaveBeenCalled();
  });
});

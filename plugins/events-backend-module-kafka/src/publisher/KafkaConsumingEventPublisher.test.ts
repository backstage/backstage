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
});

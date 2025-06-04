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
import { KafkaConsumerClient } from './KafkaConsumerClient';
import { ConfigReader } from '@backstage/config';
import { KafkaConsumingEventPublisher } from './KafkaConsumingEventPublisher';
import { mockServices } from '@backstage/backend-test-utils';

jest.mock('kafkajs');
jest.mock('./KafkaConsumingEventPublisher');

describe('KafkaConsumerClient', () => {
  const mockLogger = mockServices.logger.mock();
  const mockEvents = mockServices.events.mock();

  const mockConfig = new ConfigReader({
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance from config', () => {
    const client = KafkaConsumerClient.fromConfig({
      config: mockConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    expect(client).toBeInstanceOf(KafkaConsumerClient);
  });

  it('should not create an instance from config', () => {
    const client = KafkaConsumerClient.fromConfig({
      config: new ConfigReader({}),
      events: mockEvents,
      logger: mockLogger,
    });

    expect(client).toBeUndefined();
  });

  it('should create a consumer for each topic from config', () => {
    KafkaConsumerClient.fromConfig({
      config: mockConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    expect(KafkaConsumingEventPublisher.fromConfig).toHaveBeenCalledTimes(2);
  });

  it('should start all consumers', async () => {
    const mockConsumer = {
      start: jest.fn().mockResolvedValue(undefined),
    };
    (KafkaConsumingEventPublisher.fromConfig as jest.Mock).mockReturnValue(
      mockConsumer,
    );

    const client = KafkaConsumerClient.fromConfig({
      config: mockConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    expect(client).toBeDefined();

    await client?.start();

    expect(mockConsumer.start).toHaveBeenCalled();
  });

  it('should shutdown all consumers', async () => {
    const mockConsumer = {
      shutdown: jest.fn().mockResolvedValue(undefined),
    };
    (KafkaConsumingEventPublisher.fromConfig as jest.Mock).mockReturnValue(
      mockConsumer,
    );

    const client = KafkaConsumerClient.fromConfig({
      config: mockConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    expect(client).toBeDefined();

    await client?.shutdown();

    expect(mockConsumer.shutdown).toHaveBeenCalled();
  });
});

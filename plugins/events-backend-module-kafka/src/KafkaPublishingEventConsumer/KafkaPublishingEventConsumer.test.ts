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
import { KafkaPublishingEventConsumer } from './KafkaPublishingEventConsumer';
import { Kafka } from 'kafkajs';
import { mockServices } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';

jest.mock('kafkajs');

describe('KafkaPublishingEventConsumer', () => {
  const mockLogger = mockServices.logger.mock();
  const mockEvents = mockServices.events.mock();

  const mockProducer = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    send: jest.fn(),
  };

  const mockKafkaClient = {
    producer: jest.fn().mockReturnValue(mockProducer),
  } as unknown as Kafka;

  jest.mocked(Kafka).mockImplementation(() => mockKafkaClient);

  const mockConfig = new ConfigReader({
    events: {
      modules: {
        kafka: {
          kafkaPublishingEventConsumer: {
            dev: {
              clientId: 'backstage-events',
              brokers: ['kafka1:9092'],
              topics: [
                {
                  topic: 'backstage-topic',
                  kafka: {
                    topic: 'kafka-topic',
                    allowAutoTopicCreation: true,
                  },
                  headers: {
                    forward: false,
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
    const consumers = KafkaPublishingEventConsumer.fromConfig({
      config: mockConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    expect(consumers).toHaveLength(1);
    expect(consumers[0]).toBeInstanceOf(KafkaPublishingEventConsumer);
  });

  it('should start the consumer and subscribe to events', async () => {
    const consumers = KafkaPublishingEventConsumer.fromConfig({
      config: mockConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    await consumers[0].start();

    expect(mockProducer.connect).toHaveBeenCalled();
    expect(mockEvents.subscribe).toHaveBeenCalledWith({
      id: 'kafka:publisher:backstage-topic',
      topics: ['backstage-topic'],
      onEvent: expect.any(Function),
    });
  });

  it('should forward headers when enabled and filter authorization by default', async () => {
    const cfg = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaPublishingEventConsumer: {
              dev: {
                clientId: 'backstage-events',
                brokers: ['kafka1:9092'],
                topics: [
                  {
                    topic: 'backstage-topic',
                    kafka: { topic: 'kafka-topic' },
                    headers: { forward: true },
                  },
                ],
              },
            },
          },
        },
      },
    });

    const consumers = KafkaPublishingEventConsumer.fromConfig({
      config: cfg,
      events: mockEvents,
      logger: mockLogger,
    });

    await consumers[0].start();

    // capture onEvent callback
    const subscribeCall = jest.mocked(mockEvents.subscribe).mock.calls[0][0];
    await subscribeCall.onEvent({
      eventPayload: { hello: 'world' },
      metadata: { Authorization: 'Bearer abc', 'trace-id': 'id-123' },
      topic: 'backstage-topic',
    } as any);

    expect(mockProducer.send).toHaveBeenCalledWith({
      topic: 'kafka-topic',
      messages: [
        {
          value: expect.any(Buffer),
          headers: { 'trace-id': 'id-123' },
        },
      ],
    });
  });

  it('should use whitelist when provided', async () => {
    const cfg = new ConfigReader({
      events: {
        modules: {
          kafka: {
            kafkaPublishingEventConsumer: {
              dev: {
                clientId: 'backstage-events',
                brokers: ['kafka1:9092'],
                topics: [
                  {
                    topic: 'backstage-topic',
                    kafka: { topic: 'kafka-topic' },
                    headers: { forward: true, whitelist: ['trace-id'] },
                  },
                ],
              },
            },
          },
        },
      },
    });

    const consumers = KafkaPublishingEventConsumer.fromConfig({
      config: cfg,
      events: mockEvents,
      logger: mockLogger,
    });

    await consumers[0].start();

    const subscribeCall = jest.mocked(mockEvents.subscribe).mock.calls[0][0];
    await subscribeCall.onEvent({
      eventPayload: 'data',
      metadata: { 'trace-id': 'id-123', type: 'UserCreated' },
      topic: 'backstage-topic',
    } as any);

    expect(mockProducer.send).toHaveBeenCalledWith({
      topic: 'kafka-topic',
      messages: [
        {
          value: expect.any(Buffer),
          headers: { 'trace-id': 'id-123' },
        },
      ],
    });
  });

  it('should shutdown the producer', async () => {
    const consumers = KafkaPublishingEventConsumer.fromConfig({
      config: mockConfig,
      events: mockEvents,
      logger: mockLogger,
    });

    await consumers[0].shutdown();

    expect(mockProducer.disconnect).toHaveBeenCalled();
  });
});

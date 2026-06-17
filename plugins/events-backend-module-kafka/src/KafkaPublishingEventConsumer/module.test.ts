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
import { createServiceFactory } from '@backstage/backend-plugin-api';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { TestEventsService } from '@backstage/plugin-events-backend-test-utils';
import { eventsModuleKafkaPublishingEventConsumer } from './module';
import { KafkaPublishingEventConsumer } from './KafkaPublishingEventConsumer';

jest.mock('./KafkaPublishingEventConsumer');

describe('eventsModuleKafkaPublishingEventConsumer', () => {
  it('should be correctly wired and set up', async () => {
    const events = new TestEventsService();
    const eventsServiceFactory = createServiceFactory({
      service: eventsServiceRef,
      deps: {},
      async factory({}) {
        return events;
      },
    });

    const mockKafkaPublishingEventConsumer = {
      start: jest.fn(),
      shutdown: jest.fn(),
    } as unknown as KafkaPublishingEventConsumer;

    jest
      .mocked(KafkaPublishingEventConsumer.fromConfig)
      .mockReturnValue([mockKafkaPublishingEventConsumer]);

    await startTestBackend({
      features: [
        eventsServiceFactory,
        eventsModuleKafkaPublishingEventConsumer,
        mockServices.rootConfig.factory({
          data: {
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
          },
        }),
      ],
    });

    // Verify that the Kafka publishing event consumer was started
    expect(mockKafkaPublishingEventConsumer.start).toHaveBeenCalled();

    // Verify that the shutdown hook was registered (but not called yet)
    expect(mockKafkaPublishingEventConsumer.shutdown).not.toHaveBeenCalled();
  });

  it('should handle empty configuration gracefully', async () => {
    const events = new TestEventsService();
    const eventsServiceFactory = createServiceFactory({
      service: eventsServiceRef,
      deps: {},
      async factory({}) {
        return events;
      },
    });

    jest.mocked(KafkaPublishingEventConsumer.fromConfig).mockReturnValue([]);

    await startTestBackend({
      features: [
        eventsServiceFactory,
        eventsModuleKafkaPublishingEventConsumer,
        mockServices.rootConfig.factory({
          data: {
            events: {
              modules: {
                kafka: {
                  // No kafkaPublishingEventConsumer config
                },
              },
            },
          },
        }),
      ],
    });

    // Verify that fromConfig was called but returned empty array
    expect(KafkaPublishingEventConsumer.fromConfig).toHaveBeenCalled();
  });
});

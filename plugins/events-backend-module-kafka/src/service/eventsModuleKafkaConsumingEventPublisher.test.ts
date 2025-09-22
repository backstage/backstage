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
import { eventsModuleKafkaConsumingEventPublisher } from './eventsModuleKafkaConsumingEventPublisher';
import { KafkaConsumerClient } from '../publisher/KafkaConsumerClient';

jest.mock('../publisher/KafkaConsumerClient');

describe('eventsModuleKafkaConsumingEventPublisher', () => {
  it('should be correctly wired and set up', async () => {
    const events = new TestEventsService();
    const eventsServiceFactory = createServiceFactory({
      service: eventsServiceRef,
      deps: {},
      async factory({}) {
        return events;
      },
    });

    const mockKafkaConsumerClient = {
      start: jest.fn(),
      shutdown: jest.fn(),
    };
    (KafkaConsumerClient.fromConfig as jest.Mock).mockReturnValue(
      mockKafkaConsumerClient,
    );

    await startTestBackend({
      features: [
        eventsServiceFactory,
        eventsModuleKafkaConsumingEventPublisher,
        mockServices.rootConfig.factory({
          data: {
            events: {
              modules: {
                kafka: {
                  kafkaConsumingEventPublisher: {
                    clientId: 'backstage-events',
                    brokers: ['kafka1:9092', 'kafka2:9092'],
                    topics: {
                      fake1: {
                        kafka: {
                          topics: ['topic-A'],
                          groupId: 'my-group',
                        },
                      },
                      fake2: {
                        kafka: {
                          topics: ['topic-B'],
                          groupId: 'my-group',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }),
      ],
    });

    // Verify that the Kafka consumer client was started
    expect(mockKafkaConsumerClient.start).toHaveBeenCalled();

    // Verify that the shutdown hook was registered
    expect(mockKafkaConsumerClient.shutdown).not.toHaveBeenCalled();
  });
});

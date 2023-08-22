/*
 * Copyright 2022 The Backstage Authors
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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import { TestEventBroker } from '@backstage/plugin-events-backend-test-utils';
import { eventsModuleAwsSqsConsumingEventPublisher } from './eventsModuleAwsSqsConsumingEventPublisher';
import { AwsSqsConsumingEventPublisher } from '../publisher/AwsSqsConsumingEventPublisher';

describe('eventsModuleAwsSqsConsumingEventPublisher', () => {
  it('should be correctly wired and set up', async () => {
    let addedPublishers: AwsSqsConsumingEventPublisher[] | undefined;
    const extensionPoint = {
      addPublishers: (publishers: any) => {
        addedPublishers = publishers;
      },
    };

    const scheduler = mockServices.scheduler.mock();

    await startTestBackend({
      extensionPoints: [[eventsExtensionPoint, extensionPoint]],
      features: [
        eventsModuleAwsSqsConsumingEventPublisher(),
        mockServices.rootConfig.factory({
          data: {
            events: {
              modules: {
                awsSqs: {
                  awsSqsConsumingEventPublisher: {
                    topics: {
                      fake1: {
                        queue: {
                          region: 'eu-west-1',
                          url: 'https://fake1.queue.url',
                        },
                      },
                      fake2: {
                        queue: {
                          region: 'us-east-1',
                          url: 'https://fake2.queue.url',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        scheduler.factory,
      ],
    });

    expect(addedPublishers).not.toBeUndefined();
    expect(addedPublishers!.length).toEqual(2);

    const eventBroker = new TestEventBroker();
    await Promise.all(
      addedPublishers!.map(publisher => publisher.setEventBroker(eventBroker)),
    );

    // publisher.connect(..) was causing the polling for events to be scheduled
    expect(scheduler.scheduleTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'events.awsSqs.publisher:fake1' }),
    );
    expect(scheduler.scheduleTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'events.awsSqs.publisher:fake2' }),
    );
  });
});

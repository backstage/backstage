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

import { getVoidLogger } from '@backstage/backend-common';
import { coreServices } from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import { TestEventBroker } from '@backstage/plugin-events-backend-test-utils';
import { awsSqsConsumingEventPublisherEventsModule } from './AwsSqsConsumingEventPublisherEventsModule';
import { AwsSqsConsumingEventPublisher } from '../publisher/AwsSqsConsumingEventPublisher';

describe('awsSqsEventsModule', () => {
  it('should be correctly wired and set up', async () => {
    const config = new ConfigReader({
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
    });

    let addedPublishers: AwsSqsConsumingEventPublisher[] | undefined;
    const extensionPoint = {
      addPublishers: (publishers: any) => {
        addedPublishers = publishers;
      },
    };

    const scheduler = {
      scheduleTask: jest.fn(),
    };

    await startTestBackend({
      extensionPoints: [[eventsExtensionPoint, extensionPoint]],
      services: [
        [coreServices.config, config],
        [coreServices.logger, getVoidLogger()],
        [coreServices.scheduler, scheduler],
      ],
      features: [awsSqsConsumingEventPublisherEventsModule()],
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

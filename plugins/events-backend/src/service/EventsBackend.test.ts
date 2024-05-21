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

import {
  TestEventBroker,
  TestEventPublisher,
  TestEventSubscriber,
} from '@backstage/plugin-events-backend-test-utils';
import { EventsBackend } from './EventsBackend';
import { mockServices } from '@backstage/backend-test-utils';
import { loggerToWinstonLogger } from '@backstage/backend-common';

const logger = mockServices.logger.mock();

describe('EventsBackend', () => {
  it('wires up all components', async () => {
    const eventBroker = new TestEventBroker();
    const publisher1 = new TestEventPublisher();
    const publisher2 = new TestEventPublisher();

    await new EventsBackend(loggerToWinstonLogger(logger))
      .setEventBroker(eventBroker)
      .addPublishers(publisher1, [publisher2])
      .addSubscribers(new TestEventSubscriber('one', ['topicA']), [
        new TestEventSubscriber('two', ['topicA', 'topicB']),
      ])
      .start();

    await eventBroker.publish({
      topic: 'topicA',
      eventPayload: { test: 'payload' },
    });

    expect(eventBroker.published.length).toEqual(1);
    expect(eventBroker.published[0].topic).toEqual('topicA');
    expect(eventBroker.published[0].eventPayload).toEqual({ test: 'payload' });

    expect(eventBroker.subscribed.length).toEqual(2);
    expect(
      eventBroker.subscribed.map(
        sub => (sub as unknown as TestEventSubscriber).name,
      ),
    ).toEqual(['one', 'two']);

    expect(publisher1.eventBroker).toBe(eventBroker);
    expect(publisher2.eventBroker).toBe(eventBroker);
  });
});

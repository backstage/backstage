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

import { DefaultEventsService } from './DefaultEventsService';
import { EventParams } from './EventParams';
import { mockServices } from '@backstage/backend-test-utils';

const logger = mockServices.logger.mock();

describe('DefaultEventsService', () => {
  it('passes events to interested subscribers', async () => {
    const events = DefaultEventsService.create({ logger });
    const eventsSubscriber1: EventParams[] = [];
    const eventsSubscriber2: EventParams[] = [];

    await events.subscribe({
      id: 'subscriber1',
      topics: ['topicA', 'topicB'],
      onEvent: async event => {
        eventsSubscriber1.push(event);
      },
    });
    await events.subscribe({
      id: 'subscriber2',
      topics: ['topicB', 'topicC'],
      onEvent: async event => {
        eventsSubscriber2.push(event);
      },
    });
    await events.publish({
      topic: 'topicA',
      eventPayload: { test: 'topicA' },
    });
    await events.publish({
      topic: 'topicB',
      eventPayload: { test: 'topicB' },
    });
    await events.publish({
      topic: 'topicC',
      eventPayload: { test: 'topicC' },
    });
    await events.publish({
      topic: 'topicD',
      eventPayload: { test: 'topicD' },
    });

    expect(eventsSubscriber1).toEqual([
      { topic: 'topicA', eventPayload: { test: 'topicA' } },
      { topic: 'topicB', eventPayload: { test: 'topicB' } },
    ]);
    expect(eventsSubscriber2).toEqual([
      { topic: 'topicB', eventPayload: { test: 'topicB' } },
      { topic: 'topicC', eventPayload: { test: 'topicC' } },
    ]);
  });

  it('logs errors from subscribers', async () => {
    const topic = 'testTopic';

    const warnSpy = jest.spyOn(logger, 'warn');
    const events = DefaultEventsService.create({ logger });

    await events.subscribe({
      id: 'subscriber1',
      topics: [topic],
      onEvent: event => {
        throw new Error(`NOPE ${event.eventPayload}`);
      },
    });
    await events.publish({ topic, eventPayload: '1' });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      'Subscriber "subscriber1" failed to process event for topic "testTopic"',
      new Error('NOPE 1'),
    );

    await events.subscribe({
      id: 'subscriber2',
      topics: [topic],
      onEvent: event => {
        throw new Error(`NOPE ${event.eventPayload}`);
      },
    });
    await events.publish({ topic, eventPayload: '2' });

    // With two subscribers we should not halt on the first error but call all subscribers
    expect(warnSpy).toHaveBeenCalledTimes(3);
    expect(warnSpy).toHaveBeenCalledWith(
      'Subscriber "subscriber1" failed to process event for topic "testTopic"',
      new Error('NOPE 2'),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      'Subscriber "subscriber2" failed to process event for topic "testTopic"',
      new Error('NOPE 2'),
    );
  });
});

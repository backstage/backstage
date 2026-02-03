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

import { EventParams } from './EventParams';
import { EventRouter } from './EventRouter';
import { EventsService } from './EventsService';

class TestEventRouter extends EventRouter {
  constructor(events: EventsService) {
    super({ events, topics: ['my-topic'] });
  }

  protected getSubscriberId(): string {
    return 'TestEventRouter';
  }

  protected determineDestinationTopic(params: EventParams): string | undefined {
    const payload = params.eventPayload as { value?: number };
    if (payload.value === undefined) {
      return undefined;
    }

    return payload.value % 2 === 0 ? 'even' : 'odd';
  }
}

describe('EventRouter', () => {
  const published: EventParams[] = [];
  const events: EventsService = {
    publish: async event => {
      published.push(event);
    },
    subscribe: async _subscription => {},
  };
  const eventRouter = new TestEventRouter(events);
  const topic = 'my-topic';
  const metadata = { random: 'metadata' };

  it('no destination topic', async () => {
    await eventRouter.onEvent({
      topic,
      eventPayload: { discarded: 'event' },
      metadata,
    });

    expect(published).toEqual([]);
  });

  it('with destination topic', async () => {
    const payloadEven = { value: 2 };
    const payloadOdd = { value: 3 };
    await eventRouter.onEvent({ topic, eventPayload: payloadEven, metadata });
    await eventRouter.onEvent({ topic, eventPayload: payloadOdd, metadata });

    expect(published.length).toBe(2);
    expect(published[0].topic).toEqual('even');
    expect(published[0].eventPayload).toEqual(payloadEven);
    expect(published[0].metadata).toEqual(metadata);
    expect(published[1].topic).toEqual('odd');
    expect(published[1].eventPayload).toEqual(payloadOdd);
    expect(published[1].metadata).toEqual(metadata);
  });
});

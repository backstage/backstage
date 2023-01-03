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

import { EventBroker } from './EventBroker';
import { EventParams } from './EventParams';
import { SubTopicEventRouter } from './SubTopicEventRouter';

class TestSubTopicEventRouter extends SubTopicEventRouter {
  constructor() {
    super('my-topic');
  }

  protected determineSubTopic(params: EventParams): string | undefined {
    return params.metadata?.['x-my-event'] as string | undefined;
  }
}

describe('SubTopicEventRouter', () => {
  const eventRouter = new TestSubTopicEventRouter();
  const topic = 'my-topic';
  const eventPayload = { test: 'payload' };
  const metadata = { 'x-my-event': 'test.type' };

  it('no x-my-event', async () => {
    const published: EventParams[] = [];
    const eventBroker = {
      publish: (params: EventParams) => {
        published.push(params);
      },
    } as EventBroker;
    await eventRouter.setEventBroker(eventBroker);

    await eventRouter.onEvent({ topic, eventPayload });

    expect(published).toEqual([]);
  });

  it('with x-my-event', async () => {
    const published: EventParams[] = [];
    const eventBroker = {
      publish: (params: EventParams) => {
        published.push(params);
      },
    } as EventBroker;
    await eventRouter.setEventBroker(eventBroker);

    await eventRouter.onEvent({ topic, eventPayload, metadata });

    expect(published.length).toBe(1);
    expect(published[0].topic).toEqual('my-topic.test.type');
    expect(published[0].eventPayload).toEqual(eventPayload);
    expect(published[0].metadata).toEqual(metadata);
  });
});

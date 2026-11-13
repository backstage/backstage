/*
 * Copyright 2026 The Backstage Authors
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

import { mockServices, type ServiceMock } from '@backstage/backend-test-utils';
import type { EventsService } from '@backstage/plugin-events-node';
import {
  MICROSOFT_GRAPH_TOPIC,
  TOPIC_MICROSOFT_GRAPH_DELETE,
  TOPIC_MICROSOFT_GRAPH_UPSERT,
} from '../topics';
import { MicrosoftGraphEventRouter } from './MicrosoftGraphEventRouter';

describe('MicrosoftGraphEventRouter', () => {
  const topic = MICROSOFT_GRAPH_TOPIC;

  let events: ServiceMock<EventsService>;
  let logger: ReturnType<typeof mockServices.logger.mock>;

  let router: MicrosoftGraphEventRouter;

  beforeEach(() => {
    jest.clearAllMocks();

    events = mockServices.events.mock();

    logger = mockServices.logger.mock({
      child: jest.fn().mockImplementation(() => logger),
    });

    router = new MicrosoftGraphEventRouter({
      events,
      logger,
    });
  });

  it('subscribes only once', async () => {
    await router.subscribe();
    await router.subscribe();
    expect(events.subscribe).toHaveBeenCalledTimes(1);
    expect(events.subscribe).toHaveBeenCalledWith({
      id: 'MicrosoftGraphEventRouter',
      topics: [MICROSOFT_GRAPH_TOPIC],
      onEvent: expect.any(Function),
    });
  });

  it('does nothing if groupNotifications returns undefined', async () => {
    await router.onEvent({ topic, eventPayload: {} });
    expect(events.publish).not.toHaveBeenCalled();
  });

  it('publishes the grouped notifications to the matching subtopics', async () => {
    const eventPayload = {
      value: [
        { changeType: 'updated', resource: 'users/u1' },
        { changeType: 'updated', resource: 'groups/g1' },
        { changeType: 'deleted', resource: 'users/u2' },
      ],
    };
    events.publish.mockResolvedValue();
    await router.onEvent({ topic, eventPayload });
    expect(events.publish).toHaveBeenNthCalledWith(1, {
      topic: TOPIC_MICROSOFT_GRAPH_UPSERT,
      eventPayload: [
        { changeType: 'updated', resource: 'users/u1' },
        { changeType: 'updated', resource: 'groups/g1' },
      ],
    });
    expect(events.publish).toHaveBeenNthCalledWith(2, {
      topic: TOPIC_MICROSOFT_GRAPH_DELETE,
      eventPayload: [{ changeType: 'deleted', resource: 'users/u2' }],
    });
    expect(events.publish.mock.calls[0][0].eventPayload).toEqual([
      { changeType: 'updated', resource: 'users/u1' },
      { changeType: 'updated', resource: 'groups/g1' },
    ]);
    expect(events.publish.mock.calls[1][0].eventPayload).toEqual([
      { changeType: 'deleted', resource: 'users/u2' },
    ]);
    expect(logger.debug).toHaveBeenCalledWith(
      'Forwarding 2 upsert notifications',
    );
    expect(logger.debug).toHaveBeenCalledWith(
      'Forwarding 1 delete notifications',
    );
  });

  it('propagates error if publish for upsert fails', async () => {
    events.publish.mockRejectedValueOnce(new Error('fail-upsert'));
    await expect(
      router.onEvent({
        topic,
        eventPayload: {
          value: [{ changeType: 'updated', resource: 'users/u1' }],
        },
      }),
    ).rejects.toThrow('fail-upsert');
  });

  it('propagates error if publish for delete fails', async () => {
    events.publish.mockRejectedValueOnce(new Error('fail-delete'));
    await expect(
      router.onEvent({
        topic,
        eventPayload: {
          value: [{ changeType: 'deleted', resource: 'users/u1' }],
        },
      }),
    ).rejects.toThrow('fail-delete');
  });
});

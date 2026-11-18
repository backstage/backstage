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

import { mockServices } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { TestEventsService } from '@backstage/plugin-events-backend-test-utils';
import { GerritScmEventsBridge } from './GerritScmEventsBridge';

function gerritIntegration(host: string) {
  return {
    host,
    baseUrl: `https://${host}/gerrit`,
    gitilesBaseUrl: `https://${host}/gitiles`,
  };
}

describe('GerritScmEventsBridge', () => {
  const logger = mockServices.logger.mock();
  const catalogScmEvents = {
    subscribe: jest.fn(),
    publish: jest.fn(),
    markEventActionTaken: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('publishes catalog SCM events for ref updates', async () => {
    const events = new TestEventsService();
    const bridge = new GerritScmEventsBridge({
      logger,
      config: new ConfigReader({
        integrations: { gerrit: [gerritIntegration('gerrit.example.com')] },
      }),
      events,
      catalogScmEvents,
    });

    await bridge.start();

    expect(events.subscribed).toHaveLength(1);
    const [subscriber] = events.subscribed;
    expect(subscriber.id).toBe('catalog-gerrit-scm-events-bridge');
    expect(subscriber.topics).toEqual(['gerrit']);

    await subscriber.onEvent({
      topic: 'gerrit',
      eventPayload: {
        type: 'ref-updated',
        refUpdate: { project: 'my-project', refName: 'refs/heads/main' },
      },
    });
    await subscriber.onEvent({
      topic: 'gerrit',
      eventPayload: { type: 'change-merged' },
    });

    expect(catalogScmEvents.publish).toHaveBeenCalledTimes(1);
    expect(catalogScmEvents.publish).toHaveBeenCalledWith([
      {
        type: 'repository.updated',
        url: 'https://gerrit.example.com/gitiles/my-project/+/refs/heads/main',
      },
    ]);

    await bridge.stop();
  });

  it('does not subscribe unless exactly one Gerrit integration is configured', async () => {
    const events = new TestEventsService();

    await new GerritScmEventsBridge({
      logger,
      config: new ConfigReader({}),
      events,
      catalogScmEvents,
    }).start();
    expect(logger.warn).not.toHaveBeenCalled();

    await new GerritScmEventsBridge({
      logger,
      config: new ConfigReader({
        integrations: {
          gerrit: [
            gerritIntegration('a.example.com'),
            gerritIntegration('b.example.com'),
          ],
        },
      }),
      events,
      catalogScmEvents,
    }).start();
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('2 Gerrit integrations are configured'),
    );

    expect(events.subscribed).toHaveLength(0);
  });
});

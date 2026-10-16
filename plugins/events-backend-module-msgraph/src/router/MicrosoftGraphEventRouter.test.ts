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

import type {
  BackstageCredentials,
  BackstageServicePrincipal,
} from '@backstage/backend-plugin-api';
import { mockServices, type ServiceMock } from '@backstage/backend-test-utils';
import {
  type CatalogServiceMock,
  catalogServiceMock,
} from '@backstage/plugin-catalog-node/testUtils';
import type { EventsService } from '@backstage/plugin-events-node';
import {
  MICROSOFT_GRAPH_TOPIC,
  TOPIC_MICROSOFT_GRAPH_UPSERT,
  TOPIC_MICROSOFT_GRAPH_DELETE,
} from '../topics';
import { MicrosoftGraphEventRouter } from './MicrosoftGraphEventRouter';
import { parseEvents } from './parseEvents';

jest.mock('./parseEvents');

describe('MicrosoftGraphEventRouter', () => {
  const topic = MICROSOFT_GRAPH_TOPIC;

  let events: ServiceMock<EventsService>;
  let logger: ReturnType<typeof mockServices.logger.mock>;
  let auth: ReturnType<typeof mockServices.auth.mock>;
  let catalog: ServiceMock<CatalogServiceMock>;

  let router: MicrosoftGraphEventRouter;

  beforeEach(() => {
    jest.clearAllMocks();

    events = mockServices.events.mock();

    logger = mockServices.logger.mock({
      child: jest.fn().mockImplementation(() => logger),
    });

    auth = mockServices.auth.mock({
      getOwnServiceCredentials: jest
        .fn()
        .mockResolvedValue(
          'fake-credentials' as unknown as BackstageCredentials<BackstageServicePrincipal>,
        ),
    });

    catalog = catalogServiceMock.mock({
      getEntities: jest.fn().mockResolvedValue({
        items: [
          {
            apiVersion: 'v1',
            kind: 'User',
            metadata: { name: 'u1', namespace: 'default' },
          },
          {
            apiVersion: 'v1',
            kind: 'Group',
            metadata: { name: 'g1', namespace: 'default' },
          },
        ],
      }),
    });

    router = new MicrosoftGraphEventRouter({
      events,
      logger,
      auth,
      catalog,
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

  it('does nothing if parseEvents returns undefined', async () => {
    (parseEvents as jest.Mock).mockReturnValue(undefined);
    await router.onEvent({ topic, eventPayload: {} });
    expect(events.publish).not.toHaveBeenCalled();
  });

  it('publishes upsert events for modified users and groups', async () => {
    (parseEvents as jest.Mock).mockReturnValue({
      upsertedUsers: [{ resourceId: 'u1' }],
      upsertedGroups: [{ resourceId: 'g1' }],
      deletedUsers: [],
      deletedGroups: [],
    });
    events.publish.mockResolvedValue();
    await router.onEvent({ topic, eventPayload: {} });
    expect(events.publish).toHaveBeenCalledWith({
      topic: TOPIC_MICROSOFT_GRAPH_UPSERT,
      eventPayload: [
        { resourceType: 'user', resourceId: 'u1' },
        { resourceType: 'group', resourceId: 'g1' },
      ],
    });
    expect(logger.debug).toHaveBeenCalledWith(
      'Forwarding 1 modified users and 1 modified groups',
    );
  });

  it('publishes delete events for deleted users and groups', async () => {
    (parseEvents as jest.Mock).mockReturnValue({
      upsertedUsers: [],
      upsertedGroups: [],
      deletedUsers: [{ resourceId: 'u1' }],
      deletedGroups: [{ resourceId: 'g1' }],
    });
    events.publish.mockResolvedValue();
    await router.onEvent({ topic, eventPayload: {} });
    expect(auth.getOwnServiceCredentials).toHaveBeenCalled();
    expect(catalog.getEntities).toHaveBeenCalledWith(
      {
        filter: [
          {
            kind: 'Group',
            'metadata.annotations.graph.microsoft.com/group-id': ['g1'],
          },
          {
            kind: 'User',
            'metadata.annotations.graph.microsoft.com/user-id': ['u1'],
          },
        ],
        fields: ['metadata.name', 'kind', 'spec.type'],
      },
      { credentials: expect.anything() },
    );
    expect(events.publish).toHaveBeenCalledWith({
      topic: TOPIC_MICROSOFT_GRAPH_DELETE,
      eventPayload: [
        { entityRef: { kind: 'User', name: 'u1', namespace: 'default' } },
        { entityRef: { kind: 'Group', name: 'g1', namespace: 'default' } },
      ],
    });
    expect(logger.debug).toHaveBeenCalledWith('Forwarding 2 deleted entities');
  });

  it('does not publish delete events if no deleted entity refs', async () => {
    (parseEvents as jest.Mock).mockReturnValue({
      upsertedUsers: [],
      upsertedGroups: [],
      deletedUsers: [{ resourceId: 'u1' }],
      deletedGroups: [],
    });
    catalog.getEntities.mockResolvedValue({ items: [] });
    await router.onEvent({ topic, eventPayload: {} });
    expect(events.publish).not.toHaveBeenCalledWith(
      expect.objectContaining({ topic: TOPIC_MICROSOFT_GRAPH_DELETE }),
    );
  });

  it('logs error if publish for upsert fails', async () => {
    (parseEvents as jest.Mock).mockReturnValue({
      upsertedUsers: [{ resourceId: 'u1' }],
      upsertedGroups: [],
      deletedUsers: [],
      deletedGroups: [],
    });
    events.publish.mockRejectedValueOnce(new Error('fail-upsert'));
    await router.onEvent({ topic, eventPayload: {} });
    // Wait for the catch block to execute
    await new Promise(r => setTimeout(r, 0));
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to publish user/group upsert event'),
      expect.any(Error),
    );
  });

  it('logs error if publish for delete fails', async () => {
    (parseEvents as jest.Mock).mockReturnValue({
      upsertedUsers: [],
      upsertedGroups: [],
      deletedUsers: [{ resourceId: 'u1' }],
      deletedGroups: [],
    });
    // events.publish.mockResolvedValueOnce(undefined); // upsert
    events.publish.mockRejectedValueOnce(new Error('fail-delete'));

    await router.onEvent({ topic, eventPayload: {} });
    // Wait for the catch block to execute
    await new Promise(r => setTimeout(r, 0));
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to publish user/group delete event'),
      expect.any(Error),
    );
  });
});

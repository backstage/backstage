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
import { basename } from 'path';
import { mockServices } from '@backstage/backend-test-utils';
import { ANNOTATION_ORIGIN_LOCATION } from '@backstage/catalog-model';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import {
  EventParams,
  EventsService,
  EventsServiceSubscribeOptions,
} from '@backstage/plugin-events-node';
import waitFor from 'wait-for-expect';
import { HotNewsConsumer } from './HotNewsConsumer';
import { OctokitProvider } from './octokitProviderService';

// TODO(freben): Replace with mockServices.events() when that's released
class MockEventsService implements EventsService {
  #subscribers: EventsServiceSubscribeOptions[];

  constructor() {
    this.#subscribers = [];
  }

  async publish(params: EventParams): Promise<void> {
    for (const subscriber of this.#subscribers) {
      if (subscriber.topics.includes(params.topic)) {
        await subscriber.onEvent(params);
      }
    }
  }

  async subscribe(options: EventsServiceSubscribeOptions): Promise<void> {
    this.#subscribers.push(options);
  }
}

describe('HotNewsConsumer', () => {
  const logger = mockServices.logger.mock();
  const lifecycle = mockServices.lifecycle.mock();
  const auth = mockServices.auth();

  const connection = {
    refresh: jest.fn(),
    applyMutation: jest.fn(),
  } satisfies EntityProviderConnection;

  const octokit = {
    rest: {
      repos: {
        getCommit: jest.fn(),
      },
    },
  };
  const octokitProvider = {
    getOctokit: jest.fn(async () => octokit as any),
  } satisfies OctokitProvider;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('push', () => {
    it('refreshes on changes, unregisters on deletes, for the simple case', async () => {
      const events = new MockEventsService();
      const catalog = catalogServiceMock.mock({
        getLocationByRef: async ref => {
          if (
            ref ===
            'url:https://ghe.spotify.net/hr-disco/disco-web/blob/master/catalog-info-2.yaml'
          ) {
            return {
              id: '123',
              type: ref.split(':')[0],
              target: ref.split(':')[1],
            };
          }
          return undefined;
        },
      });

      const provider = new HotNewsConsumer({
        logger,
        lifecycle,
        auth,
        events,
        catalog,
        octokitProvider,
      });

      await provider.connect(connection);
      await events.publish({
        topic: 'github.push',
        metadata: { 'x-github-event': 'push' },
        eventPayload: require('./__fixtures__/push-event-simple.json'),
      });

      await waitFor(() => {
        expect(connection.refresh).toHaveBeenCalledWith({
          keys: [
            'url:https://ghe.spotify.net/hr-disco/disco-web/tree/master/catalog-info.yaml',
          ],
        });
        expect(catalog.getLocationByRef).toHaveBeenCalledWith(
          'url:https://ghe.spotify.net/hr-disco/disco-web/blob/master/catalog-info-2.yaml',
          expect.anything(),
        );
        expect(catalog.getLocationByRef).toHaveBeenCalledWith(
          'url:https://ghe.spotify.net/hr-disco/disco-web/blob/master/catalog-info-3.yaml',
          expect.anything(),
        );
        expect(catalog.removeLocationById).toHaveBeenCalledWith(
          '123',
          expect.anything(),
        );
        expect(logger.info).toHaveBeenCalledWith(
          'Unregistered location 123 for url:https://ghe.spotify.net/hr-disco/disco-web/blob/master/catalog-info-2.yaml, because commit https://ghe.spotify.net/hr-disco/disco-web/commit/677c191848d92449c3d978becc71a59ea3e9777e deleted the file',
        );
      });
    });

    it('handles complex cases by fetching commits and merging them', async () => {
      const events = new MockEventsService();
      const existedBeforePush = [
        'removed.yaml',
        'removed-then-added.yaml',
        'removed-then-removed.yaml',
        'removed-then-renamed.yaml',
        'removed-then-changed.yaml',
        'renamed-from.yaml',
        'renamed-from-then-added.yaml',
        'renamed-from-then-removed.yaml',
        'renamed-from-then-renamed.yaml',
        'renamed-from-then-changed.yaml',
        'changed.yaml',
        'changed-then-added.yaml',
        'changed-then-removed.yaml',
        'changed-then-renamed.yaml',
        'changed-then-changed.yaml',
      ];
      const catalog = catalogServiceMock.mock({
        getLocations: async () => ({
          items: existedBeforePush.map(name => ({
            id: name,
            type: 'url',
            target: `https://ghe.spotify.net/hr-disco/disco-web/blob/master/${name}`,
          })),
        }),
        getLocationByRef: async ref => {
          return {
            id: basename(ref),
            type: ref.split(':')[0],
            target: ref.split(':')[1],
          };
        },
        getEntities: async () => ({
          items: existedBeforePush.map(name => ({
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Location',
            metadata: {
              annotations: {
                'backstage.io/managed-by-location': `url:https://ghe.spotify.net/hr-disco/disco-web/tree/master/${name}`,
                'backstage.io/managed-by-origin-location': `url:https://ghe.spotify.net/hr-disco/disco-web/blob/master/${name}`,
                'github.com/project-slug': 'hr-disco/disco-web',
              },
              name: `generated-${name}`,
              namespace: 'default',
            },
            spec: {
              type: 'url',
              target: `https://ghe.spotify.net/hr-disco/disco-web/blob/master/${name}`,
            },
          })),
        }),
      });

      octokit.rest.repos.getCommit.mockImplementation(
        async (params: { ref: string }) => {
          if (params.ref === '8e0f23d8853333840f763bd7a87aa17aa6ed4b3d') {
            return {
              data: {
                html_url:
                  'https://ghe.spotify.net/hr-disco/disco-web/commit/8e0f23d8853333840f763bd7a87aa17aa6ed4b3d',
                files: [
                  { filename: 'added.yaml', status: 'added' },
                  { filename: 'added-then-added.yaml', status: 'added' },
                  { filename: 'added-then-removed.yaml', status: 'added' },
                  { filename: 'added-then-renamed.yaml', status: 'added' },
                  { filename: 'added-then-changed.yaml', status: 'added' },
                  { filename: 'removed.yaml', status: 'removed' },
                  { filename: 'removed-then-added.yaml', status: 'removed' },
                  { filename: 'removed-then-removed.yaml', status: 'removed' },
                  { filename: 'removed-then-renamed.yaml', status: 'removed' },
                  { filename: 'removed-then-changed.yaml', status: 'removed' },
                  {
                    filename: 'renamed.yaml',
                    status: 'renamed',
                    previous_filename: 'renamed-from.yaml',
                  },
                  {
                    filename: 'renamed-then-added.yaml',
                    status: 'renamed',
                    previous_filename: 'renamed-from-then-added.yaml',
                  },
                  {
                    filename: 'renamed-then-removed.yaml',
                    status: 'renamed',
                    previous_filename: 'renamed-from-then-removed.yaml',
                  },
                  {
                    filename: 'renamed-then-renamed.yaml',
                    status: 'renamed',
                    previous_filename: 'renamed-from-then-renamed.yaml',
                  },
                  {
                    filename: 'renamed-then-changed.yaml',
                    status: 'renamed',
                    previous_filename: 'renamed-from-then-changed.yaml',
                  },
                  { filename: 'changed.yaml', status: 'changed' },
                  { filename: 'changed-then-added.yaml', status: 'changed' },
                  { filename: 'changed-then-removed.yaml', status: 'changed' },
                  { filename: 'changed-then-renamed.yaml', status: 'changed' },
                  { filename: 'changed-then-changed.yaml', status: 'changed' },
                ],
              },
            };
          } else if (
            params.ref === '677c191848d92449c3d978becc71a59ea3e9777e'
          ) {
            return {
              data: {
                html_url:
                  'https://ghe.spotify.net/hr-disco/disco-web/commit/677c191848d92449c3d978becc71a59ea3e9777e',
                files: [
                  { filename: 'added-then-added.yaml', status: 'added' },
                  { filename: 'added-then-removed.yaml', status: 'removed' },
                  {
                    filename: 'added-then-renamed-to.yaml',
                    status: 'renamed',
                    previous_filename: 'added-then-renamed.yaml',
                  },
                  { filename: 'added-then-changed.yaml', status: 'changed' },
                  { filename: 'removed-then-added.yaml', status: 'added' },
                  { filename: 'removed-then-removed.yaml', status: 'removed' },
                  {
                    filename: 'removed-then-renamed-to.yaml',
                    status: 'renamed',
                    previous_filename: 'removed-then-renamed.yaml',
                  },
                  { filename: 'removed-then-changed.yaml', status: 'changed' },
                  { filename: 'renamed-then-added.yaml', status: 'added' },
                  { filename: 'renamed-then-removed.yaml', status: 'removed' },
                  {
                    filename: 'renamed-then-renamed-to.yaml',
                    status: 'renamed',
                    previous_filename: 'renamed-then-renamed.yaml',
                  },
                  { filename: 'renamed-then-changed.yaml', status: 'changed' },
                  { filename: 'changed-then-added.yaml', status: 'added' },
                  { filename: 'changed-then-removed.yaml', status: 'removed' },
                  {
                    filename: 'changed-then-renamed-to.yaml',
                    status: 'renamed',
                    previous_filename: 'changed-then-renamed.yaml',
                  },
                  { filename: 'changed-then-changed.yaml', status: 'changed' },
                ],
              },
            };
          }
          throw new Error(`Unexpected commit ref: ${params.ref}`);
        },
      );

      const provider = new HotNewsConsumer({
        logger,
        lifecycle,
        auth,
        events,
        catalog,
        octokitProvider,
      });

      await provider.connect(connection);
      await events.publish({
        topic: 'github.push',
        metadata: { 'x-github-event': 'push' },
        eventPayload: require('./__fixtures__/push-event-complex.json'),
      });

      await waitFor(() => {
        expect(octokitProvider.getOctokit).toHaveBeenCalledWith(
          expect.stringContaining('https://ghe.spotify.net/hr-disco/disco-web'),
        );
      });

      const changed = [
        'removed-then-added.yaml',
        'changed.yaml',
        'changed-then-added.yaml',
        'changed-then-changed.yaml',
      ];
      const moved = [
        ['renamed-from.yaml', 'renamed.yaml'],
        ['changed-then-renamed.yaml', 'changed-then-renamed-to.yaml'],
        ['renamed-from-then-added.yaml', 'renamed-then-added.yaml'],
        ['renamed-from-then-renamed.yaml', 'renamed-then-renamed-to.yaml'],
        ['renamed-from-then-changed.yaml', 'renamed-then-changed.yaml'],
      ];
      const removed = [
        // because of removals
        'removed.yaml',
        'removed-then-removed.yaml',
        'renamed-from-then-removed.yaml',
        'changed-then-removed.yaml',
        // as a side effect of a move (remove than add)
        ...moved.map(m => m[0]),
      ];

      await waitFor(() => {
        expect(connection.refresh).toHaveBeenCalledWith({
          keys: changed.map(
            file =>
              `url:https://ghe.spotify.net/hr-disco/disco-web/tree/master/${file}`,
          ),
        });
      });

      expect(
        catalog.removeLocationById.mock.calls.map(call => call[0]).sort(),
      ).toEqual(removed.sort());

      expect(
        catalog.addLocation.mock.calls
          .map(call => basename(call[0].target))
          .sort(),
      ).toEqual(moved.map(m => m[1]).sort());
    });
  });

  describe('repository.deleted', () => {
    it('unregisters', async () => {
      const events = new MockEventsService();
      const catalog = catalogServiceMock.mock({
        getLocations: async () => ({
          items: [
            {
              id: '123',
              type: 'url',
              target:
                'https://ghe.spotify.net/hr-disco/disco-web/blob/master/catalog-info.yaml',
            },
          ],
        }),
      });

      const provider = new HotNewsConsumer({
        logger,
        lifecycle,
        auth,
        events,
        catalog,
        octokitProvider,
      });

      await provider.connect(connection);
      await events.publish({
        topic: 'github.repository',
        metadata: { 'x-github-event': 'repository' },
        eventPayload: require('./__fixtures__/repository-deleted-event.json'),
      });

      await waitFor(() => {
        expect(catalog.getLocations).toHaveBeenCalledWith(
          {},
          { credentials: expect.anything() },
        );
        expect(catalog.removeLocationById).toHaveBeenCalledWith('123', {
          credentials: expect.anything(),
        });
        expect(logger.info).toHaveBeenCalledWith(
          'Unregistered location 123 for url:https://ghe.spotify.net/hr-disco/disco-web/blob/master/catalog-info.yaml, because the repository was deleted',
        );
      });
    });
  });

  describe('repository.archived', () => {
    it('refreshes', async () => {
      const events = new MockEventsService();
      const catalog = catalogServiceMock.mock({
        getEntities: async () => ({
          items: [
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                annotations: {
                  'backstage.io/managed-by-location':
                    'url:https://ghe.spotify.net/hr-disco/disco-web/tree/master/catalog-info.yaml',
                  'backstage.io/managed-by-origin-location':
                    'url:https://ghe.spotify.net/hr-disco/disco-web/blob/master/catalog-info.yaml',
                  'github.com/project-slug': 'hr-disco/disco-web',
                },
                name: 'backstage-frontend',
                namespace: 'default',
                uid: '52c6e2ea-3206-4f84-b0a4-5b421d60c690',
                etag: '300b902b99371a9d998df1b0ba0c2c5129a35c6f',
              },
              spec: {
                owner: 'cubic-belugas',
                type: 'website',
                visibility: 'public',
                lifecycle: 'production',
              },
            },
          ],
        }),
        getLocations: async () => ({
          items: [
            {
              id: '123',
              type: 'url',
              target:
                'https://ghe.spotify.net/hr-disco/disco-web/blob/master/catalog-info.yaml',
            },
          ],
        }),
      });

      const provider = new HotNewsConsumer({
        logger,
        lifecycle,
        auth,
        events,
        catalog,
        octokitProvider,
      });

      await provider.connect(connection);
      await events.publish({
        topic: 'github.repository',
        metadata: { 'x-github-event': 'repository' },
        eventPayload: require('./__fixtures__/repository-archived-event.json'),
      });

      await waitFor(() => {
        expect(catalog.getEntities).toHaveBeenCalledWith(
          expect.objectContaining({
            filter: {
              [ANNOTATION_ORIGIN_LOCATION]: [
                'url:https://ghe.spotify.net/hr-disco/disco-web/blob/master/catalog-info.yaml',
              ],
            },
            fields: ['kind', 'metadata.name', 'metadata.namespace'],
          }),
          { credentials: expect.anything() },
        );
        expect(catalog.refreshEntity).toHaveBeenCalledWith(
          'component:default/backstage-frontend',
          { credentials: expect.anything() },
        );
      });
    });
  });

  describe('repository.renamed', () => {
    it('moves', async () => {
      const events = new MockEventsService();
      const catalog = catalogServiceMock.mock({
        getLocations: async () => ({
          items: [
            {
              id: '123',
              type: 'url',
              target:
                'https://ghe.spotify.net/hr-disco/foo/blob/master/catalog-info.yaml',
            },
          ],
        }),
      });

      const provider = new HotNewsConsumer({
        logger,
        lifecycle,
        auth,
        events,
        catalog,
        octokitProvider,
      });

      await provider.connect(connection);
      await events.publish({
        topic: 'github.repository',
        metadata: { 'x-github-event': 'repository' },
        eventPayload: require('./__fixtures__/repository-renamed-event.json'),
      });

      await waitFor(() => {
        expect(catalog.getLocations).toHaveBeenCalledWith(
          {},
          { credentials: expect.anything() },
        );
        expect(catalog.removeLocationById).toHaveBeenCalledWith('123', {
          credentials: expect.anything(),
        });
        expect(catalog.addLocation).toHaveBeenCalledWith(
          {
            type: 'url',
            target:
              'https://ghe.spotify.net/hr-disco/disco-web/blob/master/catalog-info.yaml',
          },
          { credentials: expect.anything() },
        );
      });
    });
  });

  describe('repository.transferred', () => {
    it('moves', async () => {
      const events = new MockEventsService();
      const catalog = catalogServiceMock.mock({
        getLocations: async () => ({
          items: [
            {
              id: '123',
              type: 'url',
              target:
                'https://ghe.spotify.net/foo/disco-web/blob/master/catalog-info.yaml',
            },
          ],
        }),
      });

      const provider = new HotNewsConsumer({
        logger,
        lifecycle,
        auth,
        events,
        catalog,
        octokitProvider,
      });

      await provider.connect(connection);
      await events.publish({
        topic: 'github.repository',
        metadata: { 'x-github-event': 'repository' },
        eventPayload: require('./__fixtures__/repository-transferred-event.json'),
      });

      await waitFor(() => {
        expect(catalog.getLocations).toHaveBeenCalledWith(
          {},
          { credentials: expect.anything() },
        );
        expect(catalog.removeLocationById).toHaveBeenCalledWith('123', {
          credentials: expect.anything(),
        });
        expect(catalog.addLocation).toHaveBeenCalledWith(
          {
            type: 'url',
            target:
              'https://ghe.spotify.net/hr-disco/disco-web/blob/master/catalog-info.yaml',
          },
          { credentials: expect.anything() },
        );
      });
    });
  });
});

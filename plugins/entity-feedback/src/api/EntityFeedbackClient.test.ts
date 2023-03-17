/*
 * Copyright 2023 The Backstage Authors
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

import { MockFetchApi, setupRequestMockHandlers } from '@backstage/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { EntityFeedbackClient } from './EntityFeedbackClient';

const server = setupServer();

describe('EntityFeedbackClient', () => {
  setupRequestMockHandlers(server);
  const mockBaseUrl = 'http://backstage/api/entity-feedback';
  const discoveryApi = { getBaseUrl: async () => mockBaseUrl };
  const fetchApi = new MockFetchApi();

  let client: EntityFeedbackClient;
  beforeEach(() => {
    client = new EntityFeedbackClient({ discoveryApi, fetchApi });
  });

  it('getAllRatings', async () => {
    const ratings = [
      {
        entityRef: 'component:default/foo',
        entityTitle: 'Foo',
        ratings: { LIKE: 10 },
      },
      {
        entityRef: 'component:default/bar',
        entityTitle: 'Bar',
        ratings: { DISLIKE: 10 },
      },
    ];

    server.use(
      rest.get(`${mockBaseUrl}/ratings`, (_, res, ctx) =>
        res(ctx.json(ratings)),
      ),
    );

    const response = await client.getAllRatings();
    expect(response).toEqual(ratings);
  });

  it('getOwnedRatings', async () => {
    const ratings = [
      {
        entityRef: 'component:default/foo',
        entityTitle: 'Foo',
        ratings: { LIKE: 10 },
      },
      {
        entityRef: 'component:default/bar',
        entityTitle: 'Bar',
        ratings: { DISLIKE: 10 },
      },
    ];

    server.use(
      rest.get(
        `${mockBaseUrl}/ratings?ownerRef=${encodeURIComponent(
          'group:default/team',
        )}`,
        (_, res, ctx) => res(ctx.json(ratings)),
      ),
    );

    const response = await client.getOwnedRatings('group:default/team');
    expect(response).toEqual(ratings);
  });

  it('recordRating', async () => {
    expect.assertions(1);

    server.use(
      rest.post(
        `${mockBaseUrl}/ratings/${encodeURIComponent(
          'component:default/service',
        )}`,
        (req, res) => {
          expect(req.body).toEqual({ rating: 'LIKE' });
          return res();
        },
      ),
    );

    await client.recordRating('component:default/service', 'LIKE');
  });

  it('getRatings', async () => {
    const ratings = [
      { userRef: 'user:default/foo', rating: 'LIKE' },
      { userRef: 'user:default/bar', rating: 'LIKE' },
    ];

    server.use(
      rest.get(
        `${mockBaseUrl}/ratings/${encodeURIComponent(
          'component:default/service',
        )}`,
        (_, res, ctx) => res(ctx.json(ratings)),
      ),
    );

    const response = await client.getRatings('component:default/service');
    expect(response).toEqual(ratings);
  });

  it('getRatingAggregates', async () => {
    const ratings = { LIKE: 3, DISLIKE: 5 };

    server.use(
      rest.get(
        `${mockBaseUrl}/ratings/${encodeURIComponent(
          'component:default/service',
        )}/aggregate`,
        (_, res, ctx) => res(ctx.json(ratings)),
      ),
    );

    const response = await client.getRatingAggregates(
      'component:default/service',
    );
    expect(response).toEqual(ratings);
  });

  it('recordResponse', async () => {
    expect.assertions(1);
    const response = {
      response: 'blah',
      comments: 'feedback',
      consent: false,
    };

    server.use(
      rest.post(
        `${mockBaseUrl}/responses/${encodeURIComponent(
          'component:default/service',
        )}`,
        (req, res) => {
          expect(req.body).toEqual(response);
          return res();
        },
      ),
    );

    await client.recordResponse('component:default/service', response);
  });

  it('getResponses', async () => {
    const responses = [
      {
        userRef: 'user:default/foo',
        response: 'asdf',
        comments: 'here is new feedback',
        consent: false,
      },
      {
        userRef: 'user:default/bar',
        response: 'noop',
        comments: 'here is different feedback',
        consent: true,
      },
    ];

    server.use(
      rest.get(
        `${mockBaseUrl}/responses/${encodeURIComponent(
          'component:default/service',
        )}`,
        (_, res, ctx) => res(ctx.json(responses)),
      ),
    );

    const response = await client.getResponses('component:default/service');
    expect(response).toEqual(responses);
  });
});

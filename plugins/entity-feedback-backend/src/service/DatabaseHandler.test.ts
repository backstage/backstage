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

import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';

import { DatabaseHandler } from './DatabaseHandler';

describe('DatabaseHandler', () => {
  const databases = TestDatabases.create();

  async function createDatabaseHandler(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    return {
      knex,
      dbHandler: await DatabaseHandler.create({ database: knex }),
    };
  }

  describe.each(databases.eachSupportedId())(
    '%p',
    databaseId => {
      let knex: Knex;
      let dbHandler: DatabaseHandler;

      beforeEach(async () => {
        ({ knex, dbHandler } = await createDatabaseHandler(databaseId));
      }, 30000);

      afterEach(async () => {
        // Clean up after each test
        await knex('ratings').del();
        await knex('responses').del();
      }, 30000);

      it('getAllRatedEntities', async () => {
        await knex('ratings').insert([
          {
            entity_ref: 'component:default/service',
            user_ref: 'user:default/foo',
            rating: 'DISLIKE',
          },
          {
            entity_ref: 'component:default/service',
            user_ref: 'user:default/foo',
            rating: 'LIKE',
          },
          {
            entity_ref: 'component:default/library',
            user_ref: 'user:default/bar',
            rating: 'LIKE',
          },
          {
            entity_ref: 'component:default/website',
            user_ref: 'user:default/foo',
            rating: 'LIKE',
          },
        ]);

        const entities = await dbHandler.getAllRatedEntities();
        expect(entities.length).toEqual(3);
        expect(entities).toEqual(
          expect.arrayContaining([
            'component:default/service',
            'component:default/library',
            'component:default/website',
          ]),
        );
      });

      it('getRatingsAggregates', async () => {
        await knex('ratings').insert([
          {
            entity_ref: 'component:default/service',
            user_ref: 'user:default/foo',
            rating: 'DISLIKE',
            timestamp: '2004-10-19 10:23:54',
          },
          {
            entity_ref: 'component:default/service',
            user_ref: 'user:default/foo',
            rating: 'LIKE',
            timestamp: '2004-11-19 08:23:54',
          },
          {
            entity_ref: 'component:default/service',
            user_ref: 'user:default/bar',
            rating: 'LIKE',
            timestamp: '2004-11-20 08:23:54',
          },
          {
            entity_ref: 'component:default/website',
            user_ref: 'user:default/foo',
            rating: 'LIKE',
            timestamp: '2004-11-20 08:23:54',
          },
          {
            entity_ref: 'component:default/website',
            user_ref: 'user:default/test',
            rating: 'DISLIKE',
            timestamp: '2004-11-20 08:23:54',
          },
        ]);

        let ratings = await dbHandler.getRatingsAggregates([
          'component:default/service',
          'component:default/website',
        ]);
        expect(ratings.length).toEqual(3);
        expect(ratings).toEqual(
          expect.arrayContaining([
            {
              entityRef: 'component:default/service',
              rating: 'LIKE',
              count: 2,
            },
            {
              entityRef: 'component:default/website',
              rating: 'DISLIKE',
              count: 1,
            },
            {
              entityRef: 'component:default/website',
              rating: 'LIKE',
              count: 1,
            },
          ]),
        );

        ratings = await dbHandler.getRatingsAggregates([
          'component:default/website',
        ]);
        expect(ratings.length).toEqual(2);
        expect(ratings).toEqual(
          expect.arrayContaining([
            {
              entityRef: 'component:default/website',
              rating: 'DISLIKE',
              count: 1,
            },
            {
              entityRef: 'component:default/website',
              rating: 'LIKE',
              count: 1,
            },
          ]),
        );
      });

      it('recordRating', async () => {
        const newRating = {
          userRef: 'user:default/me',
          entityRef: 'component:default/service',
          rating: 'LIKE',
        };

        await dbHandler.recordRating(newRating);

        const ratings = await knex('ratings').select();
        expect(ratings.length).toEqual(1);
        expect(ratings[0]).toEqual(
          expect.objectContaining({
            user_ref: newRating.userRef,
            entity_ref: newRating.entityRef,
            rating: newRating.rating,
            timestamp: expect.anything(),
          }),
        );
      });

      it('getRatings', async () => {
        await knex('ratings').insert([
          {
            entity_ref: 'component:default/service',
            user_ref: 'user:default/foo',
            rating: 'DISLIKE',
            timestamp: '2004-10-19 10:23:54',
          },
          {
            entity_ref: 'component:default/service',
            user_ref: 'user:default/foo',
            rating: 'LIKE',
            timestamp: '2004-11-19 08:23:54',
          },
          {
            entity_ref: 'component:default/service',
            user_ref: 'user:default/bar',
            rating: 'LIKE',
            timestamp: '2004-11-20 08:23:54',
          },
          {
            entity_ref: 'component:default/website',
            user_ref: 'user:default/foo',
            rating: 'LIKE',
            timestamp: '2004-11-20 08:23:54',
          },
        ]);

        const ratings = await dbHandler.getRatings('component:default/service');
        expect(ratings.length).toEqual(2);
        expect(ratings).toEqual(
          expect.arrayContaining([
            { userRef: 'user:default/foo', rating: 'LIKE' },
            { userRef: 'user:default/bar', rating: 'LIKE' },
          ]),
        );
      });

      it('recordResponse', async () => {
        const newResponse = {
          userRef: 'user:default/me',
          entityRef: 'component:default/service',
          response: 'blah',
          comments: 'here is some feedback',
          consent: false,
        };

        await dbHandler.recordResponse(newResponse);

        const responses = await knex('responses').select();
        expect(responses.length).toEqual(1);
        expect({
          ...responses[0],
          consent: Boolean(responses[0].consent),
        }).toEqual(
          expect.objectContaining({
            user_ref: newResponse.userRef,
            entity_ref: newResponse.entityRef,
            response: newResponse.response,
            comments: newResponse.comments,
            consent: newResponse.consent,
            timestamp: expect.anything(),
          }),
        );
      });

      it('getResponses', async () => {
        await knex('responses').insert([
          {
            entity_ref: 'component:default/service',
            user_ref: 'user:default/foo',
            response: 'blah',
            comments: 'here is some feedback',
            consent: true,
            timestamp: '2004-10-19 10:23:54',
          },
          {
            entity_ref: 'component:default/service',
            user_ref: 'user:default/foo',
            response: 'asdf',
            comments: 'here is new feedback',
            consent: false,
            timestamp: '2004-11-19 08:23:54',
          },
          {
            entity_ref: 'component:default/service',
            user_ref: 'user:default/bar',
            response: 'noop',
            comments: 'here is different feedback',
            consent: true,
            timestamp: '2004-11-20 08:23:54',
          },
          {
            entity_ref: 'component:default/website',
            user_ref: 'user:default/foo',
            response: 'cool',
            comments: 'no comment',
            consent: true,
            timestamp: '2004-11-20 08:23:54',
          },
        ]);

        const responses = await dbHandler.getResponses(
          'component:default/service',
        );
        expect(responses.length).toEqual(2);
        expect(responses).toEqual(
          expect.arrayContaining([
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
          ]),
        );
      });

      it('getAllAppRatings', async () => {
        await knex('app_ratings').insert([
          {
            user_ref: 'user:default/foo',
            rating: 3,
          },
          {
            user_ref: 'user:default/foo',
            rating: 5,
          },
          {
            user_ref: 'user:default/bar',
            rating: 2,
          },
          {
            user_ref: 'user:default/foo',
            rating: 5,
          },
        ]);

        const entities = await dbHandler.getAppRatings();
        expect(entities.length).toEqual(4);
      });

      it('recordAppRating', async () => {
        const newRating = {
          userRef: 'user:default/me',
          rating: 4,
        };

        await dbHandler.recordAppRating(newRating);

        const ratings = await knex('app_ratings').select();
        expect(ratings.length).toEqual(1);
        expect(ratings[0]).toEqual({
          user_ref: newRating.userRef,
          rating: newRating.rating,
          timestamp: expect.anything(),
        });
      });
    },
    60000,
  );
});

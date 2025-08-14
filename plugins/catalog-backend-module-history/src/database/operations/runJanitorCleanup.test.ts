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

import { TestDatabases } from '@backstage/backend-test-utils';
import { initEmptyDatabase } from '../../__fixtures__/initEmptyDatabase';
import { getHistoryConfig } from '../../config';
import { EventsTableRow } from '../tables';
import { knexRawNowMinus, knexRawNowPlus } from '../util';
import { runJanitorCleanup } from './runJanitorCleanup';

jest.setTimeout(60_000);

describe('runJanitorCleanup', () => {
  const databases = TestDatabases.create();

  describe('eventMaxRetentionTime', () => {
    it.each(databases.eachSupportedId())(
      'deletes old entries whether the entity exists or not, %p',
      async databaseId => {
        const { knex, shutdown } = await initEmptyDatabase(
          databases,
          databaseId,
        );

        await knex('refresh_state').insert({
          entity_id: '1',
          entity_ref: 'k:ns/exists',
          unprocessed_entity: '{}',
          errors: '{}',
          last_discovery_at: knex.fn.now(),
          next_update_at: knex.fn.now(),
        });

        await knex('final_entities').insert({
          entity_id: '1',
          entity_ref: 'k:ns/exists',
          stitch_ticket: 'a',
          hash: 'b',
          final_entity: '{}',
        });

        // Start with a clean slate for the test
        await knex('history_entity_summary').delete();
        await knex('history_events').delete();

        const recently = knex.fn.now();
        const longAgo = knexRawNowMinus(knex, { hours: 2 });

        await knex<EventsTableRow>('history_events').insert([
          {
            entity_id: '1',
            entity_ref: 'k:ns/exists',
            event_at: longAgo,
            event_type: 'a',
            entity_json: '{}',
          },
          {
            entity_id: '1',
            entity_ref: 'k:ns/exists',
            event_at: recently,
            event_type: 'b',
            entity_json: '{}',
          },
          {
            entity_id: '2',
            entity_ref: 'k:ns/gone',
            event_at: longAgo,
            event_type: 'c',
            entity_json: '{}',
          },
          {
            entity_id: '2',
            entity_ref: 'k:ns/gone',
            event_at: recently,
            event_type: 'd',
            entity_json: '{}',
          },
        ]);

        await expect(
          knex('history_events').select('event_type').orderBy('event_id'),
        ).resolves.toEqual([
          { event_type: 'a' },
          { event_type: 'b' },
          { event_type: 'c' },
          { event_type: 'd' },
        ]);

        await runJanitorCleanup(
          knex,
          getHistoryConfig({
            overrides: {
              eventMaxRetentionTime: { hours: 1 },
            },
          }),
        );

        await expect(
          knex('history_events').select('event_type').orderBy('event_id'),
        ).resolves.toEqual([{ event_type: 'b' }, { event_type: 'd' }]);

        await shutdown();
      },
    );
  });

  describe('eventRetentionTimeAfterDeletion', () => {
    it.each(databases.eachSupportedId())(
      'only deletes for entities whose oldest events are older than the retention time, %p',
      async databaseId => {
        const { knex, shutdown } = await initEmptyDatabase(
          databases,
          databaseId,
        );

        await knex('refresh_state').insert({
          entity_id: '1',
          entity_ref: 'k:ns/only-older-than-deadline-but-is-not-deleted',
          unprocessed_entity: '{}',
          errors: '{}',
          last_discovery_at: knex.fn.now(),
          next_update_at: knex.fn.now(),
        });

        await knex('final_entities').insert({
          entity_id: '1',
          entity_ref: 'k:ns/only-older-than-deadline-but-is-not-deleted',
          stitch_ticket: 'a',
          hash: 'b',
          final_entity: '{}',
        });

        // Start with a clean slate for the test
        await knex('history_entity_summary').delete();
        await knex('history_events').delete();

        const recently = knex.fn.now();
        const longAgo = knexRawNowMinus(knex, { hours: 2 });

        await knex<EventsTableRow>('history_events').insert([
          {
            entity_id: '1',
            entity_ref: 'k:ns/only-older-than-deadline-but-is-not-deleted',
            event_at: longAgo,
            event_type: 'test',
            entity_json: '{}',
          },
          {
            entity_id: '1',
            entity_ref: 'k:ns/only-older-than-deadline-but-is-not-deleted',
            event_at: longAgo,
            event_type: 'test',
            entity_json: '{}',
          },
          {
            entity_id: '2',
            entity_ref: 'k:ns/only-older-than-deadline',
            event_at: longAgo,
            event_type: 'test',
            entity_json: '{}',
          },
          {
            entity_id: '2',
            entity_ref: 'k:ns/only-older-than-deadline',
            event_at: longAgo,
            event_type: 'test',
            entity_json: '{}',
          },
          {
            entity_id: '3',
            entity_ref: 'k:ns/some-older-some-newer-than-deadline',
            event_at: longAgo,
            event_type: 'test',
            entity_json: '{}',
          },
          {
            entity_id: '3',
            entity_ref: 'k:ns/some-older-some-newer-than-deadline',
            event_at: recently,
            event_type: 'test',
            entity_json: '{}',
          },
          {
            entity_id: '4',
            entity_ref: 'k:ns/only-newer-than-deadline',
            event_at: recently,
            event_type: 'test',
            entity_json: '{}',
          },
          {
            entity_id: '4',
            entity_ref: 'k:ns/only-newer-than-deadline',
            event_at: recently,
            event_type: 'test',
            entity_json: '{}',
          },
        ]);

        await expect(
          knex('history_events').select('entity_ref').orderBy('event_id'),
        ).resolves.toEqual([
          { entity_ref: 'k:ns/only-older-than-deadline-but-is-not-deleted' },
          { entity_ref: 'k:ns/only-older-than-deadline-but-is-not-deleted' },
          { entity_ref: 'k:ns/only-older-than-deadline' },
          { entity_ref: 'k:ns/only-older-than-deadline' },
          { entity_ref: 'k:ns/some-older-some-newer-than-deadline' },
          { entity_ref: 'k:ns/some-older-some-newer-than-deadline' },
          { entity_ref: 'k:ns/only-newer-than-deadline' },
          { entity_ref: 'k:ns/only-newer-than-deadline' },
        ]);

        await runJanitorCleanup(
          knex,
          getHistoryConfig({
            overrides: {
              eventRetentionTimeAfterDeletion: { hours: 1 },
            },
          }),
        );

        await expect(
          knex('history_events').select('entity_ref').orderBy('event_id'),
        ).resolves.toEqual([
          { entity_ref: 'k:ns/only-older-than-deadline-but-is-not-deleted' },
          { entity_ref: 'k:ns/only-older-than-deadline-but-is-not-deleted' },
          { entity_ref: 'k:ns/only-older-than-deadline' }, // this is retained only because the summary table refers to it as the latest one
          { entity_ref: 'k:ns/some-older-some-newer-than-deadline' },
          { entity_ref: 'k:ns/some-older-some-newer-than-deadline' },
          { entity_ref: 'k:ns/only-newer-than-deadline' },
          { entity_ref: 'k:ns/only-newer-than-deadline' },
        ]);

        await shutdown();
      },
    );
  });

  describe('subscriptionAckTimeout', () => {
    it.each(databases.eachSupportedId())(
      'only resets unacknowledged deliveries if the timeout is reached and it is in the right state, %p',
      async databaseId => {
        const { knex, shutdown } = await initEmptyDatabase(
          databases,
          databaseId,
        );

        const inThePast = knexRawNowMinus(knex, { seconds: 30 });
        const inTheFuture = knexRawNowPlus(knex, { seconds: 30 });

        await knex('history_subscriptions').insert({
          subscription_id: 's1',
          state: 'waiting',
          ack_timeout_at: inThePast,
          ack_id: 'i',
          last_acknowledged_event_id: '1',
          last_sent_event_id: '2',
        });
        await knex('history_subscriptions').insert({
          subscription_id: 's2',
          state: 'waiting',
          ack_timeout_at: inTheFuture,
          ack_id: 'i',
          last_acknowledged_event_id: '1',
          last_sent_event_id: '2',
        });
        await knex('history_subscriptions').insert({
          subscription_id: 's3',
          state: 'not-waiting',
          ack_timeout_at: inThePast,
          ack_id: 'i',
          last_acknowledged_event_id: '1',
          last_sent_event_id: '2',
        });

        await runJanitorCleanup(knex, getHistoryConfig());

        await expect(
          knex('history_subscriptions').orderBy('subscription_id'),
        ).resolves.toEqual([
          expect.objectContaining({
            state: 'idle',
            ack_id: null,
            ack_timeout_at: null,
          }),
          expect.objectContaining({
            state: 'waiting',
            ack_id: 'i',
          }),
          expect.objectContaining({
            state: 'not-waiting',
            ack_id: 'i',
          }),
        ]);

        await shutdown();
      },
    );
  });
});

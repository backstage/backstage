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

import { PermissionsService } from '@backstage/backend-plugin-api';
import {
  mockCredentials,
  mockServices,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { NotAllowedError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  createConditionAuthorizer,
  createConditionTransformer,
} from '@backstage/plugin-permission-node';
import { HumanDuration } from '@backstage/types';
import { Knex } from 'knex';
import { applyDatabaseMigrations } from '../../database/migrations';
import { parseEntityChangeScope } from '../../database/operations/changes/scope';
import { permissionRules } from '../../permissions/rules';
import { EntityChangeListener } from './EntityChangeListener';
import { EntityChangesService } from './EntityChangesService';

jest.setTimeout(60_000);
const databases = TestDatabases.create();

const credentials = mockCredentials.user();
const rules = Object.values(permissionRules);

const allow = [{ result: AuthorizeResult.ALLOW }];
const deny = [{ result: AuthorizeResult.DENY }];
const onlyComponents = [
  {
    result: AuthorizeResult.CONDITIONAL,
    pluginId: 'catalog',
    resourceType: 'catalog-entity',
    conditions: {
      rule: 'IS_ENTITY_KIND',
      resourceType: 'catalog-entity',
      params: { kinds: ['component'] },
    },
  },
];

async function publish(
  knex: Knex,
  ref: string,
  generation: number,
  options?: { deleted?: boolean; lastBody?: boolean },
) {
  const kind = ref.split(':')[0];
  const id = `id-${ref}`;
  const body = JSON.stringify({
    apiVersion: 'backstage.io/v1alpha1',
    kind,
    metadata: { name: ref.split('/')[1] },
  });
  // Like the stitcher, publish the row and its search rows together, so that
  // a concurrent reader never sees one without the other
  await knex.transaction(async tx => {
    await tx('final_entities').insert({
      entity_id: id,
      entity_ref: ref,
      hash: 'h',
      final_entity: options?.deleted ? null : body,
      last_final_entity:
        options?.deleted && options.lastBody !== false ? body : null,
      generation,
    });
    if (!options?.deleted) {
      await tx('search').insert({
        entity_id: id,
        key: 'kind',
        value: kind,
        original_value: kind,
      });
    }
  });
}

function setup(knex: Knex, blockDuration: HumanDuration = { seconds: 5 }) {
  const authorizeConditional = jest.fn().mockResolvedValue(allow);
  const permissions = {
    ...mockServices.permissions(),
    authorizeConditional,
  } as unknown as PermissionsService;
  const listener = new EntityChangeListener({
    knex,
    logger: mockServices.logger.mock(),
    pollInterval: { milliseconds: 50 },
    blockDuration,
  });
  const service = new EntityChangesService({
    knex,
    permissions,
    transformConditions: createConditionTransformer(rules),
    authorizeConditions: createConditionAuthorizer(rules),
    listener,
  });
  return { service, listener, authorizeConditional };
}

describe.each(databases.eachSupportedId())('EntityChangesService, %p', id => {
  let knex: Knex;
  let listener: EntityChangeListener | undefined;

  beforeEach(async () => {
    knex = await databases.init(id);
    await applyDatabaseMigrations(knex);
  });

  afterEach(() => {
    listener?.stop();
  });

  it('applies permissions to live rows and tombstones', async () => {
    const setupResult = setup(knex);
    listener = setupResult.listener;
    const { service, authorizeConditional } = setupResult;
    await publish(knex, 'component:default/a', 1);
    await publish(knex, 'user:default/u', 2);
    await publish(knex, 'component:default/gone', 3, { deleted: true });
    await publish(knex, 'user:default/gone', 4, { deleted: true });
    await publish(knex, 'component:default/old', 5, {
      deleted: true,
      lastBody: false,
    });

    const read = () =>
      service.readChanges({
        afterGeneration: '0',
        limit: 100,
        block: false,
        credentials,
        signal: new AbortController().signal,
      });

    await expect(read()).resolves.toEqual({
      type: 'data',
      entityRefs: [
        'component:default/a',
        'user:default/u',
        'component:default/gone',
        'user:default/gone',
        'component:default/old',
      ],
      nextGeneration: '5',
      filtered: false,
    });

    // Tombstones are judged by the body they replaced, and left out without
    // one
    authorizeConditional.mockResolvedValue(onlyComponents);
    await expect(read()).resolves.toEqual({
      type: 'data',
      entityRefs: ['component:default/a', 'component:default/gone'],
      nextGeneration: '5',
      filtered: true,
    });

    authorizeConditional.mockResolvedValue(deny);
    await expect(read()).rejects.toThrow(NotAllowedError);
    await expect(service.upsertSubscription({ credentials })).rejects.toThrow(
      NotAllowedError,
    );
  });

  it('starts from the end and waits for new changes', async () => {
    const setupResult = setup(knex);
    listener = setupResult.listener;
    const { service } = setupResult;
    await publish(knex, 'component:default/a', 1);

    const result = await service.readChanges({
      afterGeneration: 'last',
      scope: parseEntityChangeScope(['component']),
      limit: 100,
      block: true,
      credentials,
      signal: new AbortController().signal,
    });
    expect(result).toEqual(
      expect.objectContaining({ type: 'block', nextGeneration: '1' }),
    );
    if (result.type !== 'block') {
      throw new Error('expected a wait');
    }

    const wait = result.wait();
    await publish(knex, 'user:default/outside-scope', 2);
    await publish(knex, 'component:default/b', 3);
    listener.notify();
    await expect(wait).resolves.toBe('ready');

    await expect(
      service.readChanges({
        afterGeneration: result.nextGeneration,
        scope: parseEntityChangeScope(['component']),
        limit: 100,
        block: true,
        credentials,
        signal: new AbortController().signal,
      }),
    ).resolves.toEqual({
      type: 'data',
      entityRefs: ['component:default/b'],
      nextGeneration: '3',
      filtered: false,
    });
  });

  it('does not wake a filtered reader for changes it cannot see', async () => {
    const setupResult = setup(knex, { milliseconds: 500 });
    listener = setupResult.listener;
    const { service, authorizeConditional } = setupResult;
    authorizeConditional.mockResolvedValue(onlyComponents);

    const result = await service.readChanges({
      afterGeneration: 'last',
      limit: 100,
      block: true,
      credentials,
      signal: new AbortController().signal,
    });
    if (result.type !== 'block') {
      throw new Error('expected a wait');
    }
    const wait = result.wait();
    await publish(knex, 'user:default/hidden', 1);
    listener.notify();
    await expect(wait).resolves.toBe('timeout');

    // An aborted request stops waiting right away
    const controller = new AbortController();
    const aborted = await service.readChanges({
      afterGeneration: '1',
      limit: 100,
      block: true,
      credentials,
      signal: controller.signal,
    });
    if (aborted.type !== 'block') {
      throw new Error('expected a wait');
    }
    const abortedWait = aborted.wait();
    controller.abort();
    await expect(abortedWait).resolves.toBe('aborted');
  });

  it('wakes a blocked subscription reader when another reader releases a batch', async () => {
    const setupResult = setup(knex, { seconds: 3 });
    listener = setupResult.listener;
    const { service } = setupResult;
    await publish(knex, 'component:default/a', 1);
    await service.upsertSubscription({
      subscriptionId: 'shared',
      afterGeneration: '0',
      credentials,
    });
    const read = (block: boolean) =>
      service.readSubscription({
        subscriptionId: 'shared',
        limit: 100,
        block,
        credentials,
        signal: new AbortController().signal,
      });

    // One replica holds the batch, so another has to wait
    const held = await read(false);
    if (held.type !== 'data' || !held.ackId) {
      throw new Error('expected a batch');
    }
    const blocked = await read(true);
    if (blocked.type !== 'block') {
      throw new Error('expected a wait');
    }
    const wait = blocked.wait();
    await new Promise(resolve => setTimeout(resolve, 200));

    // Nothing new is published; releasing the batch is enough to wake it
    const started = Date.now();
    await service.nackSubscription({
      subscriptionId: 'shared',
      ackId: held.ackId,
      credentials,
    });
    await expect(wait).resolves.toBe('ready');
    expect(Date.now() - started).toBeLessThan(2000);
    await expect(read(false)).resolves.toEqual(
      expect.objectContaining({ entityRefs: ['component:default/a'] }),
    );
  });

  it('delivers subscription batches, and skips windows the reader cannot see', async () => {
    const setupResult = setup(knex);
    listener = setupResult.listener;
    const { service, authorizeConditional } = setupResult;
    await publish(knex, 'user:default/u1', 1);
    await publish(knex, 'user:default/u2', 2);
    await publish(knex, 'component:default/a', 3);

    const subscription = await service.upsertSubscription({
      subscriptionId: 'mirror',
      afterGeneration: '0',
      credentials,
    });
    expect(subscription.lastAcknowledgedGeneration).toBe('0');

    const read = (block = false) =>
      service.readSubscription({
        subscriptionId: 'mirror',
        limit: 1,
        block,
        credentials,
        signal: new AbortController().signal,
      });

    // The user rows are invisible to this reader and get skipped without
    // needing an acknowledgement
    authorizeConditional.mockResolvedValue(onlyComponents);
    const batch = await read();
    expect(batch).toEqual({
      type: 'data',
      entityRefs: ['component:default/a'],
      ackId: expect.any(String),
      filtered: true,
    });

    // Unacknowledged, so nothing more can be read
    await expect(read()).resolves.toEqual({
      type: 'data',
      entityRefs: [],
      filtered: true,
    });

    if (batch.type !== 'data' || !batch.ackId) {
      throw new Error('expected a batch');
    }
    await service.ackSubscription({
      subscriptionId: 'mirror',
      ackId: batch.ackId,
      credentials,
    });
    await expect(
      service.ackSubscription({
        subscriptionId: 'mirror',
        ackId: batch.ackId,
        credentials,
      }),
    ).rejects.toThrow('no batch with that ack ID');

    const blocked = await read(true);
    if (blocked.type !== 'block') {
      throw new Error('expected a wait');
    }
    const wait = blocked.wait();
    await publish(knex, 'component:default/b', 4);
    listener.notify();
    await expect(wait).resolves.toBe('ready');

    const next = await read();
    expect(next).toEqual(
      expect.objectContaining({ entityRefs: ['component:default/b'] }),
    );
    if (next.type !== 'data' || !next.ackId) {
      throw new Error('expected a batch');
    }
    await service.nackSubscription({
      subscriptionId: 'mirror',
      ackId: next.ackId,
      credentials,
    });
    await expect(read()).resolves.toEqual(
      expect.objectContaining({ entityRefs: ['component:default/b'] }),
    );
  });
});

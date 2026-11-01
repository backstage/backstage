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

import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { wrapServer } from '@backstage/backend-openapi-utils/testUtils';
import { mockServices, TestDatabases } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import {
  createConditionAuthorizer,
  createConditionTransformer,
} from '@backstage/plugin-permission-node';
import express from 'express';
import { Knex } from 'knex';
import { Server } from 'node:http';
import request from 'supertest';
import { applyDatabaseMigrations } from '../../database/migrations';
import { permissionRules } from '../../permissions/rules';
import { createRouter } from '../createRouter';
import { EntityChangeListener } from './EntityChangeListener';
import { EntityChangesService } from './EntityChangesService';

jest.setTimeout(60_000);
const databases = TestDatabases.create({ ids: ['SQLITE_3'] });

async function publish(knex: Knex, ref: string, generation: number) {
  await knex('final_entities').insert({
    entity_id: `id-${ref}`,
    entity_ref: ref,
    hash: 'h',
    final_entity: '{}',
    generation,
  });
}

describe('entity change routes', () => {
  let knex: Knex;
  let listener: EntityChangeListener;
  let app: express.Express | Server;

  beforeEach(async () => {
    knex = await databases.init('SQLITE_3');
    await applyDatabaseMigrations(knex);
    const rules = Object.values(permissionRules);
    listener = new EntityChangeListener({
      knex,
      logger: mockServices.logger.mock(),
      pollInterval: { milliseconds: 50 },
      blockDuration: { seconds: 5 },
    });
    const router = await createRouter({
      entitiesCatalog: {} as any,
      locationService: {} as any,
      orchestrator: {} as any,
      refreshService: {} as any,
      locationAnalyzer: {} as any,
      logger: mockServices.logger.mock(),
      config: new ConfigReader(undefined),
      auth: mockServices.auth(),
      httpAuth: mockServices.httpAuth(),
      permissionsService: mockServices.permissions(),
      auditor: mockServices.auditor.mock(),
      entityChanges: new EntityChangesService({
        knex,
        permissions: mockServices.permissions(),
        transformConditions: createConditionTransformer(rules),
        authorizeConditions: createConditionAuthorizer(rules),
        listener,
      }),
    });
    router.use(
      MiddlewareFactory.create({
        logger: mockServices.logger.mock(),
        config: mockServices.rootConfig(),
      }).error(),
    );
    app = await wrapServer(express().use(router));
  });

  afterEach(() => {
    listener.stop();
  });

  it('reads changes with cursors and long polling', async () => {
    await publish(knex, 'component:default/a', 1);
    await publish(knex, 'user:default/u', 2);

    await request(app).get('/entities/changes').expect(400);
    await request(app)
      .get('/entities/changes?afterGeneration=nope')
      .expect(400);
    await request(app)
      .get('/entities/changes?afterGeneration=0&scope=a:b:c')
      .expect(400);
    await request(app).get('/entities/changes?cursor=garbage').expect(400);
    const oversized = Buffer.from(
      JSON.stringify({ v: 1, afterGeneration: '0', limit: 1001, block: false }),
    ).toString('base64url');
    await request(app).get(`/entities/changes?cursor=${oversized}`).expect(400);

    const first = await request(app)
      .get(
        '/entities/changes?afterGeneration=0&scope=component&scope=user&limit=1',
      )
      .expect(200);
    expect(first.body.items).toEqual([{ entityRef: 'component:default/a' }]);
    expect(first.header['cache-control']).toBe('no-store');

    // The cursor keeps the scope and limit
    const second = await request(app)
      .get(`/entities/changes?cursor=${first.body.pageInfo.cursor}`)
      .expect(200);
    expect(second.body.items).toEqual([{ entityRef: 'user:default/u' }]);

    // An unscoped cursor stays unscoped, even if a scope is passed along
    const unscoped = await request(app)
      .get('/entities/changes?afterGeneration=0&limit=1')
      .expect(200);
    const unscopedNext = await request(app)
      .get(
        `/entities/changes?cursor=${unscoped.body.pageInfo.cursor}&scope=component`,
      )
      .expect(200);
    expect(unscopedNext.body.items).toEqual([{ entityRef: 'user:default/u' }]);

    // Starting at the end returns no items, just a cursor
    const last = await request(app)
      .get('/entities/changes?afterGeneration=last&scope=component&block=false')
      .expect(200);
    expect(last.body.items).toEqual([]);

    // A blocking read answers 202, and ends the body with a cursor to read
    // again with once something new may have arrived
    const blocked = request(app)
      .get('/entities/changes?afterGeneration=last&scope=component&block=true')
      .then(res => res);
    await new Promise(resolve => setTimeout(resolve, 200));
    await publish(knex, 'component:default/b', 3);
    listener.notify();
    const response = await blocked;
    expect(response.status).toBe(202);
    const { cursor } = JSON.parse(response.text).pageInfo;

    const after = await request(app)
      .get(`/entities/changes?cursor=${cursor}`)
      .expect(200);
    expect(after.body.items).toEqual([{ entityRef: 'component:default/b' }]);
  });

  it('manages subscriptions', async () => {
    await publish(knex, 'component:default/a', 1);

    const created = await request(app)
      .post('/entities/changes/subscriptions')
      .send({ subscriptionId: 's', afterGeneration: '0', scope: ['Component'] })
      .expect(200);
    expect(created.body.subscription).toEqual({
      subscriptionId: 's',
      createdAt: expect.any(String),
      lastActiveAt: expect.any(String),
      afterGeneration: '0',
      scope: ['component'],
    });

    await request(app)
      .post('/entities/changes/subscriptions')
      .send({ subscriptionId: 's', scope: ['user'] })
      .expect(409);
    await request(app)
      .get('/entities/changes/subscriptions/missing/read')
      .expect(404);

    const batch = await request(app)
      .get('/entities/changes/subscriptions/s/read')
      .expect(200);
    expect(batch.body).toEqual({
      items: [{ entityRef: 'component:default/a' }],
      ackId: expect.any(String),
    });

    await request(app)
      .post('/entities/changes/subscriptions/s/ack/wrong')
      .expect(404);
    await request(app)
      .post(`/entities/changes/subscriptions/s/ack/${batch.body.ackId}`)
      .expect(200);

    const empty = await request(app)
      .get('/entities/changes/subscriptions/s/read')
      .expect(200);
    expect(empty.body).toEqual({ items: [] });
  });
});

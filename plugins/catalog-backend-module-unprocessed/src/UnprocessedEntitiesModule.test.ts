/*
 * Copyright 2024 The Backstage Authors
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

import express from 'express';
import request from 'supertest';
import knex, { Knex } from 'knex';
import { UnprocessedEntitiesModule } from './UnprocessedEntitiesModule';
import {
  AuthorizeResult,
  type PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';

describe('UnprocessedEntitiesModule', () => {
  let db: Knex;
  let app: express.Express;
  let mockPermissions: jest.Mocked<PermissionEvaluator>;

  beforeEach(async () => {
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    });

    await db.schema.createTable('refresh_state', table => {
      table.string('entity_id').primary();
      table.string('entity_ref');
      table.text('unprocessed_entity');
      table.text('unprocessed_hash').nullable();
      table.text('processed_entity').nullable();
      table.text('result_hash').nullable();
      table.text('cache').nullable();
      table.text('errors').nullable();
      table.text('location_key').nullable();
      table.string('next_update_at');
      table.string('last_discovery_at');
    });

    await db.schema.createTable('final_entities', table => {
      table.string('entity_id').primary();
      table.text('final_entity').nullable();
    });

    const now = new Date().toISOString();

    await db('refresh_state').insert({
      entity_id: 'pending-entity',
      entity_ref: 'component:default/pending',
      unprocessed_entity: JSON.stringify({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'pending' },
        spec: { owner: 'group:default/team-a', type: 'service' },
      }),
      next_update_at: now,
      last_discovery_at: now,
    });

    await db('refresh_state').insert({
      entity_id: 'failed-entity',
      entity_ref: 'component:default/failed',
      unprocessed_entity: JSON.stringify({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'failed' },
        spec: { owner: 'group:default/team-a', type: 'service' },
      }),
      errors: JSON.stringify([{ message: 'something broke' }]),
      next_update_at: now,
      last_discovery_at: now,
    });

    await db('final_entities').insert({
      entity_id: 'failed-entity',
      final_entity: null,
    });

    mockPermissions = {
      authorize: jest.fn(),
      authorizeConditional: jest.fn(),
    };

    app = express();
    const router = express.Router();
    app.use(router);

    const module = UnprocessedEntitiesModule.create({
      database: db,
      router: { use: handler => router.use(handler) },
      permissions: mockPermissions,
      httpAuth: mockServices.httpAuth(),
    });
    module.registerRoutes();

    app.use(
      (
        err: Error & { statusCode?: number },
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        const status =
          err.statusCode ?? (err.name === 'NotAllowedError' ? 403 : 500);
        res.status(status).json({ error: { name: err.name } });
      },
    );
  });

  afterEach(async () => {
    await db.destroy();
  });

  describe('GET /entities/unprocessed/pending', () => {
    it('returns pending entities when authorized', async () => {
      mockPermissions.authorize.mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
      ]);

      const response = await request(app)
        .get('/entities/unprocessed/pending')
        .auth(mockCredentials.user.token(), { type: 'bearer' });

      expect(response.status).toBe(200);
      expect(response.body.type).toBe('pending');
      expect(response.body.entities).toHaveLength(1);
      expect(response.body.entities[0].entity_ref).toBe(
        'component:default/pending',
      );
      expect(mockPermissions.authorize).toHaveBeenCalledTimes(1);
    });

    it('returns 403 when not authorized', async () => {
      mockPermissions.authorize.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);

      const response = await request(app)
        .get('/entities/unprocessed/pending')
        .auth(mockCredentials.user.token(), { type: 'bearer' });

      expect(response.status).toBe(403);
      expect(mockPermissions.authorize).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /entities/unprocessed/failed', () => {
    it('returns failed entities when authorized', async () => {
      mockPermissions.authorize.mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
      ]);

      const response = await request(app)
        .get('/entities/unprocessed/failed')
        .auth(mockCredentials.user.token(), { type: 'bearer' });

      expect(response.status).toBe(200);
      expect(response.body.type).toBe('failed');
      expect(response.body.entities).toHaveLength(1);
      expect(response.body.entities[0].entity_ref).toBe(
        'component:default/failed',
      );
      expect(mockPermissions.authorize).toHaveBeenCalledTimes(1);
    });

    it('returns 403 when not authorized', async () => {
      mockPermissions.authorize.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);

      const response = await request(app)
        .get('/entities/unprocessed/failed')
        .auth(mockCredentials.user.token(), { type: 'bearer' });

      expect(response.status).toBe(403);
      expect(mockPermissions.authorize).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE /entities/unprocessed/delete/:entity_id', () => {
    it('deletes entity when authorized', async () => {
      mockPermissions.authorize.mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
      ]);

      const response = await request(app)
        .delete('/entities/unprocessed/delete/failed-entity')
        .auth(mockCredentials.user.token(), { type: 'bearer' });

      expect(response.status).toBe(204);
      expect(mockPermissions.authorize).toHaveBeenCalledTimes(1);

      const remaining = await db('refresh_state')
        .where({ entity_id: 'failed-entity' })
        .select();
      expect(remaining).toHaveLength(0);
    });

    it('returns 403 when not authorized', async () => {
      mockPermissions.authorize.mockResolvedValue([
        { result: AuthorizeResult.DENY },
      ]);

      const response = await request(app)
        .delete('/entities/unprocessed/delete/failed-entity')
        .auth(mockCredentials.user.token(), { type: 'bearer' });

      expect(response.status).toBe(403);
      expect(mockPermissions.authorize).toHaveBeenCalledTimes(1);
    });
  });
});

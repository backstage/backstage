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
import {
  DatabaseManager,
  getVoidLogger,
  PluginDatabaseManager,
} from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';
import { SignalsService } from '@backstage/plugin-signals-node';
import { mockServices } from '@backstage/backend-test-utils';
import { DatabaseNotificationsStore } from '../database';
import { Knex } from 'knex';

function createDatabase(): PluginDatabaseManager {
  return DatabaseManager.fromConfig(
    new ConfigReader({
      backend: {
        database: {
          client: 'better-sqlite3',
          connection: ':memory:',
        },
      },
    }),
  ).forPlugin('notifications');
}

const now = Date.now();
const id1 = '01e0871e-e60a-4f68-8110-5ae3513f992e';
const testNotification1 = {
  id: id1,
  user: 'user:default/mock',
  created: new Date(now - 1 * 60 * 60 * 1000 /* an hour ago */),
  origin: 'abcd-origin',
  title: 'Notification 1 - please find me',
  description: 'a description of the notification',
  topic: 'efgh-topic',
  link: '/catalog',
  severity: 'critical',
};

describe('createRouter', () => {
  let app: express.Express;

  const signalService: jest.Mocked<SignalsService> = {
    publish: jest.fn(),
  };

  const userInfo = mockServices.userInfo();
  const httpAuth = mockServices.httpAuth();
  const database = createDatabase();
  let knex: Knex;

  beforeAll(async () => {
    knex = await database.getClient();
    const store = await DatabaseNotificationsStore.create({ database });
    const router = await createRouter({
      logger: getVoidLogger(),
      store,
      signals: signalService,
      userInfo,
      httpAuth,
    });
    app = express().use(router);
  });

  beforeEach(async () => {
    jest.resetAllMocks();
    await knex('notification').del();
    await knex('broadcast').del();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /status', () => {
    it('returns ok', async () => {
      await knex('notification').insert(testNotification1);
      const response = await request(app).get('/status');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ read: 0, unread: 1 });
    });
  });
});

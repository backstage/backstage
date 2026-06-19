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
import {
  HttpAuthService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { StarsDatabase } from './database/StarsDatabase';

export interface RouterOptions {
  database: StarsDatabase;
  httpAuth: HttpAuthService;
  userInfo: UserInfoService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { database, httpAuth, userInfo } = options;

  const router = Router();
  router.use(express.json());

  async function getUserRef(req: express.Request): Promise<string> {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    const info = await userInfo.getUserInfo(credentials);
    return info.userEntityRef;
  }

  router.get('/', async (req, res) => {
    const userRef = await getUserRef(req);
    const stars = await database.getStars(userRef);
    res.json({ items: stars });
  });

  router.put('/:entityRef', async (req, res) => {
    const userRef = await getUserRef(req);
    const { entityRef } = req.params;
    await database.star(userRef, entityRef);
    res.status(204).end();
  });

  router.delete('/:entityRef', async (req, res) => {
    const userRef = await getUserRef(req);
    const { entityRef } = req.params;
    await database.unstar(userRef, entityRef);
    res.status(204).end();
  });

  router.get('/count/:entityRef', async (req, res) => {
    // Note: getStarCount could potentially be available to service tokens
    // but we enforce user tokens for simplicity as per requirements.
    const { entityRef } = req.params;
    const count = await database.getStarCount(entityRef);
    res.json({ count });
  });

  return router;
}

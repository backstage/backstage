/*
 * Copyright 2020 Spotify AB
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

import { Logger } from 'winston';
import Router from 'express-promise-router';
import express from 'express';
import { StorageBase, TemplaterBase } from '../scaffolder';

export interface RouterOptions {
  storage: StorageBase;
  templater: TemplaterBase;
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const { storage, templater, logger: parentLogger } = options;
  const logger = parentLogger.child({ plugin: 'scaffolder' });

  router
    .get('/v1/templates', async (_, res) => {
      const templates = await storage.list();
      res.status(200).json(templates);
    })
    .post('/v1/jobs', async (_, res) => {
      // TODO(blam): Actually make this function work
      const mock = 'templateid';
      res.status(201).json({ accepted: true });

      const path = await storage.prepare(mock);
      await templater.run({ directory: path, values: { componentId: 'test' } });
    });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}

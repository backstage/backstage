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

import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { router as googleAuthRouter } from './../providers/google/router';
import { router as githubAuthRouter } from './../providers/google/router';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger.child({ plugin: 'auth' });
  const router = Router();

  router.get('/ping', async (_req, res) => {
    res.status(200).send('pong');
  });

  router.use('/:provider', authProviderSwitcher);

  const app = express();
  app.set('logger', logger);
  app.use(router);

  return app;
}

const authProviderSwitcher = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const provider = req.params.provider;
  if (provider === 'google') {
    return googleAuthRouter(req, res, next);
  } else if (provider === 'github') {
    return githubAuthRouter(req, res, next);
  } else {
    res.send('No such provider');
  }
};

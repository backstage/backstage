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
import { SentryApiForwarder } from './sentry-api';

export async function createRouter(
  rootLogger: Logger,
): Promise<express.Router> {
  const router = Router();
  const SENTRY_TOKEN = process.env.SENTRY_TOKEN;
  if (!SENTRY_TOKEN) {
    console.error('Sentry token must be provided in env to start the API.');
    process.exit(1);
  }
  const sentryForwarder = new SentryApiForwarder(SENTRY_TOKEN);
  const logger = rootLogger.child({ plugin: 'sentry' });

  router.get('*', (req, res) => sentryForwarder.fowardRequest(req, res));

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}

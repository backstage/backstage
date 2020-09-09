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
import { getSentryApiForwarder } from './sentry-api';

export async function createRouter(logger: Logger): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  const SENTRY_TOKEN = process.env.SENTRY_TOKEN;
  if (!SENTRY_TOKEN) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error(
        'Sentry token must be provided in SENTRY_TOKEN environment variable to start the API.',
      );
    }
    logger.warn(
      'Failed to initialize Sentry backend, set SENTRY_TOKEN environment variable to start the API.',
    );
  } else {
    const sentryForwarder = getSentryApiForwarder(SENTRY_TOKEN, logger);

    router.use(sentryForwarder);
  }

  return router;
}

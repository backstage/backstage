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

import { errorHandler } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import fetch from 'cross-fetch';
import SmeeClient from 'smee-client';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const callback = config.getString(
    'integrations.githubApp.installation.callbackUrl',
  );

  if (callback.startsWith('https://smee')) {
    const client = new SmeeClient({
      source: callback,
      target: 'http://localhost:7000/api/github-app/events',
      logger: console,
    });
    client.start();
  }

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });
  router.use(errorHandler());
  router.post('/events', async ({ body }, response) => {
    if (body.action === 'created') {
      console.warn(
        'app install event lets create a new app for auth in the app',
      );

      console.warn(body);
    }

    response.send({});
  });
  router.get('/install/callback', async ({ query }, response) => {
    const { code } = query;

    const conversion = await fetch(
      `https://api.github.com/app-manifests/${code}/conversions`,
      { method: 'post' },
    ).then(r => r.json());

    console.warn(conversion);

    const {
      // id,
      // client_id: clientId,
      // client_secret: clientSecret,
      // webhook_secret: webhookSecret,
      // pem,
      html_url: htmlUrl,
    } = conversion;

    response.redirect(302, `${htmlUrl}/installations/new`);
    // response.send({ woo: conversion });
  });
  return router;
}

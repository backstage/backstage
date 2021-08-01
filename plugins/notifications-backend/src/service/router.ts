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
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { RouterOptions } from '../types';

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;
  logger.info('In notifications service');
  const router = Router();
  router.use(express.json());

  const notificationsManager = new NotificationsManager(options);

  router.get('/ping', async (_request, response) => {
    notificationsManager.sendMessages(5);
    response.send('pong');
  });

  router.get('/user/:id', async (request, response) => {
    const { id } = request.params;
    const notificationsResponse = [
      {
        message:
          'Backstage build for PR #234 is complete. <a href="#">View logs here</a>.',
        type: 'success',
        timestamp: 1627561639922,
      },
      {
        message:
          'Backstage deployment for commit 00bd21 failed. <a href="#">View logs here</a>',
        type: 'failure',
        timestamp: 1627561639922,
      },
      {
        message:
          'A new component "backstage-backend" is being scaffolded. Should take 10 mins to complete.',
        type: 'inprogress',
        timestamp: 1623051991000,
      },
      {
        message:
          'A new build for Backstage #235 is queued. <a href="#">Track status here</a>',
        type: 'waiting',
        timestamp: 1624222010000,
      },
      {
        message:
          'A new component "backstage-cache" has been added to your squad. <a href="#">Got to overview</a>.',
        type: 'success',
        timestamp: 1620679610000,
      },
    ];
    response.send(notificationsResponse);
  });

  router.use(errorHandler());
  return router;
}

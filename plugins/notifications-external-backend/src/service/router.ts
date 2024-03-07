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
import Router from 'express-promise-router';
import { errorHandler } from '@backstage/backend-common';
import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { NotificationService } from '@backstage/plugin-notifications-node';
import { validatePayload, validateRecipients } from './validation';

export interface RouterOptions {
  config: RootConfigService;
  logger: LoggerService;
  notificationService: NotificationService;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, notificationService } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('Notifications-external-backend is running.');
    response.json({ status: 'ok' });
  });

  // TODO:
  // curl -X POST http://localhost:7007/api/notifications-external -H "Content-Type: application/json" -H "notifications-secret: mysecret" -d '{"recipients":{"type":"entity", "entityRef": "user:development/guest"}, "payload":{"title": "External notification - 01"}}'

  // Send notification
  router.post('/', async (req, response) => {
    // TODO: do shared-secret auth

    // validate input before passing it to the service
    const recipients = validateRecipients(req.body.recipients);
    if (!recipients) {
      response.status(422).send('Incorrect format of recipients.');
      return;
    }

    const payload = validatePayload(req.body.payload);
    if (!payload) {
      response.status(422).send('Incorrect format of payload.');
      return;
    }

    logger.debug('Forwarding external request to send notification');
    // The "origin" will be uniformly set to this service
    await notificationService.send({
      recipients,
      payload,
    });

    response.json({ status: 'done' });
  });

  router.use(errorHandler());
  return router;
}

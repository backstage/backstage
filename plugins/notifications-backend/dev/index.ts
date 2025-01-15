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

import { createBackend } from '@backstage/backend-defaults';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { notificationService } from '@backstage/plugin-notifications-node';
import {
  notificationSeverities,
  NotificationSeverity,
} from '@backstage/plugin-notifications-common';
import express, { Response } from 'express';
import Router from 'express-promise-router';

const randomSeverity = (): NotificationSeverity => {
  return notificationSeverities[
    Math.floor(Math.random() * notificationSeverities.length)
  ];
};

const notificationTitles = [
  'You have a new notification',
  'Scaffolder task ended',
  'Your entity has some issues',
];
const randomTitle = (): string => {
  return notificationTitles[
    Math.floor(Math.random() * notificationTitles.length)
  ];
};

const notificationDescriptions = [
  'There is a problem in the backstage',
  'See the sound engineer, please',
  undefined,
];
const randomDescription = (): string | undefined => {
  return notificationDescriptions[
    Math.floor(Math.random() * notificationDescriptions.length)
  ];
};

const notificationTopics = ['Scaffolder', 'Backstage', 'Entity', undefined];
const randomTopic = (): string | undefined => {
  return notificationTopics[
    Math.floor(Math.random() * notificationTopics.length)
  ];
};

const notificationLinks = ['/catalog', '/create/tasks/123456', undefined];
const randomLink = (): string | undefined => {
  return notificationLinks[
    Math.floor(Math.random() * notificationLinks.length)
  ];
};

const notificationsDebug = createBackendPlugin({
  pluginId: 'notifications-debug',
  register(env) {
    env.registerInit({
      deps: {
        notifications: notificationService,
        httpRouter: coreServices.httpRouter,
      },
      async init({ notifications, httpRouter }) {
        const router = Router();
        router.use(express.json());
        router.post('/', async (_, res: Response<unknown>) => {
          await notifications.send({
            recipients: {
              type: 'broadcast',
            },
            payload: {
              title: randomTitle(),
              description: randomDescription(),
              topic: randomTopic(),
              link: randomLink(),
              severity: randomSeverity(),
            },
          });
          res.status(200).send({ status: 'ok' });
        });

        httpRouter.use(router);
        httpRouter.addAuthPolicy({
          path: '/',
          allow: 'unauthenticated',
        });
      },
    });
  },
});

const backend = createBackend();
backend.add(import('@backstage/plugin-events-backend'));
backend.add(import('@backstage/plugin-signals-backend'));
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('../src'));
backend.add(notificationsDebug);

backend.start();

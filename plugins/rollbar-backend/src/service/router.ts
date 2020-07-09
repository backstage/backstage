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
import { Logger } from 'winston';
import Router from 'express-promise-router';
import express from 'express';
import { RollbarApi } from '../api';

export interface RouterOptions {
  rollbarApi?: RollbarApi;
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const logger = options.logger.child({ plugin: 'rollbar' });
  const accessToken = !options.rollbarApi ? getRollbarToken(logger) : '';

  if (options.rollbarApi || accessToken) {
    const rollbarApi =
      options.rollbarApi || new RollbarApi(accessToken, logger);

    router.use(express.json());

    const runAsync = createRunAsyncWrapper(logger);

    router.get(
      '/projects',
      runAsync(async (_req, res) => {
        const projects = await rollbarApi.getAllProjects();
        res.status(200).header('').send(projects);
      }),
    );

    router.get(
      '/projects/:id',
      runAsync(async (req, res) => {
        const { id } = req.params;
        const projects = await rollbarApi.getProject(id);
        res.status(200).send(projects);
      }),
    );

    router.get(
      '/projects/:id/items',
      runAsync(async (req, res) => {
        const { id } = req.params;
        const projects = await rollbarApi.getProjectItems(id);
        res.status(200).send(projects);
      }),
    );

    router.get(
      '/projects/:id/top_active_items',
      runAsync(async (req, res) => {
        const { id } = req.params;
        const query = req.query;
        const items = await rollbarApi.getTopActiveItems(id, query as any);
        res.status(200).send(items);
      }),
    );

    router.get(
      '/projects/:id/occurance_counts',
      runAsync(async (req, res) => {
        const { id } = req.params;
        const query = req.query;
        const items = await rollbarApi.getOccuranceCounts(id, query as any);
        res.status(200).send(items);
      }),
    );

    router.get(
      '/projects/:id/activated_item_counts',
      runAsync(async (req, res) => {
        const { id } = req.params;
        const query = req.query;
        const items = await rollbarApi.getActivatedCounts(id, query as any);
        res.status(200).send(items);
      }),
    );
  }

  router.use(errorHandler());

  return router;
}

function createRunAsyncWrapper(logger: Logger) {
  return function runAsyncWrapper(callback: express.RequestHandler) {
    return function runAsync(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) {
      return Promise.resolve(callback(req, res, next)).catch(error => {
        logger.error(error);
        next(error);
      });
    };
  };
}

function getRollbarToken(logger: Logger) {
  const token = process.env.ROLLBAR_TOKEN || '';

  if (!token) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error(
        'Rollbar token must be provided in ROLLBAR_TOKEN environment variable to start the API.',
      );
    }
    logger.warn(
      'Failed to initialize rollbar backend, set ROLLBAR_TOKEN environment variable to start the API.',
    );
  }

  return token;
}

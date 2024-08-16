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
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import {
  HttpRouterService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import { GitlabDiscoveryEntityProvider } from '../providers';
import * as uuid from 'uuid';

export interface RouterOptions {
  httpRouter: HttpRouterService;
  logger: LoggerService;
  config: Config;
  providers: GitlabDiscoveryEntityProvider[];
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;

  const router = Router();
  router.use(express.json());

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());

  /**
   * This route provided primarily to enable testing of your Gitlab instance to manage load. If you are having issues
   * with Gitlab going down, you may need to adjust the throttle of how often and how quickly you hit Gitlab and this
   * can be used to manually trigger a discovery.
   *
   * You can run this by hitting /api/catalog/gitlab/discover and passing an Authorization header.
   */
  router.get(
    '/gitlab/discover',
    async function (_req: Request, res: Response): Promise<any> {
      options.logger.info(
        'START running manually triggered Gitlab catalog indexing',
      );

      const log = logger.child({
        class: GitlabDiscoveryEntityProvider.prototype.constructor.name,
        taskId: 'manual-trigger-gitlab-discover',
        taskInstanceId: uuid.v4(),
      });

      options.providers[0].refresh(log).then(() => {
        options.logger.info(
          'FINISH running manually triggered Gitlab catalog indexing',
        );
      });

      return res.json({ running: true });
    },
  );

  options.httpRouter.use(router);

  return router;
}

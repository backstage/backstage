/*
 * Copyright 2022 The Backstage Authors
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
import {
  AuthorizeResult,
  BasicPermission,
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import {
  devToolsConfigReadPermission,
  devToolsExternalDependenciesReadPermission,
  devToolsInfoReadPermission,
  devToolsTasksReadPermission,
} from '@backstage/plugin-devtools-common';

import { Config } from '@backstage/config';
import { DevToolsBackendApi } from '../api';
import { Logger } from 'winston';
import { ForwardedError, InputError, NotAllowedError } from '@backstage/errors';
import Router from 'express-promise-router';
import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { PluginTaskScheduler } from '@backstage/backend-tasks';

/** @public */
export interface RouterOptions {
  devToolsBackendApi?: DevToolsBackendApi;
  logger: Logger;
  config: Config;
  permissions: PermissionEvaluator;
  taskSchedulers?: PluginTaskScheduler[];
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, permissions, taskSchedulers } = options;

  const devToolsBackendApi =
    options.devToolsBackendApi || new DevToolsBackendApi(logger, config);

  const allTasks = (
    await Promise.all(
      taskSchedulers?.map(async scheduler =>
        (
          await scheduler.getScheduledTasks()
        ).map(t => ({ ...t, scheduler: scheduler.pluginId })),
      ) ?? [],
    )
  ).flat();

  const router = Router();
  router.use(express.json());

  const getPermissionDecision = async (
    req: express.Request<unknown>,
    permission: BasicPermission,
  ) => {
    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );

    return (
      await permissions.authorize([{ permission }], {
        token,
      })
    )[0];
  };

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.get('/info', async (req, response) => {
    const decision = await getPermissionDecision(
      req,
      devToolsInfoReadPermission,
    );

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const info = await devToolsBackendApi.listInfo();

    response.status(200).json(info);
  });

  router.get('/config', async (req, response) => {
    const decision = await getPermissionDecision(
      req,
      devToolsConfigReadPermission,
    );

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const configList = await devToolsBackendApi.listConfig();

    response.status(200).json(configList);
  });

  router.get('/external-dependencies', async (req, response) => {
    const decision = await getPermissionDecision(
      req,
      devToolsExternalDependenciesReadPermission,
    );

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const health = await devToolsBackendApi.listExternalDependencyDetails();

    response.status(200).json(health);
  });

  router.get('/tasks', async (req, response) => {
    const decision = await getPermissionDecision(
      req,
      devToolsTasksReadPermission,
    );

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    return response.status(200).json(allTasks);
  });

  router.post('/tasks/:scheduler/:task', async (req, response) => {
    const decision = await getPermissionDecision(
      req,
      devToolsTasksReadPermission,
    );

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const { scheduler, task } = req.params;
    if (!task || !scheduler) {
      throw new InputError('Invalid task or scheduler given');
    }

    const schedulerInstance = taskSchedulers?.find(
      s => s.pluginId === scheduler,
    );

    if (!schedulerInstance) {
      throw new InputError('Invalid scheduler given');
    }

    try {
      await schedulerInstance.triggerTask(task);
      return response.status(200).json({ status: 'ok' });
    } catch (e) {
      throw new ForwardedError('Failed to run task', e);
    }
  });

  router.use(errorHandler());
  return router;
}

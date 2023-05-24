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
  PermissionEvaluator,
} from '@backstage/plugin-permission-common';
import {
  devToolsConfigReadPermission,
  devToolsExternalDependenciesReadPermission,
  devToolsInfoReadPermission,
  devToolsPermissions,
} from '@backstage/plugin-devtools-common';

import { Config } from '@backstage/config';
import { DevToolsBackendApi } from '../api';
import { Logger } from 'winston';
import { NotAllowedError } from '@backstage/errors';
import Router from 'express-promise-router';
import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';

/** @public */
export interface RouterOptions {
  devToolsBackendApi?: DevToolsBackendApi;
  logger: Logger;
  config: Config;
  permissions: PermissionEvaluator;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, permissions } = options;

  const devToolsBackendApi =
    options.devToolsBackendApi || new DevToolsBackendApi(logger, config);

  const router = Router();
  router.use(express.json());
  router.use(
    createPermissionIntegrationRouter({
      permissions: devToolsPermissions,
    }),
  );

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.get('/info', async (req, response) => {
    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );

    const decision = (
      await permissions.authorize(
        [{ permission: devToolsInfoReadPermission }],
        {
          token,
        },
      )
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const info = await devToolsBackendApi.listInfo();

    response.status(200).json(info);
  });

  router.get('/config', async (req, response) => {
    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );

    const decision = (
      await permissions.authorize(
        [{ permission: devToolsConfigReadPermission }],
        {
          token,
        },
      )
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const configList = await devToolsBackendApi.listConfig();

    response.status(200).json(configList);
  });

  router.get('/external-dependencies', async (req, response) => {
    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );

    const decision = (
      await permissions.authorize(
        [{ permission: devToolsExternalDependenciesReadPermission }],
        {
          token,
        },
      )
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const health = await devToolsBackendApi.listExternalDependencyDetails();

    response.status(200).json(health);
  });

  router.use(errorHandler());
  return router;
}

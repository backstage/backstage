/*
 * Copyright 2021 The Backstage Authors
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

import express, { Response } from 'express';
import { Logger } from 'winston';
import {
  errorHandler,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import {
  BackstageIdentityResponse,
  IdentityApi,
} from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  EvaluatePermissionResponse,
  EvaluatePermissionRequest,
  IdentifiedPermissionMessage,
  EvaluatePermissionResponseBatch,
  isResourcePermission,
} from '@backstage/plugin-permission-common';
import {
  ApplyConditionsRequestEntry,
  ApplyConditionsResponseEntry,
  PermissionPolicy,
} from '@backstage/plugin-permission-node';
import { PermissionIntegrationClient } from './PermissionIntegrationClient';
import { memoize } from 'lodash';
import DataLoader from 'dataloader';
import { Config } from '@backstage/config';
import { createOpenApiRouter } from '../schema/openapi.generated';

/**
 * Options required when constructing a new {@link express#Router} using
 * {@link createRouter}.
 *
 * @public
 */
export interface RouterOptions {
  logger: Logger;
  discovery: PluginEndpointDiscovery;
  policy: PermissionPolicy;
  identity: IdentityApi;
  config: Config;
}

const handleRequest = async (
  requests: IdentifiedPermissionMessage<EvaluatePermissionRequest>[],
  user: BackstageIdentityResponse | undefined,
  policy: PermissionPolicy,
  permissionIntegrationClient: PermissionIntegrationClient,
  authHeader?: string,
): Promise<IdentifiedPermissionMessage<EvaluatePermissionResponse>[]> => {
  const applyConditionsLoaderFor = memoize((pluginId: string) => {
    return new DataLoader<
      ApplyConditionsRequestEntry,
      ApplyConditionsResponseEntry
    >(batch =>
      permissionIntegrationClient.applyConditions(pluginId, batch, authHeader),
    );
  });

  return Promise.all(
    requests.map(({ id, resourceRef, ...request }) =>
      policy.handle(request, user).then(decision => {
        if (decision.result !== AuthorizeResult.CONDITIONAL) {
          return {
            id,
            ...decision,
          };
        }

        if (!isResourcePermission(request.permission)) {
          throw new Error(
            `Conditional decision returned from permission policy for non-resource permission ${request.permission.name}`,
          );
        }

        if (decision.resourceType !== request.permission.resourceType) {
          throw new Error(
            `Invalid resource conditions returned from permission policy for permission ${request.permission.name}`,
          );
        }

        if (!resourceRef) {
          return {
            id,
            ...decision,
          };
        }

        return applyConditionsLoaderFor(decision.pluginId).load({
          id,
          resourceRef,
          ...decision,
        });
      }),
    ),
  );
};

/**
 * Creates a new {@link express#Router} which provides the backend API
 * for the permission system.
 *
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { policy, discovery, identity, config, logger } = options;

  if (!config.getOptionalBoolean('permission.enabled')) {
    logger.warn(
      'Permission backend started with permissions disabled. Enable permissions by setting permission.enabled=true.',
    );
  }

  const permissionIntegrationClient = new PermissionIntegrationClient({
    discovery,
  });

  const router = await createOpenApiRouter();

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  router.post(
    '/authorize',
    async (req, res: Response<EvaluatePermissionResponseBatch>) => {
      const user = await identity.getIdentity({ request: req });

      const { body } = req;

      res.json({
        items: await handleRequest(
          body.items,
          user,
          policy,
          permissionIntegrationClient,
          req.header('authorization'),
        ),
      });
    },
  );

  router.use(errorHandler());

  return router;
}

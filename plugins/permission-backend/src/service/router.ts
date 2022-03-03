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

import { z } from 'zod';
import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  errorHandler,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import {
  getBearerTokenFromAuthorizationHeader,
  BackstageIdentityResponse,
  IdentityClient,
} from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  AuthorizeDecision,
  AuthorizeQuery,
  Identified,
  AuthorizeRequest,
  AuthorizeResponse,
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

const querySchema: z.ZodSchema<Identified<AuthorizeQuery>> = z.object({
  id: z.string(),
  resourceRef: z.string().optional(),
  permission: z.object({
    name: z.string(),
    resourceType: z.string().optional(),
    attributes: z.object({
      action: z
        .union([
          z.literal('create'),
          z.literal('read'),
          z.literal('update'),
          z.literal('delete'),
        ])
        .optional(),
    }),
  }),
});

const requestSchema: z.ZodSchema<AuthorizeRequest> = z.object({
  items: z.array(querySchema),
});

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
  identity: IdentityClient;
  config: Config;
}

const handleRequest = async (
  requests: Identified<AuthorizeQuery>[],
  user: BackstageIdentityResponse | undefined,
  policy: PermissionPolicy,
  permissionIntegrationClient: PermissionIntegrationClient,
  authHeader?: string,
): Promise<Identified<AuthorizeDecision>[]> => {
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

        if (!('resourceType' in request.permission)) {
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

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    response.send({ status: 'ok' });
  });

  router.post(
    '/authorize',
    async (
      req: Request<AuthorizeRequest>,
      res: Response<AuthorizeResponse>,
    ) => {
      const token = getBearerTokenFromAuthorizationHeader(
        req.header('authorization'),
      );
      const user = token ? await identity.authenticate(token) : undefined;

      const parseResult = requestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new InputError(parseResult.error.toString());
      }

      const body = parseResult.data;

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

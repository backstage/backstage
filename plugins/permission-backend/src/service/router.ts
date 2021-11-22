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

import {
  errorHandler,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  BackstageIdentity,
  IdentityClient,
} from '@backstage/plugin-auth-backend';
import { ConflictError } from '@backstage/errors';
import {
  AuthorizeResult,
  AuthorizeResponse,
  AuthorizeRequest,
  Identified,
} from '@backstage/plugin-permission-common';
import { PermissionPolicy } from '@backstage/plugin-permission-node';
import { PermissionIntegrationClient } from './PermissionIntegrationClient';

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
}

const handleRequest = async (
  { id, resourceRef, ...request }: Identified<AuthorizeRequest>,
  user: BackstageIdentity | undefined,
  policy: PermissionPolicy,
  permissionIntegrationClient: PermissionIntegrationClient,
  authHeader?: string,
): Promise<Identified<AuthorizeResponse>> => {
  const response = await policy.handle(request, user);

  if (response.result === AuthorizeResult.CONDITIONAL) {
    // Sanity check that any resource provided matches the one expected by the permission
    if (request.permission.resourceType !== response.conditions.resourceType) {
      throw new ConflictError(
        `Invalid resource conditions returned from permission policy for permission ${request.permission.name}`,
      );
    }

    if (resourceRef) {
      return {
        id,
        ...(await permissionIntegrationClient.applyConditions(
          resourceRef,
          response.conditions,
          authHeader,
        )),
      };
    }

    return {
      id,
      result: AuthorizeResult.CONDITIONAL,
      conditions: response.conditions.conditions,
    };
  }

  return { id, ...response };
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
  const { policy, discovery } = options;

  const identity = new IdentityClient({
    discovery,
    issuer: await discovery.getExternalBaseUrl('auth'),
  });

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
      req: Request<Identified<AuthorizeRequest>[]>,
      res: Response<Identified<AuthorizeResponse>[]>,
    ) => {
      const token = IdentityClient.getBearerToken(req.header('authorization'));
      const user = token ? await identity.authenticate(token) : undefined;

      const body: Identified<AuthorizeRequest>[] = req.body;

      res.json(
        await Promise.all(
          body.map(request =>
            handleRequest(
              request,
              user,
              policy,
              permissionIntegrationClient,
              req.header('authorization'),
            ),
          ),
        ),
      );
    },
  );

  router.use(errorHandler());
  return router;
}

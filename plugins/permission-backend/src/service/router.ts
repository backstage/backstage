/*
 * Copyright 2020 The Backstage Authors
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
  SingleHostDiscovery,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import fetch from 'cross-fetch';
import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import {
  BackstageIdentity,
  IdentityClient,
} from '@backstage/plugin-auth-backend';
import { Config } from '@backstage/config';
import { ConflictError, ResponseError } from '@backstage/errors';
import {
  Permission,
  AuthorizeResult,
  AuthorizeResponse,
  AuthorizeRequest,
  AuthorizeRequestJSON,
  Identified,
  PermissionCondition,
  PermissionCriteria,
  DefinitiveAuthorizeResult,
} from '@backstage/permission-common';
import {
  ApplyConditionsRequest,
  PermissionPolicy,
} from '@backstage/plugin-permission-node';

export interface RouterOptions {
  logger: Logger;
  config: Config;
  policy: PermissionPolicy;
}

// TODO(authorization-framework) probably move this to a separate client
const applyConditions = async (
  resourceRef: string,
  conditions: {
    pluginId: string;
    resourceType: string;
    conditions: PermissionCriteria<PermissionCondition>;
  },
  discoveryApi: PluginEndpointDiscovery,
  authHeader?: string,
): Promise<DefinitiveAuthorizeResult> => {
  const endpoint = `${await discoveryApi.getBaseUrl(
    conditions.pluginId,
  )}/permissions/apply-conditions`;

  const request: ApplyConditionsRequest = {
    resourceRef,
    resourceType: conditions.resourceType,
    conditions: conditions.conditions,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: {
      ...(authHeader ? { authorization: authHeader } : {}),
      'content-type': 'application/json',
    },
  });

  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }

  // TODO(authorization-framework) validate response
  return (await response.json()) as DefinitiveAuthorizeResult;
};

const handleRequest = async (
  { id, resourceRef, ...request }: Identified<AuthorizeRequest>,
  user: BackstageIdentity | undefined,
  policy: PermissionPolicy,
  discoveryApi: PluginEndpointDiscovery,
  authHeader?: string,
): Promise<Identified<AuthorizeResponse>> => {
  const response = await policy.handle(request, user);

  if (response.result === AuthorizeResult.MAYBE) {
    // Sanity check that any resource provided matches the one expected by the permission
    if (!request.permission.supportsType(response.conditions.resourceType)) {
      throw new ConflictError(
        `Invalid resource conditions returned from permission handler for permission ${request.permission.name}`,
      );
    }

    // TODO(authorization-framework): as of right now, the apply-filters endpoint
    // receives a Filters shape - it seems worth exploring instead sending it a
    // flat array of filters and mapping them back onto the filters object. Otherwise
    // we're giving control of the shape of the filters to the endpoint unnecessarily.

    if (resourceRef) {
      return {
        id,
        ...(await applyConditions(
          resourceRef,
          response.conditions,
          discoveryApi,
          authHeader,
        )),
      };
    }

    return {
      id,
      result: AuthorizeResult.MAYBE,
      conditions: response.conditions.conditions,
    };
  }

  return { id, ...response };
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config, policy } = options;
  const discovery = SingleHostDiscovery.fromConfig(config);
  const identity = new IdentityClient({
    discovery,
    issuer: await discovery.getExternalBaseUrl('auth'),
  });

  const router = Router();
  router.use(express.json());

  router.post(
    '/authorize',
    async (
      req: Request<Identified<AuthorizeRequestJSON>[]>,
      res: Response<Identified<AuthorizeResponse>[]>,
    ) => {
      // TODO(mtlewis/orkohunter): Payload too large errors happen when internal backends (techdocs, search, etc.) try
      // to fetch all of entities.
      // Fix1: The request should only contain entity refs instead of full entity.
      // Fix2: We should probably not filter requests from other backends -
      // either by allowing them a superuser token or treating their requests separately from a user's request.
      const token = IdentityClient.getBearerToken(req.header('authorization'));
      const user = token ? await identity.authenticate(token) : undefined;

      const body: Identified<AuthorizeRequestJSON>[] = req.body;
      const authorizeRequests = body.map(({ permission, ...rest }) => ({
        ...rest,
        permission: Permission.fromJSON(permission),
      }));

      // TODO(timbonicus/joeporpeglia): wire up frontend to supply id, accept array of permission requests
      res.json(
        await Promise.all(
          authorizeRequests.map(request =>
            handleRequest(
              request,
              user,
              policy,
              discovery,
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

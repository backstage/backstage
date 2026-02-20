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

import express from 'express';
import { InputError } from '@backstage/errors';
import { IdentityApi } from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  isResourcePermission,
} from '@backstage/plugin-permission-common';
import {
  ApplyConditionsRequestEntry,
  ApplyConditionsResponseEntry,
  PermissionPolicy,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { PermissionIntegrationClient } from './PermissionIntegrationClient';
import { memoize } from 'lodash';
import DataLoader from 'dataloader';
import {
  AuthService,
  BackstageCredentials,
  BackstageNonePrincipal,
  BackstageUserPrincipal,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
  RootConfigService,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { createOpenApiRouter } from '../schema/openapi';
import {
  EvaluatePermissionRequest,
  ResourcePermissionRequest,
} from '../schema/openapi/generated/models';

function isResourcePermissionRequest(
  request: EvaluatePermissionRequest,
): request is ResourcePermissionRequest {
  return isResourcePermission(request.permission);
}

/**
 * Options required when constructing a new {@link express#Router} using
 * {@link createRouter}.
 *
 * @internal
 */
export interface RouterOptions {
  logger: LoggerService;
  discovery: DiscoveryService;
  policy: PermissionPolicy;
  identity?: IdentityApi;
  config: RootConfigService;
  auth: AuthService;
  httpAuth: HttpAuthService;
  userInfo: UserInfoService;
}

const handleRequest = async (
  requests: EvaluatePermissionRequest[],
  policy: PermissionPolicy,
  permissionIntegrationClient: PermissionIntegrationClient,
  credentials: BackstageCredentials<
    BackstageNonePrincipal | BackstageUserPrincipal
  >,
  auth: AuthService,
  userInfo: UserInfoService,
) => {
  const applyConditionsLoaderFor = memoize((pluginId: string) => {
    return new DataLoader<
      ApplyConditionsRequestEntry,
      ApplyConditionsResponseEntry
    >(batch =>
      permissionIntegrationClient.applyConditions(pluginId, credentials, batch),
    );
  });

  let user: PolicyQueryUser | undefined;
  if (auth.isPrincipal(credentials, 'user')) {
    const info = await userInfo.getUserInfo(credentials);
    const { token } = await auth.getPluginRequestToken({
      onBehalfOf: credentials,
      targetPluginId: 'catalog', // TODO: unknown at this point
    });
    user = {
      identity: {
        type: 'user',
        userEntityRef: credentials.principal.userEntityRef,
        ownershipEntityRefs: info.ownershipEntityRefs,
      },
      token,
      credentials,
      info,
    };
  }

  return Promise.all(
    requests.map(request =>
      policy
        .handle({ permission: request.permission }, user)
        .then(async decision => {
          if (decision.result !== AuthorizeResult.CONDITIONAL) {
            return {
              id: request.id,
              ...decision,
            };
          }

          if (!isResourcePermissionRequest(request)) {
            throw new Error(
              `Conditional decision returned from permission policy for non-resource permission ${request.permission.name}`,
            );
          }

          if (decision.resourceType !== request.permission.resourceType) {
            throw new Error(
              `Invalid resource conditions returned from permission policy for permission ${request.permission.name}`,
            );
          }

          if (!request.resourceRef) {
            return {
              id: request.id,
              ...decision,
            };
          }

          return applyConditionsLoaderFor(decision.pluginId).load({
            id: request.id,
            resourceRef: request.resourceRef,
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
 * @internal
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { policy, discovery, config, logger, auth, httpAuth, userInfo } =
    options;

  if (!config.getOptionalBoolean('permission.enabled')) {
    logger.warn(
      'Permission backend started with permissions disabled. Enable permissions by setting permission.enabled=true.',
    );
  }

  const disabledDefaultAuthPolicy =
    config.getOptionalBoolean(
      'backend.auth.dangerouslyDisableDefaultAuthPolicy',
    ) ?? false;

  const permissionIntegrationClient = new PermissionIntegrationClient({
    discovery,
    auth,
  });

  const router = await createOpenApiRouter();

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  router.post('/authorize', async (req, res) => {
    const credentials = await httpAuth.credentials(req, {
      allow: ['user', 'none'],
    });

    const body = req.body;

    if (
      (auth.isPrincipal(credentials, 'none') && !disabledDefaultAuthPolicy) ||
      (auth.isPrincipal(credentials, 'user') && !credentials.principal.actor)
    ) {
      if (
        body.items.some(r => isResourcePermissionRequest(r) && !r.resourceRef)
      ) {
        throw new InputError(
          'Resource permissions require a resourceRef to be set. Direct user requests without a resourceRef are not allowed.',
        );
      }
    }

    res.json({
      items: await handleRequest(
        body.items,
        policy,
        permissionIntegrationClient,
        credentials,
        auth,
        userInfo,
      ),
    });
  });

  return router;
}

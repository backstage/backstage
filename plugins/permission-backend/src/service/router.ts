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
import { createLegacyAuthAdapters } from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import { IdentityApi } from '@backstage/plugin-auth-node';
import {
  AuthorizeResult,
  EvaluatePermissionRequest,
  EvaluatePermissionRequestBatch,
  EvaluatePermissionResponse,
  EvaluatePermissionResponseBatch,
  IdentifiedPermissionMessage,
  isResourcePermission,
  PermissionAttributes,
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

const attributesSchema: z.ZodSchema<PermissionAttributes> = z.object({
  action: z
    .union([
      z.literal('create'),
      z.literal('read'),
      z.literal('update'),
      z.literal('delete'),
    ])
    .optional(),
});

const permissionSchema = z.union([
  z.object({
    type: z.literal('basic'),
    name: z.string(),
    attributes: attributesSchema,
  }),
  z.object({
    type: z.literal('resource'),
    name: z.string(),
    attributes: attributesSchema,
    resourceType: z.string(),
  }),
]);

const evaluatePermissionRequestSchema: z.ZodSchema<
  IdentifiedPermissionMessage<EvaluatePermissionRequest>
> = z.object({
  id: z.string(),
  resourceRef: z.string().optional(),
  permission: permissionSchema,
});

const evaluatePermissionRequestBatchSchema: z.ZodSchema<EvaluatePermissionRequestBatch> =
  z.object({
    items: z.array(evaluatePermissionRequestSchema),
  });

/**
 * Options required when constructing a new {@link express#Router} using
 * {@link createRouter}.
 *
 * @public
 * @deprecated Please migrate to the new backend system as this will be removed in the future.
 */
export interface RouterOptions {
  logger: LoggerService;
  discovery: DiscoveryService;
  policy: PermissionPolicy;
  identity?: IdentityApi;
  config: RootConfigService;
  auth?: AuthService;
  httpAuth?: HttpAuthService;
  userInfo?: UserInfoService;
}

const handleRequest = async (
  requests: IdentifiedPermissionMessage<EvaluatePermissionRequest>[],
  policy: PermissionPolicy,
  permissionIntegrationClient: PermissionIntegrationClient,
  credentials: BackstageCredentials<
    BackstageNonePrincipal | BackstageUserPrincipal
  >,
  auth: AuthService,
  userInfo: UserInfoService,
): Promise<IdentifiedPermissionMessage<EvaluatePermissionResponse>[]> => {
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
 * @deprecated Please migrate to the new backend system as this will be removed in the future.
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { policy, discovery, config, logger } = options;
  const { auth, httpAuth, userInfo } = createLegacyAuthAdapters(options);

  if (!config.getOptionalBoolean('permission.enabled')) {
    logger.warn(
      'Permission backend started with permissions disabled. Enable permissions by setting permission.enabled=true.',
    );
  }

  const permissionIntegrationClient = new PermissionIntegrationClient({
    discovery,
    auth,
  });

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  router.post(
    '/authorize',
    async (
      req: Request<EvaluatePermissionRequestBatch>,
      res: Response<EvaluatePermissionResponseBatch>,
    ) => {
      const credentials = await httpAuth.credentials(req, {
        allow: ['user', 'none'],
      });

      const parseResult = evaluatePermissionRequestBatchSchema.safeParse(
        req.body,
      );

      if (!parseResult.success) {
        throw new InputError(parseResult.error.toString());
      }

      const body = parseResult.data;

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
    },
  );

  return router;
}

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
import { omit } from 'lodash';
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
  isResourcePermission,
  PermissionAttributes,
  ResourcePermission,
  BasicPermission,
  Batch,
  PolicyQuery,
  DefinitivePolicyDecision,
  PolicyDecision,
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

const basicPermissionSchema: z.ZodSchema<BasicPermission> = z.object({
  type: z.literal('basic'),
  name: z.string(),
  attributes: attributesSchema,
});

const resourcePermissionSchema: z.ZodSchema<ResourcePermission> = z.object({
  type: z.literal('resource'),
  name: z.string(),
  attributes: attributesSchema,
  resourceType: z.string(),
});

const requestSchema = <T extends z.ZodSchema<any>>(
  itemSchema: T,
): z.ZodSchema<Batch<Identified<z.infer<T>>>> =>
  z.object({
    items: z.array(itemSchema),
  });

const authorizeRequestSchema: z.ZodSchema<Batch<Identified<AuthorizeQuery>>> =
  requestSchema(
    z.union([
      z.object({
        id: z.string(),
        permission: resourcePermissionSchema,
        resourceRef: z.string(),
      }),
      z.object({
        id: z.string(),
        permission: basicPermissionSchema,
        resourceRef: z.never().optional(),
      }),
    ]),
  );

const policyDecisionRequestSchema: z.ZodSchema<
  Batch<Identified<PolicyQuery<ResourcePermission>>>
> = requestSchema(
  z.object({
    id: z.string(),
    permission: resourcePermissionSchema,
    resourceRef: z.never().optional(),
  }),
);

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

const authenticate = async (req: Request<any>, identity: IdentityClient) => {
  const token = getBearerTokenFromAuthorizationHeader(
    req.header('authorization'),
  );
  const user = token ? await identity.authenticate(token) : undefined;

  return user;
};

const validateDecision = (query: PolicyQuery, decision: PolicyDecision) => {
  if (decision.result !== AuthorizeResult.CONDITIONAL) {
    return;
  }

  if (!isResourcePermission(query.permission)) {
    throw new Error(
      `Conditional decision returned from permission policy for non-resource permission ${query.permission.name}`,
    );
  }

  if (decision.resourceType !== query.permission.resourceType) {
    throw new Error(
      `Invalid resource conditions returned from permission policy for permission ${query.permission.name}`,
    );
  }
};

const runPolicy = async (
  queries: Identified<PolicyQuery>[],
  user: BackstageIdentityResponse | undefined,
  policy: PermissionPolicy,
): Promise<Identified<PolicyDecision>[]> => {
  return Promise.all(
    queries.map(query =>
      policy.handle(omit(query, 'id', 'resourceRef'), user).then(decision => {
        validateDecision(query, decision);
        return { id: query.id, ...decision };
      }),
    ),
  );
};

const applyConditions = async (
  queries: Identified<AuthorizeQuery>[],
  decisions: Identified<PolicyDecision>[],
  authHeader: string | undefined,
  permissionIntegrationClient: PermissionIntegrationClient,
): Promise<Identified<DefinitivePolicyDecision>[]> => {
  const applyConditionsLoaderFor = memoize((pluginId: string) => {
    return new DataLoader<
      ApplyConditionsRequestEntry,
      ApplyConditionsResponseEntry
    >(batch =>
      permissionIntegrationClient.applyConditions(pluginId, batch, authHeader),
    );
  });

  return Promise.all(
    decisions.map((decision, index) => {
      const query: Identified<AuthorizeQuery> = queries[index];

      if (decision.result !== AuthorizeResult.CONDITIONAL) {
        return decision;
      }

      if (!query.resourceRef) {
        // It's not encoded in the types we pass around, but this state isn't
        // reachable. We validate incoming queries to guarantee that all
        // authorizations for resource permissions include a resourceRef, and
        // then validate that all conditional decisions are for resource
        // permissions.
        throw new Error('Incomplete authorize query');
      }

      return applyConditionsLoaderFor(decision.pluginId).load({
        resourceRef: query.resourceRef,
        ...decision,
      });
    }),
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
      req: Request<Batch<Identified<AuthorizeQuery>>>,
      res: Response<Batch<Identified<AuthorizeDecision>>>,
    ) => {
      const user = await authenticate(req, identity);
      const parseResult = authorizeRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new InputError(parseResult.error.toString());
      }

      const { items: queries } = parseResult.data;

      res.json({
        items: await runPolicy(
          queries.map(query => omit(query, 'resourceRef')),
          user,
          policy,
        ).then(decisions =>
          applyConditions(
            queries,
            decisions,
            req.header('authorization'),
            permissionIntegrationClient,
          ),
        ),
      });
    },
  );

  router.post(
    '/policy-decision',
    async (
      req: Request<Batch<Identified<PolicyQuery>>>,
      res: Response<Batch<Identified<PolicyDecision>>>,
    ) => {
      const user = await authenticate(req, identity);
      const parseResult = policyDecisionRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new InputError(parseResult.error.toString());
      }

      const { items: queries } = parseResult.data;

      res.json({
        items: await runPolicy(queries, user, policy),
      });
    },
  );

  router.use(errorHandler());

  return router;
}

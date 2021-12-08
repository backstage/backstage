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

import express, { Response, Router } from 'express';
import { z } from 'zod';
import {
  AuthorizeResult,
  PermissionCondition,
  PermissionCriteria,
} from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';
import {
  createGetRule,
  isAndCriteria,
  isNotCriteria,
  isOrCriteria,
} from './util';

const permissionCriteriaSchema: z.ZodSchema<
  PermissionCriteria<PermissionCondition>
> = z.lazy(() =>
  z.union([
    z.object({ anyOf: z.array(permissionCriteriaSchema) }),
    z.object({ allOf: z.array(permissionCriteriaSchema) }),
    z.object({ not: permissionCriteriaSchema }),
    z.object({
      rule: z.string(),
      params: z.array(z.unknown()),
    }),
  ]),
);

const applyConditionsRequestSchema = z.object({
  resourceRef: z.string(),
  resourceType: z.string(),
  conditions: permissionCriteriaSchema,
});

/**
 * A request to load the referenced resource and apply conditions in order to
 * finalize a conditional authorization response.
 *
 * @public
 */
export type ApplyConditionsRequest = {
  resourceRef: string;
  resourceType: string;
  conditions: PermissionCriteria<PermissionCondition>;
};

/**
 * The result of applying the conditions, expressed as a definitive authorize
 * result of ALLOW or DENY.
 *
 * @public
 */
export type ApplyConditionsResponse = {
  result: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
};

const applyConditions = <TResource>(
  criteria: PermissionCriteria<PermissionCondition>,
  resource: TResource,
  getRule: (name: string) => PermissionRule<TResource, unknown>,
): boolean => {
  if (isAndCriteria(criteria)) {
    return criteria.allOf.every(child =>
      applyConditions(child, resource, getRule),
    );
  } else if (isOrCriteria(criteria)) {
    return criteria.anyOf.some(child =>
      applyConditions(child, resource, getRule),
    );
  } else if (isNotCriteria(criteria)) {
    return !applyConditions(criteria.not, resource, getRule);
  }

  return getRule(criteria.rule).apply(resource, ...criteria.params);
};

/**
 * Create an express Router which provides an authorization route to allow integration between the
 * permission backend and other Backstage backend plugins. Plugin owners that wish to support
 * conditional authorization for their resources should add the router created by this function
 * to their express app inside their `createRouter` implementation.
 *
 * @remarks
 *
 * To make this concrete, we can use the Backstage software catalog as an example. The catalog has
 * conditional rules around access to specific _entities_ in the catalog. The _type_ of resource is
 * captured here as `resourceType`, a string identifier (`catalog-entity` in this example) that can
 * be provided with permission definitions. This is merely a _type_ to verify that conditions in an
 * authorization policy are constructed correctly, not a reference to a specific resource.
 *
 * The `rules` parameter is an array of {@link PermissionRule}s that introduce conditional
 * filtering logic for resources; for the catalog, these are things like `isEntityOwner` or
 * `hasAnnotation`. Rules describe how to filter a list of resources, and the `conditions` returned
 * allow these rules to be applied with specific parameters (such as 'group:default/team-a', or
 * 'backstage.io/edit-url').
 *
 * The `getResource` argument should load a resource by reference. For the catalog, this is an
 * {@link @backstage/catalog-model#EntityRef}. For other plugins, this can be any serialized format.
 * This is used to construct the `createPermissionIntegrationRouter`, a function to add an
 * authorization route to your backend plugin. This route will be called by the `permission-backend`
 * when authorization conditions relating to this plugin need to be evaluated.
 *
 * @public
 */
export const createPermissionIntegrationRouter = <TResource>(options: {
  resourceType: string;
  rules: PermissionRule<TResource, any>[];
  getResource: (resourceRef: string) => Promise<TResource | undefined>;
}): Router => {
  const { resourceType, rules, getResource } = options;
  const router = Router();

  const getRule = createGetRule(rules);

  router.post(
    '/.well-known/backstage/permissions/apply-conditions',
    express.json(),
    async (
      req,
      res: Response<
        | {
            result: Omit<AuthorizeResult, AuthorizeResult.CONDITIONAL>;
          }
        | string
      >,
    ) => {
      const parseResult = applyConditionsRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).send(`Invalid request body.`);
      }

      const { data: body } = parseResult;

      if (body.resourceType !== resourceType) {
        return res
          .status(400)
          .send(`Unexpected resource type: ${body.resourceType}.`);
      }

      const resource = await getResource(body.resourceRef);

      if (!resource) {
        return res
          .status(400)
          .send(`Resource for ref ${body.resourceRef} not found.`);
      }

      return res.status(200).json({
        result: applyConditions(body.conditions, resource, getRule)
          ? AuthorizeResult.ALLOW
          : AuthorizeResult.DENY,
      });
    },
  );

  return router;
};

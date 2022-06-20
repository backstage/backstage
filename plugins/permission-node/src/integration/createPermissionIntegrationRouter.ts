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
import Router from 'express-promise-router';
import { z } from 'zod';
import { InputError } from '@backstage/errors';
import { errorHandler } from '@backstage/backend-common';
import {
  AuthorizeResult,
  DefinitivePolicyDecision,
  IdentifiedPermissionMessage,
  Permission,
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
    z.object({ anyOf: z.array(permissionCriteriaSchema).nonempty() }),
    z.object({ allOf: z.array(permissionCriteriaSchema).nonempty() }),
    z.object({ not: permissionCriteriaSchema }),
    z.object({
      rule: z.string(),
      resourceType: z.string(),
      params: z.array(z.unknown()),
    }),
  ]),
);

const applyConditionsRequestSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      resourceRef: z.string(),
      resourceType: z.string(),
      conditions: permissionCriteriaSchema,
    }),
  ),
});

/**
 * A request to load the referenced resource and apply conditions in order to
 * finalize a conditional authorization response.
 *
 * @public
 */
export type ApplyConditionsRequestEntry = IdentifiedPermissionMessage<{
  resourceRef: string;
  resourceType: string;
  conditions: PermissionCriteria<PermissionCondition>;
}>;

/**
 * A batch of {@link ApplyConditionsRequestEntry} objects.
 *
 * @public
 */
export type ApplyConditionsRequest = {
  items: ApplyConditionsRequestEntry[];
};

/**
 * The result of applying the conditions, expressed as a definitive authorize
 * result of ALLOW or DENY.
 *
 * @public
 */
export type ApplyConditionsResponseEntry =
  IdentifiedPermissionMessage<DefinitivePolicyDecision>;

/**
 * A batch of {@link ApplyConditionsResponseEntry} objects.
 *
 * @public
 */
export type ApplyConditionsResponse = {
  items: ApplyConditionsResponseEntry[];
};

const applyConditions = <TResourceType extends string, TResource>(
  criteria: PermissionCriteria<PermissionCondition<TResourceType>>,
  resource: TResource | undefined,
  getRule: (name: string) => PermissionRule<TResource, unknown, TResourceType>,
): boolean => {
  // If resource was not found, deny. This avoids leaking information from the
  // apply-conditions API which would allow a user to differentiate between
  // non-existent resources and resources to which they do not have access.
  if (resource === undefined) {
    return false;
  }

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
 * Prevent use of type parameter from contributing to type inference.
 *
 * https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-980401795
 * @ignore
 */
type NoInfer<T> = T extends infer S ? S : never;

/**
 * Create an express Router which provides an authorization route to allow
 * integration between the permission backend and other Backstage backend
 * plugins. Plugin owners that wish to support conditional authorization for
 * their resources should add the router created by this function to their
 * express app inside their `createRouter` implementation.
 *
 * @remarks
 *
 * To make this concrete, we can use the Backstage software catalog as an
 * example. The catalog has conditional rules around access to specific
 * _entities_ in the catalog. The _type_ of resource is captured here as
 * `resourceType`, a string identifier (`catalog-entity` in this example) that
 * can be provided with permission definitions. This is merely a _type_ to
 * verify that conditions in an authorization policy are constructed correctly,
 * not a reference to a specific resource.
 *
 * The `rules` parameter is an array of {@link PermissionRule}s that introduce
 * conditional filtering logic for resources; for the catalog, these are things
 * like `isEntityOwner` or `hasAnnotation`. Rules describe how to filter a list
 * of resources, and the `conditions` returned allow these rules to be applied
 * with specific parameters (such as 'group:default/team-a', or
 * 'backstage.io/edit-url').
 *
 * The `getResources` argument should load resources based on a reference
 * identifier. For the catalog, this is an
 * {@link @backstage/catalog-model#EntityRef}. For other plugins, this can be
 * any serialized format. This is used to construct the
 * `createPermissionIntegrationRouter`, a function to add an authorization route
 * to your backend plugin. This function will be called by the
 * `permission-backend` when authorization conditions relating to this plugin
 * need to be evaluated.
 *
 * @public
 */
export const createPermissionIntegrationRouter = <
  TResourceType extends string,
  TResource,
>(options: {
  resourceType: TResourceType;
  permissions?: Array<Permission>;
  // Do not infer value of TResourceType from supplied rules.
  // instead only consider the resourceType parameter, and
  // consider any rules whose resource type does not match
  // to be an error.
  rules: PermissionRule<TResource, any, NoInfer<TResourceType>>[];
  getResources: (
    resourceRefs: string[],
  ) => Promise<Array<TResource | undefined>>;
}): express.Router => {
  const { resourceType, permissions, rules, getResources } = options;
  const router = Router();
  router.use(express.json());

  router.get('/.well-known/backstage/permissions/metadata', (_, res) => {
    const serializableRules = rules.map(rule => ({
      name: rule.name,
      description: rule.description,
      resourceType: rule.resourceType,
      parameters: {
        count: rule.toQuery.length,
      },
    }));

    return res.json({ permissions, rules: serializableRules });
  });

  const getRule = createGetRule(rules);

  const assertValidResourceTypes = (
    requests: ApplyConditionsRequestEntry[],
  ) => {
    const invalidResourceTypes = requests
      .filter(request => request.resourceType !== resourceType)
      .map(request => request.resourceType);

    if (invalidResourceTypes.length) {
      throw new InputError(
        `Unexpected resource types: ${invalidResourceTypes.join(', ')}.`,
      );
    }
  };

  router.post(
    '/.well-known/backstage/permissions/apply-conditions',
    async (req, res: Response<ApplyConditionsResponse | string>) => {
      const parseResult = applyConditionsRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new InputError(parseResult.error.toString());
      }

      const body = parseResult.data;

      assertValidResourceTypes(body.items);

      const resourceRefs = Array.from(
        new Set(body.items.map(({ resourceRef }) => resourceRef)),
      );
      const resourceArray = await getResources(resourceRefs);
      const resources = resourceRefs.reduce((acc, resourceRef, index) => {
        acc[resourceRef] = resourceArray[index];

        return acc;
      }, {} as Record<string, TResource | undefined>);

      return res.json({
        items: body.items.map(request => ({
          id: request.id,
          result: applyConditions(
            request.conditions,
            resources[request.resourceRef],
            getRule,
          )
            ? AuthorizeResult.ALLOW
            : AuthorizeResult.DENY,
        })),
      });
    },
  );

  router.use(errorHandler());

  return router;
};

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
import zodToJsonSchema from 'zod-to-json-schema';
import { InputError } from '@backstage/errors';
import {
  AuthorizeResult,
  DefinitivePolicyDecision,
  IdentifiedPermissionMessage,
  MetadataResponse as CommonMetadataResponse,
  MetadataResponseSerializedRule as CommonMetadataResponseSerializedRule,
  Permission,
  PermissionCondition,
  PermissionCriteria,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';
import {
  NoInfer,
  createGetRule,
  isAndCriteria,
  isNotCriteria,
  isOrCriteria,
} from './util';
import { NotImplementedError } from '@backstage/errors';

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
      params: z.record(z.any()).optional(),
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

/**
 * Serialized permission rules, with the paramsSchema
 * converted from a ZodSchema to a JsonSchema.
 *
 * @public
 * @deprecated Please import from `@backstage/plugin-permission-common` instead.
 */
export type MetadataResponseSerializedRule =
  CommonMetadataResponseSerializedRule;

/**
 * Response type for the .metadata endpoint.
 *
 * @public
 * @deprecated Please import from `@backstage/plugin-permission-common` instead.
 */
export type MetadataResponse = CommonMetadataResponse;

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

  const rule = getRule(criteria.rule);
  const result = rule.paramsSchema?.safeParse(criteria.params);

  if (result && !result.success) {
    throw new InputError(`Parameters to rule are invalid`, result.error);
  }

  return rule.apply(resource, criteria.params ?? {});
};

/**
 * Takes some permission conditions and returns a definitive authorization result
 * on the resource to which they apply.
 *
 * @public
 */
export const createConditionAuthorizer = <TResource, TQuery>(
  rules: PermissionRule<TResource, TQuery, string>[],
) => {
  const getRule = createGetRule(rules);

  return (
    decision: PolicyDecision,
    resource: TResource | undefined,
  ): boolean => {
    if (decision.result === AuthorizeResult.CONDITIONAL) {
      return applyConditions(decision.conditions, resource, getRule);
    }

    return decision.result === AuthorizeResult.ALLOW;
  };
};

/**
 * Options for creating a permission integration router specific
 * for a particular resource type.
 *
 * @public
 */
export type CreatePermissionIntegrationRouterResourceOptions<
  TResourceType extends string,
  TResource,
> = {
  resourceType: TResourceType;
  permissions?: Array<Permission>;
  // Do not infer value of TResourceType from supplied rules.
  // instead only consider the resourceType parameter, and
  // consider any rules whose resource type does not match
  // to be an error.
  rules: PermissionRule<TResource, any, NoInfer<TResourceType>>[];
  getResources?: (
    resourceRefs: string[],
  ) => Promise<Array<TResource | undefined>>;
};

/**
 * Options for creating a permission integration router exposing
 * permissions and rules from multiple resource types.
 *
 * @public
 */
export type PermissionIntegrationRouterOptions<
  TResourceType1 extends string = string,
  TResource1 = any,
  TResourceType2 extends string = string,
  TResource2 = any,
  TResourceType3 extends string = string,
  TResource3 = any,
> = {
  resources: Readonly<
    | [
        CreatePermissionIntegrationRouterResourceOptions<
          TResourceType1,
          TResource1
        >,
      ]
    | [
        CreatePermissionIntegrationRouterResourceOptions<
          TResourceType1,
          TResource1
        >,
        CreatePermissionIntegrationRouterResourceOptions<
          TResourceType2,
          TResource2
        >,
      ]
    | [
        CreatePermissionIntegrationRouterResourceOptions<
          TResourceType1,
          TResource1
        >,
        CreatePermissionIntegrationRouterResourceOptions<
          TResourceType2,
          TResource2
        >,
        CreatePermissionIntegrationRouterResourceOptions<
          TResourceType3,
          TResource3
        >,
      ]
  >;
};

/**
 * Create an express Router which provides an authorization route to allow
 * integration between the permission backend and other Backstage backend
 * plugins. Plugin owners that wish to support conditional authorization for
 * their resources should add the router created by this function to their
 * express app inside their `createRouter` implementation.
 *
 * In case the `permissions` option is provided, the router also
 * provides a route that exposes permissions and routes of a plugin.
 *
 * In case resources is provided, the routes can handle permissions
 * for multiple resource types.
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
export function createPermissionIntegrationRouter<
  TResourceType1 extends string,
  TResource1,
  TResourceType2 extends string,
  TResource2,
  TResourceType3 extends string,
  TResource3,
>(
  options:
    | { permissions: Array<Permission> }
    | CreatePermissionIntegrationRouterResourceOptions<
        TResourceType1,
        TResource1
      >
    | PermissionIntegrationRouterOptions<
        TResourceType1,
        TResource1,
        TResourceType2,
        TResource2,
        TResourceType3,
        TResource3
      >,
): express.Router {
  const optionsWithResources = options as PermissionIntegrationRouterOptions;
  const allOptions = [
    optionsWithResources.resources ? optionsWithResources.resources : options,
  ].flat();
  const allRules = allOptions.flatMap(
    option =>
      (
        option as CreatePermissionIntegrationRouterResourceOptions<
          TResourceType1,
          TResource1
        >
      ).rules || [],
  );

  const allPermissions = Array.from(
    new Map(
      [
        ...((options as { permissions: Permission[] }).permissions || []),
        ...(optionsWithResources.resources?.flatMap(o => o.permissions || []) ||
          []),
      ].map(i => [i.name, i]),
    ).values(),
  );

  const allResourceTypes = allOptions.reduce((acc, option) => {
    if (
      isCreatePermissionIntegrationRouterResourceOptions(
        option as
          | { permissions: Array<Permission> }
          | CreatePermissionIntegrationRouterResourceOptions<
              TResourceType1,
              TResource1
            >,
      )
    ) {
      acc.push(
        (
          option as CreatePermissionIntegrationRouterResourceOptions<
            TResourceType1,
            TResource1
          >
        ).resourceType,
      );
    }
    return acc;
  }, [] as string[]);

  const router = Router();
  router.use(express.json());

  router.get('/.well-known/backstage/permissions/metadata', (_, res) => {
    const serializedRules: MetadataResponseSerializedRule[] = allRules.map(
      rule => ({
        name: rule.name,
        description: rule.description,
        resourceType: rule.resourceType,
        paramsSchema: zodToJsonSchema(rule.paramsSchema ?? z.object({})),
      }),
    );

    const responseJson: MetadataResponse = {
      permissions: allPermissions,
      rules: serializedRules,
    };

    return res.json(responseJson);
  });

  router.post(
    '/.well-known/backstage/permissions/apply-conditions',
    async (req, res: Response<ApplyConditionsResponse | string>) => {
      const ruleMapByResourceType: Record<
        string,
        ReturnType<typeof createGetRule>
      > = {};
      const getResourcesByResourceType: Record<
        string,
        CreatePermissionIntegrationRouterResourceOptions<
          TResourceType1,
          TResource1
        >['getResources']
      > = {};

      for (let option of allOptions) {
        option = option as
          | { permissions: Array<Permission> }
          | CreatePermissionIntegrationRouterResourceOptions<
              TResourceType1,
              TResource1
            >;
        if (isCreatePermissionIntegrationRouterResourceOptions(option)) {
          ruleMapByResourceType[option.resourceType] = createGetRule(
            option.rules,
          );

          getResourcesByResourceType[option.resourceType] = option.getResources;
        }
      }

      const assertValidResourceTypes = (
        requests: ApplyConditionsRequestEntry[],
      ) => {
        const invalidResourceTypes = requests
          .filter(request => !allResourceTypes.includes(request.resourceType))
          .map(request => request.resourceType);

        if (invalidResourceTypes.length) {
          throw new InputError(
            `Unexpected resource types: ${invalidResourceTypes.join(', ')}.`,
          );
        }
      };

      const parseResult = applyConditionsRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new InputError(parseResult.error.toString());
      }

      const body = parseResult.data;

      assertValidResourceTypes(body.items);

      const resourceRefsByResourceType = body.items.reduce<
        Record<string, Set<string>>
      >((acc, item) => {
        if (!acc[item.resourceType]) {
          acc[item.resourceType] = new Set();
        }
        acc[item.resourceType].add(item.resourceRef);
        return acc;
      }, {});

      const resourcesByResourceType: Record<string, Record<string, any>> = {};
      for (const resourceType of Object.keys(resourceRefsByResourceType)) {
        const getResources = getResourcesByResourceType[resourceType];
        if (!getResources) {
          throw new NotImplementedError(
            `This plugin does not expose any permission rule or can't evaluate the conditions request for ${resourceType}`,
          );
        }
        const resourceRefs = Array.from(
          resourceRefsByResourceType[resourceType],
        );
        const resources = await getResources(resourceRefs);
        resourceRefs.forEach((resourceRef, index) => {
          if (!resourcesByResourceType[resourceType]) {
            resourcesByResourceType[resourceType] = {};
          }
          resourcesByResourceType[resourceType][resourceRef] = resources[index];
        });
      }

      return res.json({
        items: body.items.map(request => ({
          id: request.id,
          result: applyConditions(
            request.conditions,
            resourcesByResourceType[request.resourceType][request.resourceRef],
            ruleMapByResourceType[request.resourceType],
          )
            ? AuthorizeResult.ALLOW
            : AuthorizeResult.DENY,
        })),
      });
    },
  );

  return router;
}

function isCreatePermissionIntegrationRouterResourceOptions<
  TResourceType extends string,
  TResource,
>(
  options:
    | { permissions: Array<Permission> }
    | CreatePermissionIntegrationRouterResourceOptions<
        TResourceType,
        TResource
      >,
): options is CreatePermissionIntegrationRouterResourceOptions<
  TResourceType,
  TResource
> {
  return (
    (
      options as CreatePermissionIntegrationRouterResourceOptions<
        TResourceType,
        TResource
      >
    ).resourceType !== undefined
  );
}

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
import { PermissionRule, PermissionRuleset } from '../types';
import {
  NoInfer,
  createGetRule,
  isAndCriteria,
  isNotCriteria,
  isOrCriteria,
} from './util';
import { NotImplementedError } from '@backstage/errors';
import { PermissionResourceRef } from './createPermissionResourceRef';

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
export function createConditionAuthorizer<TResource>(
  permissionRuleset: PermissionRuleset<TResource>,
): (decision: PolicyDecision, resource: TResource | undefined) => boolean;
/**
 * @public
 * @deprecated Use the version of `createConditionAuthorizer` that accepts a `PermissionRuleset` instead.
 */
export function createConditionAuthorizer<TResource, TQuery>(
  rules: PermissionRule<TResource, TQuery, string>[],
): (decision: PolicyDecision, resource: TResource | undefined) => boolean;
export function createConditionAuthorizer<TResource, TQuery>(
  rules:
    | PermissionRule<TResource, TQuery, string>[]
    | PermissionRuleset<TResource>,
): (decision: PolicyDecision, resource: TResource | undefined) => boolean {
  const getRule =
    'getRuleByName' in rules
      ? (n: string) => rules.getRuleByName(n)
      : createGetRule(rules);

  return (
    decision: PolicyDecision,
    resource: TResource | undefined,
  ): boolean => {
    if (decision.result === AuthorizeResult.CONDITIONAL) {
      return applyConditions(decision.conditions, resource, getRule);
    }

    return decision.result === AuthorizeResult.ALLOW;
  };
}

/**
 * Options for creating a permission integration router specific
 * for a particular resource type.
 *
 * @public
 * @deprecated {@link createPermissionIntegrationRouter} is deprecated
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
 * @deprecated {@link createPermissionIntegrationRouter} is deprecated
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

class PermissionIntegrationMetadataStore {
  readonly #rulesByTypeByName = new Map<
    string,
    Map<string, PermissionRule<unknown, unknown, string>>
  >();
  readonly #permissionsByName = new Map<string, Permission>();
  readonly #resourcesByType = new Map<
    string,
    CreatePermissionIntegrationRouterResourceOptions<string, unknown>
  >();
  readonly #serializedRules = new Array<MetadataResponseSerializedRule>();

  getSerializedMetadata(): MetadataResponse {
    return {
      permissions: Array.from(this.#permissionsByName.values()),
      rules: this.#serializedRules,
    };
  }

  hasResourceType(type: string): boolean {
    return this.#resourcesByType.has(type);
  }

  async getResources(
    resourceType: string,
    refs: string[],
  ): Promise<Record<string, unknown>> {
    const resource = this.#resourcesByType.get(resourceType);
    if (!resource?.getResources) {
      throw new NotImplementedError(
        `This plugin does not expose any permission rule or can't evaluate the conditions request for ${resourceType}`,
      );
    }

    const uniqueRefs = Array.from(new Set(refs));
    const resources = await resource.getResources(uniqueRefs);
    return Object.fromEntries(
      uniqueRefs.map((ref, index) => [ref, resources[index]]),
    );
  }

  getRuleMapper(resourceType: string) {
    return (name: string): PermissionRule<unknown, unknown, string> => {
      const rule = this.#rulesByTypeByName.get(resourceType)?.get(name);
      if (!rule) {
        throw new Error(
          `Permission rule '${name}' does not exist for resource type '${resourceType}'`,
        );
      }
      return rule;
    };
  }

  addPermissions(permissions: Permission[]) {
    for (const permission of permissions) {
      // Permission naming conflicts are silently ignored
      this.#permissionsByName.set(permission.name, permission);
    }
  }

  addPermissionRules(rules: PermissionRule<unknown, unknown, string>[]) {
    for (const rule of rules) {
      const rulesByName =
        this.#rulesByTypeByName.get(rule.resourceType) ?? new Map();
      this.#rulesByTypeByName.set(rule.resourceType, rulesByName);

      if (rulesByName.has(rule.name)) {
        throw new Error(
          `Refused to add permission rule for type '${rule.resourceType}' with name '${rule.name}' because it already exists`,
        );
      }
      rulesByName.set(rule.name, rule);

      this.#serializedRules.push({
        name: rule.name,
        description: rule.description,
        resourceType: rule.resourceType,
        paramsSchema: zodToJsonSchema(rule.paramsSchema ?? z.object({})),
      });
    }
  }

  addResourceType(
    resource: CreatePermissionIntegrationRouterResourceOptions<string, unknown>,
  ) {
    const { resourceType } = resource;

    if (this.#resourcesByType.has(resourceType)) {
      throw new Error(
        `Refused to add permission resource with type '${resourceType}' because it already exists`,
      );
    }
    this.#resourcesByType.set(resourceType, resource);

    if (resource.rules) {
      this.addPermissionRules(resource.rules);
    }

    if (resource.permissions) {
      this.addPermissions(resource.permissions);
    }
  }
}

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
 * @deprecated use `PermissionRegistryService` instead, see {@link https://backstage.io/docs/backend-system/core-services/permissions-registry#migrating-from-createpermissionintegrationrouter | the migration section in the service docs} for more details.
 */
export function createPermissionIntegrationRouter<
  TResourceType1 extends string,
  TResource1,
  TResourceType2 extends string,
  TResource2,
  TResourceType3 extends string,
  TResource3,
>(
  options?:
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
): express.Router & {
  addPermissions(permissions: Permission[]): void;
  addPermissionRules(rules: PermissionRule<unknown, unknown, string>[]): void;
  addResourceType<const TResourceType extends string, TResource>(
    resource: CreatePermissionIntegrationRouterResourceOptions<
      TResourceType,
      TResource
    >,
  ): void;
  getPermissionRuleset<TResource, TQuery, TResourceType extends string>(
    resourceRef: PermissionResourceRef<TResource, TQuery, TResourceType>,
  ): PermissionRuleset<TResource, TQuery, TResourceType>;
} {
  const store = new PermissionIntegrationMetadataStore();

  if (options) {
    if ('resources' in options) {
      // Not technically allowed by types, but it's historically been covered by tests
      if ('permissions' in options) {
        store.addPermissions(options.permissions as Permission[]);
      }

      for (const resource of options.resources) {
        store.addResourceType(resource);
      }
    } else if ('resourceType' in options) {
      store.addResourceType(options);
    } else {
      store.addPermissions(options.permissions);
    }
  }

  const router = Router();

  router.use('/.well-known/backstage/permissions/', express.json());

  router.get('/.well-known/backstage/permissions/metadata', (_, res) => {
    res.json(store.getSerializedMetadata());
  });

  router.post(
    '/.well-known/backstage/permissions/apply-conditions',
    async (req, res: Response<ApplyConditionsResponse | string>) => {
      const parseResult = applyConditionsRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new InputError(parseResult.error.toString());
      }

      const { items: requests } = parseResult.data;

      const invalidResourceTypes = requests.filter(
        i => !store.hasResourceType(i.resourceType),
      );
      if (invalidResourceTypes.length) {
        throw new InputError(
          `Unexpected resource types: ${invalidResourceTypes
            .map(i => i.resourceType)
            .join(', ')}.`,
        );
      }

      const resourcesByType: Record<string, Record<string, any>> = {};
      for (const requestedType of new Set(requests.map(i => i.resourceType))) {
        resourcesByType[requestedType] = await store.getResources(
          requestedType,
          requests
            .filter(r => r.resourceType === requestedType)
            .map(i => i.resourceRef),
        );
      }

      res.json({
        items: requests.map(request => ({
          id: request.id,
          result: applyConditions(
            request.conditions,
            resourcesByType[request.resourceType][request.resourceRef],
            store.getRuleMapper(request.resourceType),
          )
            ? AuthorizeResult.ALLOW
            : AuthorizeResult.DENY,
        })),
      });
    },
  );

  return Object.assign(router, {
    addPermissions(permissions: Permission[]) {
      store.addPermissions(permissions);
    },
    addPermissionRules(rules: PermissionRule<unknown, unknown, string>[]) {
      store.addPermissionRules(rules);
    },
    addResourceType<const TResourceType extends string, TResource>(
      resource: CreatePermissionIntegrationRouterResourceOptions<
        TResourceType,
        TResource
      >,
    ) {
      store.addResourceType(resource);
    },
    getPermissionRuleset<TResource, TQuery, TResourceType extends string>(
      resourceRef: PermissionResourceRef<TResource, TQuery, TResourceType>,
    ): PermissionRuleset<TResource, TQuery, TResourceType> {
      return {
        getRuleByName: store.getRuleMapper(resourceRef.resourceType),
      } as PermissionRuleset<TResource, TQuery, TResourceType>;
    },
  });
}

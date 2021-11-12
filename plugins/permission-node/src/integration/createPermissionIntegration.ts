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
import { conditionFor } from './conditionFor';
import { applyConditions, mapConditions } from './util';

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
 * A request to load the referenced resource and apply conditions, to finalize a conditional
 * authorization response.
 * @public
 */
export type ApplyConditionsRequest = {
  resourceRef: string;
  resourceType: string;
  conditions: PermissionCriteria<PermissionCondition>;
};

type Condition<TRule> = TRule extends PermissionRule<any, any, infer TParams>
  ? (...params: TParams) => PermissionCondition<TParams>
  : never;

type Conditions<TRules extends Record<string, PermissionRule<any, any>>> = {
  [Name in keyof TRules]: Condition<TRules[Name]>;
};

type QueryType<TRules> = TRules extends Record<
  string,
  PermissionRule<any, infer TQuery, any>
>
  ? TQuery
  : never;

export const createPermissionIntegration = <
  TResource,
  TRules extends { [key: string]: PermissionRule<TResource, any> },
  TGetResourceParams extends any[] = [],
>({
  pluginId,
  resourceType,
  rules,
  getResource,
}: {
  pluginId: string;
  resourceType: string;
  rules: TRules;
  getResource: (
    resourceRef: string,
    ...params: TGetResourceParams
  ) => Promise<TResource | undefined>;
}): {
  createPermissionIntegrationRouter: (...params: TGetResourceParams) => Router;
  toQuery: (
    conditions: PermissionCriteria<PermissionCondition>,
  ) => PermissionCriteria<QueryType<TRules>>;
  conditions: Conditions<TRules>;
  createConditions: (conditions: PermissionCriteria<PermissionCondition>) => {
    pluginId: string;
    resourceType: string;
    conditions: PermissionCriteria<PermissionCondition>;
  };
  registerPermissionRule: (
    rule: PermissionRule<TResource, QueryType<TRules>>,
  ) => void;
} => {
  const rulesMap = new Map(Object.values(rules).map(rule => [rule.name, rule]));

  const getRule = (name: string) => {
    const rule = rulesMap.get(name);

    if (!rule) {
      throw new Error(`Unexpected permission rule: ${name}`);
    }

    return rule;
  };

  return {
    createPermissionIntegrationRouter: (
      ...getResourceParams: TGetResourceParams
    ) => {
      const router = Router();

      router.post(
        '/permissions/apply-conditions',
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

          const resource = await getResource(
            body.resourceRef,
            ...getResourceParams,
          );

          if (!resource) {
            return res
              .status(400)
              .send(`Resource for ref ${body.resourceRef} not found.`);
          }

          return res.status(200).json({
            result: applyConditions(body.conditions, ({ rule, params }) =>
              getRule(rule).apply(resource, ...params),
            )
              ? AuthorizeResult.ALLOW
              : AuthorizeResult.DENY,
          });
        },
      );

      return router;
    },
    toQuery: (
      conditions: PermissionCriteria<PermissionCondition>,
    ): PermissionCriteria<QueryType<TRules>> => {
      return mapConditions(conditions, ({ rule, params }) =>
        getRule(rule).toQuery(...params),
      );
    },
    conditions: Object.entries(rules).reduce(
      (acc, [key, rule]) => ({
        ...acc,
        [key]: conditionFor(rule),
      }),
      {} as Conditions<TRules>,
    ),
    createConditions: (
      conditions: PermissionCriteria<PermissionCondition>,
    ) => ({
      pluginId,
      resourceType,
      conditions,
    }),
    registerPermissionRule: rule => {
      rulesMap.set(rule.name, rule);
    },
  };
};

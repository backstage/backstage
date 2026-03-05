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
  AuthorizeResult,
  ConditionalPolicyDecision,
  PermissionCondition,
  PermissionCriteria,
  ResourcePermission,
} from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';
import { createConditionFactory } from './createConditionFactory';
import { PermissionResourceRef } from './createPermissionResourceRef';

/**
 * A utility type for mapping a single {@link PermissionRule} to its
 * corresponding {@link @backstage/plugin-permission-common#PermissionCondition}.
 *
 * @public
 */
export type Condition<TRule> = TRule extends PermissionRule<
  any,
  any,
  infer TResourceType,
  infer TParams
>
  ? undefined extends TParams
    ? () => PermissionCondition<TResourceType, TParams>
    : (params: TParams) => PermissionCondition<TResourceType, TParams>
  : never;

/**
 * A utility type for mapping {@link PermissionRule}s to their corresponding
 * {@link @backstage/plugin-permission-common#PermissionCondition}s.
 *
 * @public
 */
export type Conditions<
  TRules extends Record<string, PermissionRule<any, any, any>>,
> = {
  [Name in keyof TRules]: Condition<TRules[Name]>;
};

/**
 * Creates the recommended condition-related exports for a given plugin based on
 * the built-in {@link PermissionRule}s it supports.
 *
 * @remarks
 *
 * The function returns a `conditions` object containing a
 * {@link @backstage/plugin-permission-common#PermissionCondition} factory for
 * each of the supplied {@link PermissionRule}s, along with a
 * `createConditionalDecision` function which builds the wrapper object needed
 * to enclose conditions when authoring {@link PermissionPolicy}
 * implementations.
 *
 * Plugin authors should generally call this method with all the built-in
 * {@link PermissionRule}s the plugin supports, and export the resulting
 * `conditions` object and `createConditionalDecision` function so that they can
 * be used by {@link PermissionPolicy} authors.
 *
 * @public
 */
export function createConditionExports<
  TResourceType extends string,
  TResource,
  TRules extends Record<string, PermissionRule<TResource, any, TResourceType>>,
>(options: {
  resourceRef: PermissionResourceRef<TResource, any, TResourceType>;
  rules: TRules;
}): {
  conditions: Conditions<TRules>;
  createConditionalDecision: (
    permission: ResourcePermission<TResourceType>,
    conditions: PermissionCriteria<PermissionCondition<TResourceType>>,
  ) => ConditionalPolicyDecision;
};
/**
 * @public
 * @deprecated Use the version of `createConditionExports` that accepts a `resourceRef` option instead.
 */
export function createConditionExports<
  TResourceType extends string,
  TResource,
  TRules extends Record<string, PermissionRule<TResource, any, TResourceType>>,
>(options: {
  pluginId: string;
  resourceType: TResourceType;
  rules: TRules;
}): {
  conditions: Conditions<TRules>;
  createConditionalDecision: (
    permission: ResourcePermission<TResourceType>,
    conditions: PermissionCriteria<PermissionCondition<TResourceType>>,
  ) => ConditionalPolicyDecision;
};
export function createConditionExports<
  TResourceType extends string,
  TResource,
  TRules extends Record<string, PermissionRule<TResource, any, TResourceType>>,
>(
  options:
    | {
        resourceRef: PermissionResourceRef<TResource, any, TResourceType>;
        rules: TRules;
      }
    | {
        pluginId: string;
        resourceType: TResourceType;
        rules: TRules;
      },
): {
  conditions: Conditions<TRules>;
  createConditionalDecision: (
    permission: ResourcePermission<TResourceType>,
    conditions: PermissionCriteria<PermissionCondition<TResourceType>>,
  ) => ConditionalPolicyDecision;
} {
  const { rules } = options;
  const { pluginId, resourceType } =
    'resourceRef' in options ? options.resourceRef : options;

  return {
    conditions: Object.entries(rules).reduce(
      (acc, [key, rule]) => ({
        ...acc,
        [key]: createConditionFactory(rule),
      }),
      {} as Conditions<TRules>,
    ),
    createConditionalDecision: (
      _permission: ResourcePermission<TResourceType>,
      conditions: PermissionCriteria<PermissionCondition>,
    ) => ({
      result: AuthorizeResult.CONDITIONAL,
      pluginId,
      resourceType,
      conditions,
    }),
  };
}

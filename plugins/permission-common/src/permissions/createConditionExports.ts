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
  Conditions,
  PermissionCondition,
  PermissionCriteria,
} from '@backstage/plugin-permission-common';
import { PermissionRuleDefinition } from '../types';
import { createConditionFactory } from './createConditionFactory';

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
export const createConditionExports = <
  TResourceType extends string,
  TRules extends Record<string, PermissionRuleDefinition<TResourceType, any>>,
>(options: {
  pluginId: string;
  resourceType: TResourceType;
  rules: TRules;
}): {
  conditions: Conditions<TRules>;
  createConditionalDecision: (
    conditions: PermissionCriteria<PermissionCondition<TResourceType>>,
  ) => ConditionalPolicyDecision;
} => {
  const { pluginId, resourceType, rules } = options;

  return {
    conditions: Object.entries(rules).reduce(
      (acc, [key, rule]) => ({
        ...acc,
        [key]: createConditionFactory(rule),
      }),
      {} as Conditions<TRules>,
    ),
    createConditionalDecision: (
      conditions: PermissionCriteria<PermissionCondition>,
    ) => ({
      result: AuthorizeResult.CONDITIONAL,
      pluginId,
      resourceType,
      conditions,
    }),
  };
};

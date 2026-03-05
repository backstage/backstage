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
  PermissionCondition,
  PermissionRuleParams,
} from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';

/**
 * Creates a condition factory function for a given authorization rule and parameter types.
 *
 * @remarks
 *
 * For example, an isEntityOwner rule for catalog entities might take an array of entityRef strings.
 * The rule itself defines _how_ to check a given resource, whereas a condition also includes _what_
 * to verify.
 *
 * Plugin authors should generally use the {@link (createConditionExports:1)} in order to efficiently
 * create multiple condition factories. This helper should generally only be used to construct
 * condition factories for third-party rules that aren't part of the backend plugin with which
 * they're intended to integrate.
 *
 * @public
 */
export const createConditionFactory = <
  TResourceType extends string,
  TParams extends PermissionRuleParams = PermissionRuleParams,
>(
  rule: PermissionRule<unknown, unknown, TResourceType, TParams>,
) => {
  return (params: TParams): PermissionCondition<TResourceType, TParams> => {
    return {
      rule: rule.name,
      resourceType: rule.resourceType,
      params,
    };
  };
};

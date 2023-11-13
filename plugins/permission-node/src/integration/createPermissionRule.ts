/*
 * Copyright 2022 The Backstage Authors
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
  PermissionRuleDefinition,
  PermissionRuleParams,
} from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';

type CreatePermissionRuleArgs<
  TResource,
  TQuery,
  TResourceType extends string,
  TParams extends PermissionRuleParams = undefined,
> =
  | [PermissionRule<TResource, TQuery, TResourceType, TParams>]
  | [
      PermissionRuleDefinition<TResourceType, TParams>,
      Pick<
        PermissionRule<TResource, TQuery, TResourceType, TParams>,
        'apply' | 'toQuery'
      >,
    ];

/**
 * Helper function to ensure that {@link PermissionRule} definitions are typed correctly.
 *
 * @public
 */
export const createPermissionRule = <
  TResource,
  TQuery,
  TResourceType extends string,
  TParams extends PermissionRuleParams = undefined,
>(
  ...args: CreatePermissionRuleArgs<TResource, TQuery, TResourceType, TParams>
): PermissionRule<TResource, TQuery, TResourceType, TParams> =>
  args.length === 2
    ? {
        ...args[0],
        ...args[1],
      }
    : args[0];

/**
 * Helper for making plugin-specific createPermissionRule functions, that have
 * the TResource and TQuery type parameters populated but infer the params from
 * the supplied rule. This helps ensure that rules created for this plugin use
 * consistent types for the resource and query.
 *
 * @public
 */
export const makeCreatePermissionRule =
  <TResource, TQuery, TResourceType extends string>() =>
  <TParams extends PermissionRuleParams = undefined>(
    ...args: CreatePermissionRuleArgs<TResource, TQuery, TResourceType, TParams>
  ) =>
    createPermissionRule(...args);

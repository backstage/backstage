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

import { PermissionRule } from '../types';

/**
 * Helper function to ensure that {@link PermissionRule} definitions are typed correctly.
 *
 * @public
 */
export const createPermissionRule = <
  TResource,
  TQuery,
  TResourceType extends string,
  TParams extends unknown[],
>(
  rule: PermissionRule<TResource, TQuery, TResourceType, TParams>,
) => rule;

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
  <TParams extends unknown[]>(
    rule: PermissionRule<TResource, TQuery, TResourceType, TParams>,
  ) =>
    createPermissionRule(rule);

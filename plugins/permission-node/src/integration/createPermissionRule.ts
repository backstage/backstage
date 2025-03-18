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
  PermissionCriteria,
  PermissionRuleParams,
} from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';
import { z } from 'zod';
import { PermissionResourceRef } from './createPermissionResourceRef';
import { NoInfer } from './util';

/**
 * @public
 */
export type CreatePermissionRuleOptions<
  TRef extends PermissionResourceRef,
  TParams extends PermissionRuleParams,
> = TRef extends PermissionResourceRef<infer IResource, infer IQuery, any>
  ? {
      name: string;
      description: string;

      resourceRef: TRef;

      /**
       * A ZodSchema that reflects the structure of the parameters that are passed to
       */
      paramsSchema?: z.ZodSchema<TParams>;

      /**
       * Apply this rule to a resource already loaded from a backing data source. The params are
       * arguments supplied for the rule; for example, a rule could be `isOwner` with entityRefs as the
       * params.
       */
      apply(resource: IResource, params: NoInfer<TParams>): boolean;

      /**
       * Translate this rule to criteria suitable for use in querying a backing data store. The criteria
       * can be used for loading a collection of resources efficiently with conditional criteria already
       * applied.
       */
      toQuery(params: NoInfer<TParams>): PermissionCriteria<IQuery>;
    }
  : never;

/**
 * Helper function to create a {@link PermissionRule} for a specific resource type using a {@link PermissionResourceRef}.
 *
 * @public
 */
export function createPermissionRule<
  TRef extends PermissionResourceRef,
  TParams extends PermissionRuleParams = undefined,
>(
  rule: CreatePermissionRuleOptions<TRef, TParams>,
): PermissionRule<
  TRef['TResource'],
  TRef['TQuery'],
  TRef['resourceType'],
  TParams
>;
/**
 * Helper function to ensure that {@link PermissionRule} definitions are typed correctly.
 *
 * @deprecated Use the version of `createPermissionRule` that accepts a `resourceRef` option instead.
 * @public
 */
export function createPermissionRule<
  TResource,
  TQuery,
  TResourceType extends string,
  TParams extends PermissionRuleParams = undefined,
>(
  rule: PermissionRule<TResource, TQuery, TResourceType, TParams>,
): PermissionRule<TResource, TQuery, TResourceType, TParams>;
export function createPermissionRule<
  TResource,
  TQuery,
  TResourceType extends string,
  TRef extends PermissionResourceRef,
  TParams extends PermissionRuleParams = undefined,
>(
  rule:
    | PermissionRule<TResource, TQuery, TResourceType, TParams>
    | CreatePermissionRuleOptions<TRef, TParams>,
): PermissionRule<TResource, TQuery, TResourceType, TParams> {
  if ('resourceRef' in rule) {
    return {
      ...rule,
      resourceType: rule.resourceRef.resourceType as TResourceType,
    } as PermissionRule<TResource, TQuery, TResourceType, TParams>;
  }
  return rule;
}

/**
 * Helper for making plugin-specific createPermissionRule functions, that have
 * the TResource and TQuery type parameters populated but infer the params from
 * the supplied rule. This helps ensure that rules created for this plugin use
 * consistent types for the resource and query.
 *
 * @public
 * @deprecated Use {@link (createPermissionRule:1)} directly instead with the resourceRef option.
 */
export const makeCreatePermissionRule =
  <TResource, TQuery, TResourceType extends string>() =>
  <TParams extends PermissionRuleParams = undefined>(
    rule: PermissionRule<TResource, TQuery, TResourceType, TParams>,
  ) =>
    createPermissionRule(rule);

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

import type { PermissionCriteria } from '@backstage/plugin-permission-common';
import { z } from 'zod';

/**
 * Prevent use of type parameter from contributing to type inference.
 *
 * https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-980401795
 * @ignore
 */
export type NoInfer<T> = T extends infer S ? S : never;

/**
 * A conditional rule that can be provided in an
 * {@link @backstage/permission-common#AuthorizeDecision} response to an authorization request.
 *
 * @remarks
 *
 * Rules can either be evaluated against a resource loaded in memory, or used as filters when
 * loading a collection of resources from a data source. The `apply` and `toQuery` methods implement
 * these two concepts.
 *
 * The two operations should always have the same logical result. If they don’t, the effective
 * outcome of an authorization operation will sometimes differ depending on how the authorization
 * check was performed.
 *
 * @public
 */
export type PermissionRule<
  TResource,
  TQuery,
  TResourceType extends string,
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TSchema extends z.ZodType = z.ZodObject<{
    // Parameters can be optional, however we we want to make sure that the
    // parameters are always present in the schema, even if they are undefined.
    // We remove the optional flag from the schema, and then add it back in
    // with an optional zod type.
    [P in keyof TParams]-?: TParams[P] extends undefined
      ? z.ZodOptionalType<z.ZodType<TParams[P]>>
      : z.ZodType<TParams[P]>;
  }>,
> = {
  name: string;
  description: string;
  resourceType: TResourceType;

  /**
   * A ZodSchema that documents the parameters that this rule accepts.
   */
  schema: TSchema;

  /**
   * Apply this rule to a resource already loaded from a backing data source. The params are
   * arguments supplied for the rule; for example, a rule could be `isOwner` with entityRefs as the
   * params.
   */
  apply(resource: TResource, params: NoInfer<z.input<TSchema>>): boolean;

  /**
   * Translate this rule to criteria suitable for use in querying a backing data store. The criteria
   * can be used for loading a collection of resources efficiently with conditional criteria already
   * applied.
   */
  toQuery(params: NoInfer<z.input<TSchema>>): PermissionCriteria<TQuery>;
};

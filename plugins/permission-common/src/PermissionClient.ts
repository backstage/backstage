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

import { Config } from '@backstage/config';
import { ResponseError } from '@backstage/errors';
import fetch from 'cross-fetch';
import * as uuid from 'uuid';
import { z } from 'zod';
import {
  AuthorizeResult,
  DefinitivePolicyDecision,
  PermissionMessageBatch,
  PermissionCriteria,
  PermissionCondition,
  PermissionEvaluator,
  PolicyDecision,
  QueryPermissionRequest,
  AuthorizePermissionRequest,
  EvaluatorRequestOptions,
  AuthorizePermissionResponse,
  QueryPermissionResponse,
} from './types/api';
import { DiscoveryApi } from './types/discovery';
import { AuthorizeRequestOptions } from './types/permission';

const permissionCriteriaSchema: z.ZodSchema<
  PermissionCriteria<PermissionCondition>
> = z.lazy(() =>
  z
    .object({
      rule: z.string(),
      resourceType: z.string(),
      params: z.array(z.unknown()),
    })
    .strict()
    .or(
      z
        .object({ anyOf: z.array(permissionCriteriaSchema).nonempty() })
        .strict(),
    )
    .or(
      z
        .object({ allOf: z.array(permissionCriteriaSchema).nonempty() })
        .strict(),
    )
    .or(z.object({ not: permissionCriteriaSchema }).strict()),
);

const authorizeDecisionSchema: z.ZodSchema<DefinitivePolicyDecision> = z.object(
  {
    result: z
      .literal(AuthorizeResult.ALLOW)
      .or(z.literal(AuthorizeResult.DENY)),
  },
);

const policyDecisionSchema: z.ZodSchema<PolicyDecision> = z.union([
  z.object({
    result: z
      .literal(AuthorizeResult.ALLOW)
      .or(z.literal(AuthorizeResult.DENY)),
  }),
  z.object({
    result: z.literal(AuthorizeResult.CONDITIONAL),
    pluginId: z.string(),
    resourceType: z.string(),
    conditions: permissionCriteriaSchema,
  }),
]);

const responseSchema = <T>(
  itemSchema: z.ZodSchema<T>,
  ids: Set<string>,
): z.ZodSchema<PermissionMessageBatch<T>> =>
  z.object({
    items: z
      .array(
        z.intersection(
          z.object({
            id: z.string(),
          }),
          itemSchema,
        ),
      )
      .refine(
        items =>
          items.length === ids.size && items.every(({ id }) => ids.has(id)),
        {
          message: 'Items in response do not match request',
        },
      ),
  });

/**
 * An isomorphic client for requesting authorization for Backstage permissions.
 * @public
 */
export class PermissionClient implements PermissionEvaluator {
  private readonly enabled: boolean;
  private readonly discovery: DiscoveryApi;

  constructor(options: { discovery: DiscoveryApi; config: Config }) {
    this.discovery = options.discovery;
    this.enabled =
      options.config.getOptionalBoolean('permission.enabled') ?? false;
  }

  /**
   * Request authorization from the permission-backend for the given set of
   * permissions.
   *
   * @remarks
   *
   * Checks that a given Backstage user can perform a protected operation. When
   * authorization is for a {@link ResourcePermission}s, a resourceRef
   * corresponding to the resource should always be supplied along with the
   * permission. The Backstage identity token should be included in the
   * `options` if available.
   *
   * Permissions can be imported from plugins exposing them, such as
   * `catalogEntityReadPermission`.
   *
   * For each query, the response will be either ALLOW or DENY.
   *
   * @public
   */
  async authorize(
    requests: AuthorizePermissionRequest[],
    options?: EvaluatorRequestOptions,
  ): Promise<AuthorizePermissionResponse[]> {
    // TODO(permissions): it would be great to provide some kind of typing guarantee that
    // conditional responses will only ever be returned for requests containing a resourceType
    // but no resourceRef. That way clients who aren't prepared to handle filtering according
    // to conditions can be guaranteed that they won't unexpectedly get a CONDITIONAL response.

    return this.makeRequest(requests, authorizeDecisionSchema, options);
  }

  /**
   * Fetch the conditional authorization decisions for the given set of
   * {@link ResourcePermission}s in order to apply the conditions to an upstream
   * data source.
   *
   * @remarks
   *
   * For each query, the response will be either ALLOW, DENY, or CONDITIONAL.
   * Conditional responses are intended only for backends which have access to
   * the data source for permissioned resources, so that filters can be applied
   * when loading collections of resources.
   *
   * @public
   */
  async query(
    queries: QueryPermissionRequest[],
    options?: EvaluatorRequestOptions,
  ): Promise<QueryPermissionResponse[]> {
    return this.makeRequest(queries, policyDecisionSchema, options);
  }

  private async makeRequest<TQuery, TResult>(
    queries: TQuery[],
    itemSchema: z.ZodSchema<TResult>,
    options?: AuthorizeRequestOptions,
  ) {
    if (!this.enabled) {
      return queries.map(_ => ({ result: AuthorizeResult.ALLOW as const }));
    }

    const request = {
      items: queries.map(query => ({
        id: uuid.v4(),
        ...query,
      })),
    };

    const permissionApi = await this.discovery.getBaseUrl('permission');
    const response = await fetch(`${permissionApi}/authorize`, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        ...this.getAuthorizationHeader(options?.token),
        'content-type': 'application/json',
      },
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const responseBody = await response.json();

    const parsedResponse = responseSchema(
      itemSchema,
      new Set(request.items.map(({ id }) => id)),
    ).parse(responseBody);

    const responsesById = parsedResponse.items.reduce((acc, r) => {
      acc[r.id] = r;
      return acc;
    }, {} as Record<string, typeof itemSchema._type>);

    return request.items.map(query => responsesById[query.id]);
  }

  private getAuthorizationHeader(token?: string): Record<string, string> {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

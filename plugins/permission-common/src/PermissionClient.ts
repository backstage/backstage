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
  AuthorizeQuery,
  AuthorizeDecision,
  Identified,
  PermissionCriteria,
  PermissionCondition,
  Batch,
  PolicyQuery,
  PolicyDecision,
} from './types/api';
import { DiscoveryApi } from './types/discovery';
import {
  PermissionAuthorizer,
  AuthorizeRequestOptions,
  ResourcePermission,
} from './types/permission';

const permissionCriteriaSchema: z.ZodSchema<
  PermissionCriteria<PermissionCondition>
> = z.lazy(() =>
  z
    .object({
      rule: z.string(),
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

const authorizeDecisionSchema: z.ZodSchema<AuthorizeDecision> = z.object({
  result: z.literal(AuthorizeResult.ALLOW).or(z.literal(AuthorizeResult.DENY)),
});

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
): z.ZodSchema<Batch<T>> =>
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
export class PermissionClient implements PermissionAuthorizer {
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
    queries: AuthorizeQuery[],
    options?: AuthorizeRequestOptions,
  ): Promise<AuthorizeDecision[]> {
    return this.makeRequest(
      '/authorize',
      queries,
      authorizeDecisionSchema,
      options,
    );
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
  async policyDecision(
    queries: PolicyQuery<ResourcePermission>[],
    options?: AuthorizeRequestOptions,
  ): Promise<PolicyDecision[]> {
    return this.makeRequest(
      '/policy-decision',
      queries,
      policyDecisionSchema,
      options,
    );
  }

  private async makeRequest<TQuery, TResult>(
    path: string,
    queries: TQuery[],
    itemSchema: z.ZodSchema<TResult>,
    options?: AuthorizeRequestOptions,
  ) {
    if (!this.enabled) {
      return queries.map(_ => ({ result: AuthorizeResult.ALLOW as const }));
    }

    const request: Batch<Identified<TQuery>> = {
      items: queries.map(query => ({
        id: uuid.v4(),
        ...query,
      })),
    };

    const permissionApi = await this.discovery.getBaseUrl('permission');
    const response = await fetch(`${permissionApi}${path}`, {
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
    }, {} as Record<string, Identified<TResult>>);

    return request.items.map(query => responsesById[query.id]);
  }

  private getAuthorizationHeader(token?: string): Record<string, string> {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

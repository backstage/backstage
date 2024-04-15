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
  PermissionMessageBatch,
  PermissionCriteria,
  PermissionCondition,
  PermissionEvaluator,
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
      params: z.record(z.any()).optional(),
    })
    .or(z.object({ anyOf: z.array(permissionCriteriaSchema).nonempty() }))
    .or(z.object({ allOf: z.array(permissionCriteriaSchema).nonempty() }))
    .or(z.object({ not: permissionCriteriaSchema })),
);

const authorizePermissionResponseSchema: z.ZodSchema<AuthorizePermissionResponse> =
  z.object({
    result: z
      .literal(AuthorizeResult.ALLOW)
      .or(z.literal(AuthorizeResult.DENY)),
  });

const queryPermissionResponseSchema: z.ZodSchema<QueryPermissionResponse> =
  z.union([
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
   * {@inheritdoc PermissionEvaluator.authorize}
   */
  async authorize(
    requests: AuthorizePermissionRequest[],
    options?: EvaluatorRequestOptions,
  ): Promise<AuthorizePermissionResponse[]> {
    return this.makeRequest(
      requests,
      authorizePermissionResponseSchema,
      options,
    );
  }

  /**
   * {@inheritdoc PermissionEvaluator.authorizeConditional}
   */
  async authorizeConditional(
    queries: QueryPermissionRequest[],
    options?: EvaluatorRequestOptions,
  ): Promise<QueryPermissionResponse[]> {
    return this.makeRequest(queries, queryPermissionResponseSchema, options);
  }

  private async makeRequest<TQuery, TResult>(
    queries: TQuery[],
    itemSchema: z.ZodSchema<TResult>,
    options?: AuthorizeRequestOptions,
  ) {
    if (!this.enabled) {
      return queries.map(_ => ({ result: AuthorizeResult.ALLOW as const }));
    }

    const request: PermissionMessageBatch<TQuery> = {
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

    const responsesById = parsedResponse.items.reduce(
      (acc, r) => {
        acc[r.id] = r;
        return acc;
      },
      {} as Record<string, z.infer<typeof itemSchema>>,
    );

    return request.items.map(query => responsesById[query.id]);
  }

  private getAuthorizationHeader(token?: string): Record<string, string> {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

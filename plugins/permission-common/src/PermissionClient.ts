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
import { z } from 'zod/v3';
import {
  AuthorizeResult,
  PermissionMessageBatch,
  PermissionCriteria,
  PermissionCondition,
  PermissionEvaluator,
  QueryPermissionRequest,
  AuthorizePermissionRequest,
  AuthorizePermissionResponse,
  QueryPermissionResponse,
  IdentifiedPermissionMessage,
} from './types/api';
import { DiscoveryApi } from './types/discovery';
import {
  AuthorizeRequestOptions,
  BasicPermission,
  ResourcePermission,
} from './types/permission';
import { isResourcePermission } from './permissions';

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

const authorizePermissionResponseBatchSchema = z
  .object({
    result: z.array(
      z.union([
        z.literal(AuthorizeResult.ALLOW),
        z.literal(AuthorizeResult.DENY),
      ]),
    ),
  })
  .or(authorizePermissionResponseSchema);

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
 * Options for {@link PermissionClient} requests.
 *
 * @public
 */
export type PermissionClientRequestOptions = {
  token?: string;
};

/**
 * An isomorphic client for requesting authorization for Backstage permissions.
 * @public
 */
export class PermissionClient implements PermissionEvaluator {
  private readonly enabled: boolean;
  private readonly discovery: DiscoveryApi;
  private readonly enableBatchedRequests: boolean;

  constructor(options: { discovery: DiscoveryApi; config: Config }) {
    this.discovery = options.discovery;
    this.enabled =
      options.config.getOptionalBoolean('permission.enabled') ?? false;

    this.enableBatchedRequests =
      options.config.getOptionalBoolean(
        'permission.EXPERIMENTAL_enableBatchedRequests',
      ) ?? false;
  }

  /**
   * {@inheritdoc PermissionEvaluator.authorize}
   */
  async authorize(
    requests: AuthorizePermissionRequest[],
    options?: PermissionClientRequestOptions,
  ): Promise<AuthorizePermissionResponse[]> {
    if (!this.enabled) {
      return requests.map(_ => ({ result: AuthorizeResult.ALLOW }));
    }

    if (this.enableBatchedRequests) {
      return this.makeBatchedRequest(requests, options);
    }

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
    options?: PermissionClientRequestOptions,
  ): Promise<QueryPermissionResponse[]> {
    if (!this.enabled) {
      return queries.map(_ => ({ result: AuthorizeResult.ALLOW }));
    }

    return this.makeRequest(queries, queryPermissionResponseSchema, options);
  }

  private async makeRequest<TQuery, TResult>(
    queries: TQuery[],
    itemSchema: z.ZodSchema<TResult>,
    options?: AuthorizeRequestOptions,
  ) {
    const request: PermissionMessageBatch<TQuery> = {
      items: queries.map(query => ({
        id: uuid.v4(),
        ...query,
      })),
    };

    const parsedResponse = await this.makeRawRequest(
      request,
      itemSchema,
      options,
    );

    const responsesById = parsedResponse.items.reduce((acc, r) => {
      acc[r.id] = r;
      return acc;
    }, {} as Record<string, z.infer<typeof itemSchema>>);

    return request.items.map(query => responsesById[query.id]);
  }

  private async makeBatchedRequest(
    queries: AuthorizePermissionRequest[],
    options?: AuthorizeRequestOptions,
  ) {
    const request: Record<string, BatchedAuthorizePermissionRequest> = {};

    for (const query of queries) {
      const { permission, resourceRef } = query;

      if (isResourcePermission(permission)) {
        request[permission.name] ||= {
          permission,
          resourceRef: [],
          id: uuid.v4(),
        };

        if (resourceRef) {
          request[permission.name].resourceRef?.push(resourceRef);
        }
      } else {
        request[permission.name] ||= {
          permission,
          id: uuid.v4(),
        };
      }
    }

    const parsedResponse = await this.makeRawRequest(
      { items: Object.values(request) },
      authorizePermissionResponseBatchSchema,
      options,
    );

    const responsesById = parsedResponse.items.reduce((acc, r) => {
      acc[r.id] = r;
      return acc;
    }, {} as Record<string, (typeof parsedResponse)['items'][number]>);

    return queries.map(query => {
      const { id } = request[query.permission.name];

      const item = responsesById[id];

      if (Array.isArray(item.result)) {
        return {
          result: query.resourceRef ? item.result.shift()! : item.result[0],
        };
      }
      return { result: item.result };
    });
  }

  private async makeRawRequest<TQuery, TResult>(
    request: PermissionMessageBatch<TQuery>,
    itemSchema: z.ZodSchema<TResult>,
    options?: AuthorizeRequestOptions,
  ) {
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

    return responseSchema(
      itemSchema,
      new Set(request.items.map(({ id }) => id)),
    ).parse(responseBody);
  }

  private getAuthorizationHeader(token?: string): Record<string, string> {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

/**
 * @internal
 */
export type BatchedAuthorizePermissionRequest = IdentifiedPermissionMessage<
  | {
      permission: BasicPermission;
      resourceRef?: undefined;
    }
  | { permission: ResourcePermission; resourceRef: string[] }
>;

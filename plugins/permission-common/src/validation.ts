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

import { z } from 'zod';
import {
  AuthorizeResponse,
  AuthorizeResult,
  PermissionCondition,
  PermissionCriteria,
  ConditionalAuthorizeResponse,
  DefinitiveAuthorizeResponse,
} from './types';

export const permissionCriteriaSchema: z.ZodSchema<
  PermissionCriteria<PermissionCondition>
> = z.lazy(() =>
  z
    .object({
      rule: z.string(),
      params: z.array(z.unknown()),
    })
    .strict()
    .or(z.object({ anyOf: z.array(permissionCriteriaSchema) }).strict())
    .or(z.object({ allOf: z.array(permissionCriteriaSchema) }).strict())
    .or(z.object({ not: permissionCriteriaSchema }).strict()),
);

export const authorizeResponseSchema: z.ZodSchema<AuthorizeResponse> = z.object(
  {
    items: z.array(
      z
        .object({
          id: z.string(),
          result: z
            .literal(AuthorizeResult.ALLOW)
            .or(z.literal(AuthorizeResult.DENY)),
        })
        .or(
          z.object({
            id: z.string(),
            result: z.literal(AuthorizeResult.CONDITIONAL),
            conditions: permissionCriteriaSchema,
          }),
        ),
    ),
  },
);

export function validatePermissionCriteria(
  criteria: any,
): PermissionCriteria<PermissionCondition> {
  return permissionCriteriaSchema.parse(criteria);
}

export function validateAuthorizeResponse(response: any): AuthorizeResponse {
  return authorizeResponseSchema.parse(response);
}

export function isDefinitiveAuthorizeResponse(
  response: AuthorizeResponse,
): response is DefinitiveAuthorizeResponse {
  return response.items.every(
    item =>
      item.result === AuthorizeResult.ALLOW ||
      item.result === AuthorizeResult.DENY,
  );
}

export function isConditionalAuthorizeResponse(
  response: AuthorizeResponse,
): response is ConditionalAuthorizeResponse {
  return response.items.every(
    item => item.result === AuthorizeResult.CONDITIONAL,
  );
}

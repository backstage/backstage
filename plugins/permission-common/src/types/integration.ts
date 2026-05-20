/*
 * Copyright 2024 The Backstage Authors
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

import zodToJsonSchema from 'zod-to-json-schema';
import { EvaluatePermissionResponse, PermissionMessageBatch } from './api';
import { Permission } from './permission';

/**
 * Serialized permission rules, with the paramsSchema
 * converted from a ZodSchema to a JsonSchema.
 *
 * @public
 */
export type MetadataResponseSerializedRule = {
  name: string;
  description: string;
  resourceType: string;
  paramsSchema?: ReturnType<typeof zodToJsonSchema>;
};

/**
 * Response type for the .metadata endpoint in
 * {@link @backstage/plugin-permission-node#createPermissionIntegrationRouter}
 *
 * @public
 */
export type MetadataResponse = {
  permissions?: Permission[];
  rules: MetadataResponseSerializedRule[];
};

/**
 * Request item used by {@link @backstage/plugin-permission-common#PermissionClient.authorizeByName}.
 * Identifies a permission by its registered `name`; the backend resolves it
 * to the full {@link Permission} (preserving `attributes` and the basic /
 * resource discriminator) before authorizing. `resourceRef` is required for
 * resource permissions for the same reason as on regular `authorize` calls.
 *
 * @public
 */
export type AuthorizeByNamePermissionRequest = {
  name: string;
  resourceRef?: string;
};

/**
 * Request payload for the permission backend's `POST /authorize/by-name`
 * endpoint. Each item references a registered permission by `name`; the
 * backend resolves it to the full {@link Permission} (preserving `attributes`
 * and the basic / resource discriminator) before authorizing. `resourceRef`
 * is required for resource permissions for the same reason as on
 * `/authorize`.
 *
 * @public
 */
export type AuthorizeByNameRequest = PermissionMessageBatch<{
  name: string;
  resourceRef?: string | string[];
}>;

/**
 * Response payload for the permission backend's `POST /authorize/by-name`
 * endpoint. Each entry mirrors the `id` of the corresponding request entry.
 * Unknown permission names resolve to a `DENY` decision.
 *
 * @public
 */
export type AuthorizeByNameResponse =
  PermissionMessageBatch<EvaluatePermissionResponse>;

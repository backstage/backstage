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
 * The permissions registered by a single plugin, as exposed by the
 * installed-permissions endpoint.
 *
 * @public
 */
export type InstalledPluginPermissions = {
  pluginId: string;
  permissions: Permission[];
};

/**
 * Aggregated catalog of every permission registered across the deployment,
 * grouped by the plugin that registered it. Returned by the permission backend
 * to allow clients to look up the full {@link Permission} definition (including
 * attributes and resource type) by name.
 *
 * @public
 */
export type InstalledPermissionsResponse = {
  plugins: InstalledPluginPermissions[];
};

/**
 * Path of the metadata endpoint mounted by
 * {@link @backstage/plugin-permission-node#createPermissionIntegrationRouter}
 * on every plugin that registers permissions or rules.
 *
 * @public
 */
export const PERMISSIONS_METADATA_PATH =
  '/.well-known/backstage/permissions/metadata';

/**
 * Path of the aggregated installed-permissions endpoint exposed by the
 * permission backend, mounted under its plugin base URL.
 *
 * @public
 */
export const INSTALLED_PERMISSIONS_PATH =
  '/.well-known/backstage/permissions/installed';

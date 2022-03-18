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

import { Config } from '@backstage/config';
import { ApiRef, createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';
import {
  Permission,
  PermissionAggregator,
} from '@backstage/plugin-permission-common';

export class PermissionAggregationApi {
  private constructor(
    private readonly permissionAggregator: PermissionAggregator,
  ) {}

  static create(options: { config: Config; discovery: DiscoveryApi }) {
    const { config, discovery } = options;
    const permissionedPlugins =
      config.getOptionalStringArray('permission.permissionedPlugins') ?? [];
    const permissionAggregator = new PermissionAggregator(permissionedPlugins, {
      discovery,
    });
    return new PermissionAggregationApi(permissionAggregator);
  }

  getAllPermissions(): Promise<Permission[]> {
    return this.permissionAggregator.getAllPermissions();
  }
}

export const permissionAggregationApiRef: ApiRef<PermissionAggregationApi> =
  createApiRef({
    id: 'plugin.permission-aggregation.api',
  });

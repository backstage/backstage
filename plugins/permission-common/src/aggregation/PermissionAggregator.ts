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

import { DiscoveryApi, Permission } from '../types';

export class PermissionAggregator {
  private readonly discovery: DiscoveryApi;

  constructor(
    private readonly permissionedPlugins: string[],
    options: { discovery: DiscoveryApi },
  ) {
    this.discovery = options.discovery;
  }

  async getAllPermissions(): Promise<Permission[]> {
    const allPermissions: Permission[] = [];
    await Promise.all(
      this.permissionedPlugins.map(async pluginId => {
        const pluginApi = await this.discovery.getBaseUrl(pluginId);
        const response = await fetch(
          `${pluginApi}/.well-known/backstage/permissions/permission-list`,
        );
        const data = await response.json();
        allPermissions.push(...data.permissions);
      }),
    );
    return allPermissions;
  }
}

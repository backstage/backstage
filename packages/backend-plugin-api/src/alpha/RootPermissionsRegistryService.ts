/*
 * Copyright 2026 The Backstage Authors
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

import { Permission } from '@backstage/plugin-permission-common';

/**
 * A permission registered into the root permission registry along with the id
 * of the plugin that registered it.
 *
 * @alpha
 */
export interface RootPermissionsRegistryEntry {
  pluginId: string;
  permission: Permission;
}

/**
 * Root-scoped, deployment-wide permission registry. Per-plugin
 * `PermissionsRegistryService` registrations are aggregated here so the
 * permission backend can hydrate a permission name into its full
 * {@link @backstage/plugin-permission-common#Permission} shape (including
 * `attributes` and the basic/resource discriminator) without proxying to the
 * owning plugin per request.
 *
 * @alpha
 */
export interface RootPermissionsRegistryService {
  /**
   * Register permissions from a specific plugin. Plugins should not normally
   * call this directly — the per-plugin permissions registry service already
   * forwards `addPermissions` calls into the root registry.
   */
  addPermissions(pluginId: string, permissions: Permission[]): void;

  /**
   * Look up a registered permission by its `name`. Returns `undefined` if no
   * plugin has registered a permission with that name.
   */
  getPermission(name: string): Permission | undefined;

  /**
   * Returns every registered permission paired with the id of the plugin that
   * registered it. Useful for diagnostics and tooling that needs to enumerate
   * the deployment's permission surface.
   */
  listPermissions(): ReadonlyArray<RootPermissionsRegistryEntry>;
}

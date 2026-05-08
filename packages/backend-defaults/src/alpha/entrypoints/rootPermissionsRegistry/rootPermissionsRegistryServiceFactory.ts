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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import {
  RootPermissionsRegistryEntry,
  RootPermissionsRegistryService,
  rootPermissionsRegistryServiceRef,
} from '@backstage/backend-plugin-api/alpha';
import { Permission } from '@backstage/plugin-permission-common';

/**
 * Default in-memory implementation of the
 * {@link @backstage/backend-plugin-api/alpha#RootPermissionsRegistryService}.
 *
 * Per-plugin {@link @backstage/backend-plugin-api#PermissionsRegistryService}
 * registrations forward into this aggregate, giving the permission backend a
 * single place to hydrate permission names without proxying to the owning
 * plugin per request.
 *
 * @alpha
 */
export const rootPermissionsRegistryServiceFactory = createServiceFactory({
  service: rootPermissionsRegistryServiceRef,
  deps: { logger: coreServices.rootLogger },
  async factory({ logger }) {
    const entries = new Map<string, RootPermissionsRegistryEntry>();

    return {
      addPermissions(pluginId: string, permissions: Permission[]) {
        for (const permission of permissions) {
          const existing = entries.get(permission.name);
          if (existing && existing.pluginId !== pluginId) {
            // Two different plugins registered the same name. We keep the
            // first registration for stability and log so adopters can find
            // and resolve the conflict; last-writer-wins would silently
            // change behavior depending on plugin init order.
            logger.warn(
              `Plugin '${pluginId}' tried to register permission '${permission.name}' which is already owned by plugin '${existing.pluginId}'; ignoring duplicate`,
            );
            continue;
          }
          entries.set(permission.name, { pluginId, permission });
        }
      },
      getPermission(name: string) {
        return entries.get(name)?.permission;
      },
      listPermissions() {
        return Array.from(entries.values());
      },
    } satisfies RootPermissionsRegistryService;
  },
});

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

import {
  PermissionsRegistryService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import {
  PermissionResourceRef,
  createPermissionIntegrationRouter,
} from '@backstage/plugin-permission-node';

function assertRefPluginId(ref: PermissionResourceRef, pluginId: string) {
  if (ref.pluginId !== pluginId) {
    throw new Error(
      `Resource type '${ref.resourceType}' belongs to plugin '${ref.pluginId}', but was used with plugin '${pluginId}'`,
    );
  }
}

/**
 * Permission system integration for registering resources and permissions.
 *
 * See {@link @backstage/core-plugin-api#PermissionsRegistryService}
 * and {@link https://backstage.io/docs/backend-system/core-services/permission-integrations | the service docs}
 * for more information.
 *
 * @public
 */
export const permissionsRegistryServiceFactory = createServiceFactory({
  service: coreServices.permissionsRegistry,
  deps: {
    lifecycle: coreServices.lifecycle,
    httpRouter: coreServices.httpRouter,
    pluginMetadata: coreServices.pluginMetadata,
  },
  async factory({ httpRouter, lifecycle, pluginMetadata }) {
    const router = createPermissionIntegrationRouter();
    const pluginId = pluginMetadata.getId();

    httpRouter.use(router);

    let started = false;
    lifecycle.addStartupHook(() => {
      started = true;
    });

    return {
      addResourceType(resource) {
        if (started) {
          throw new Error(
            'Cannot add permission resource types after the plugin has started',
          );
        }
        assertRefPluginId(resource.resourceRef, pluginId);
        router.addResourceType({
          ...resource,
          resourceType: resource.resourceRef.resourceType,
        });
      },
      addPermissions(permissions) {
        if (started) {
          throw new Error(
            'Cannot add permissions after the plugin has started',
          );
        }
        router.addPermissions(permissions);
      },
      addPermissionRules(rules) {
        if (started) {
          throw new Error(
            'Cannot add permission rules after the plugin has started',
          );
        }
        router.addPermissionRules(rules);
      },
      getPermissionRuleset(resourceRef) {
        assertRefPluginId(resourceRef, pluginId);
        return router.getPermissionRuleset(resourceRef);
      },
    } satisfies PermissionsRegistryService;
  },
});

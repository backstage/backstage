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
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
import { jenkinsPermissionRules } from './rules';
import { parseEntityRef } from '@backstage/catalog-model';
import type { PluginEndpointDiscovery } from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import { RESOURCE_TYPE_JENKINS } from '@backstage/plugin-jenkins-common';

export const jenkinsPermissionIntegrationRouterFactory = (
  discoveryApi: PluginEndpointDiscovery,
  fetchApi?: { fetch: typeof fetch },
) => {
  const catalogApi = new CatalogClient({ discoveryApi, fetchApi: fetchApi });
  return createPermissionIntegrationRouter({
    resourceType: RESOURCE_TYPE_JENKINS,
    rules: Object.values(jenkinsPermissionRules),
    getResources: resourceRefs => {
      const entities = resourceRefs.map(async resourceRef => {
        const { kind, namespace, name } = parseEntityRef(resourceRef);
        return catalogApi.getEntityByName({ kind, name, namespace });
      });
      // combine the promises to return entities as any array, getResources expects a single promise with all entities
      return Promise.all(entities);
    },
  });
};

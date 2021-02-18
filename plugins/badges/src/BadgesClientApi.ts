/*
 * Copyright 2021 Spotify AB
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

import { generatePath } from 'react-router';
import { createApiRef, ConfigApi, DiscoveryApi } from '@backstage/core';
import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { entityRoute } from '@backstage/plugin-catalog-react';

export class BadgesClientApi {
  private readonly configApi: ConfigApi;
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { configApi: ConfigApi; discoveryApi: DiscoveryApi }) {
    this.configApi = options.configApi;
    this.discoveryApi = options.discoveryApi;
  }

  async getEntityPoweredByMarkdownCode(entity: Entity): string {
    const badge = await this.getEntityPoweredByBadgeURL(entity);
    const target = this.getEntityLink(entity);
    return `[![Powered by Backstage](${badge})](${target})`;
  }

  async getEntityPoweredByBadgeURL(entity: Entity): string {
    const routeParams = this.getEntityRouteParams(entity);
    const path = generatePath(entityRoute.path, routeParams);
    return `${await this.discoveryApi.getBaseUrl('badges')}/entity/${path}`;
  }

  private getEntityLink(entity: Entity): string {
    const routeParams = this.getEntityRouteParams(entity);
    const path = generatePath(entityRoute.path, routeParams);
    return `${this.configApi.getString('app.baseUrl')}/catalog/${path}`;
  }

  private getEntityRouteParams(entity: Entity) {
    return {
      kind: entity.kind.toLowerCase(),
      namespace:
        entity.metadata.namespace?.toLowerCase() ?? ENTITY_DEFAULT_NAMESPACE,
      name: entity.metadata.name,
    };
  }
}

export const badgesClientApiRef = createApiRef<typeof BadgesClientApi>({
  id: 'plugin.badges.client',
  description: 'Used by the badges plugin to create badge URLs',
});

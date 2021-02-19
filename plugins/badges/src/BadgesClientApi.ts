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

// TODO: place interpolate code someplace re-usable...
// import { interpolate } from '@backstage/plugin-badges-backend';
function interpolate(template, params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  // eslint-disable-next-line no-new-func
  return new Function(...names, `return \`${template}\`;`)(...vals);
}

export class BadgesClientApi {
  private readonly configApi: ConfigApi;
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { configApi: ConfigApi; discoveryApi: DiscoveryApi }) {
    this.configApi = options.configApi;
    this.discoveryApi = options.discoveryApi;
  }

  async getDefaultContext(entity: Entity) {
    return {
      app: {
        title: this.configApi.getString('app.title'),
      },
      entity,
      entity_url: entity && (await this.getEntityLink(entity)),
    };
  }

  async getDefinedBadges(badgeKind: string, context: object) {
    const badges = [];
    const badgesConfig = this.configApi.getOptional('badges') ?? {};

    for (const [badgeId, badge] of Object.entries(badgesConfig)) {
      if (!badgeKind || !badge.kind || badgeKind === badge.kind) {
        badges.push(await this.renderBadgeInfo(badgeId, badge, context));
      }
    }

    return badges;
  }

  private async renderBadgeInfo(id, badge, context) {
    const info = {
      id,
      url: context.entity && (await this.getEntityBadgeURL(id, context.entity)),
      title: badge.title && this.render(badge.title, context),
      description: this.render(badge.description || id, context),
      target: badge.target && this.render(badge.target, context),
    };
    info.markdown = this.getBadgeMarkdownCode(info);
    return info;
  }

  private async getEntityBadgeURL(badgeId: string, entity: Entity): string {
    const routeParams = this.getEntityRouteParams(entity);
    const path = generatePath(entityRoute.path, routeParams);
    return `${await this.discoveryApi.getBaseUrl(
      'badges',
    )}/entity/${path}/${badgeId}`;
  }

  private getBadgeMarkdownCode(badge: object): string {
    const title = badge.title && ` "${badge.title}"`;
    const img = `![${badge.description}](${badge.url}${title})`;
    if (!badge.target) {
      return img;
    }
    return `[${img}](${badge.target})`;
  }

  private render(template, context) {
    try {
      return interpolate(template.replace('$$', '$'), context);
    } catch (err) {
      return `${err} [${template}]`;
    }
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

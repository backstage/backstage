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
import { ConfigApi, DiscoveryApi } from '@backstage/core';
import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { entityRoute } from '@backstage/plugin-catalog-react';
import { Badge, BadgesApi, BadgeConfig, BadgeSpec } from './types';

export class BadgesClient implements BadgesApi {
  private readonly configApi: ConfigApi;
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { configApi: ConfigApi; discoveryApi: DiscoveryApi }) {
    this.configApi = options.configApi;
    this.discoveryApi = options.discoveryApi;
  }

  public async getDefinedEntityBadges(entity: Entity): Promise<Badge[]> {
    const badges = [];
    const badgesConfig = this.configApi.getOptional('badges') ?? {};
    const entityBadgeUri = await this.getEntityBadgeUri(entity);

    for (const [badgeId, badge] of Object.entries(badgesConfig)) {
      if (!badge.kind || badge.kind === 'entity') {
        const info = await this.getBadgeInfo(entityBadgeUri, badgeId);
        if (info) {
          badges.push(info);
        }
      }
    }

    return badges;
  }

  private async getBadgeInfo(
    entityBadgeUri: string,
    badgeId: string,
  ): Promise<Badge> {
    const badgeUrl = `${entityBadgeUri}/${badgeId}`;
    const spec = (await (
      await fetch(`${badgeUrl}?format=json`)
    ).json()) as BadgeSpec;

    return {
      id: badgeId,
      markdown: this.getBadgeMarkdownCode(badgeUrl, spec.badge),
      spec,
      url: badgeUrl,
    };
  }

  private async getEntityBadgeUri(entity: Entity): Promise<string> {
    const routeParams = this.getEntityRouteParams(entity);
    const path = generatePath(entityRoute.path, routeParams);
    return `${await this.discoveryApi.getBaseUrl('badges')}/entity/${path}`;
  }

  private getEntityRouteParams(entity: Entity) {
    return {
      kind: entity.kind.toLowerCase(),
      namespace:
        entity.metadata.namespace?.toLowerCase() ?? ENTITY_DEFAULT_NAMESPACE,
      name: entity.metadata.name,
    };
  }

  private getBadgeMarkdownCode(badgeUrl: string, badge: BadgeConfig): string {
    const title = badge.title ? ` "${badge.title}"` : '';
    const img = `![${badge.description || 'badge'}](${badgeUrl}${title})`;
    if (!badge.link) {
      return img;
    }
    return `[${img}](${badge.link})`;
  }
}

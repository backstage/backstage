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

import { Logger } from 'winston';
import { makeBadge } from 'badge-maker';
import { JsonObject } from '@backstage/config';
import { BadgeBuilder, BadgeOptions } from './types';
import { Badge, BadgeStyle, BadgeStyles } from '../../types';
import { interpolate } from '../../utils';

export class DefaultBadgeBuilder implements BadgeBuilder {
  constructor(
    private readonly logger: Logger,
    private readonly config: JsonObject,
  ) {
    for (const [badgeId, badge] of Object.entries(config)) {
      badge.id = badgeId;
    }
  }

  public async getAllBadgeConfigs(): Promise<Badge[]> {
    return Object.values(this.config) as Badge[];
  }

  public async getBadgeConfig(badgeId: string): Promise<Badge> {
    return ((this.config[badgeId] as unknown) ||
      (this.config.default as unknown) || {
        label: 'Unknown badge ID',
        message: badgeId,
        color: 'red',
      }) as Badge;
  }

  public async createBadge(options: BadgeOptions): Promise<string> {
    const { context, config: badge } = options;
    const params = {
      label: this.render(badge.label, context),
      message: this.render(badge.message, context),
      color: badge.color || '#36BAA2',
    } as Badge;

    if (badge.labelColor) {
      params.labelColor = badge.labelColor;
    }

    if (BadgeStyles.includes(badge.style as BadgeStyle)) {
      params.style = badge.style as BadgeStyle;
    }

    switch (options.format) {
      case 'json':
        if (badge.link) {
          params.link = this.render(badge.link, context);
        }

        params.description = badge.description
          ? this.render(badge.description, context)
          : badge.id;
        params.markdown = this.getMarkdownCode(params, context.badge_url);

        return JSON.stringify(
          {
            badge: params,
            ...options,
          },
          null,
          2,
        );
      case 'svg':
        try {
          return makeBadge(params);
        } catch (err) {
          return makeBadge({
            label: 'Invalid badge parameters',
            message: `${err}`,
            color: 'red',
          });
        }
      default:
        throw new TypeError(`unsupported badge format: ${options.format}`);
    }
  }

  private render(template: string, context: object): string {
    try {
      return interpolate(template.replace(/_{/g, '${'), context);
    } catch (err) {
      this.logger.info(
        `badge template error: ${err}. In template: "${template}"`,
      );
      return `${err} [${template}]`;
    }
  }

  private getMarkdownCode(params: Badge, badge_url: string): string {
    const alt_text = `${params.description}, ${params.label}: ${params.message}`;
    const tooltip = params.description ? ` "${params.description}"` : '';
    const img = `![${alt_text}](${badge_url}${tooltip})`;
    return params.link ? `[${img}](${params.link})` : img;
  }
}

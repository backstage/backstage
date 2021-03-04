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

import { makeBadge, Format } from 'badge-maker';
import { BadgeBuilder, BadgeOptions } from './types';
import { Badge, BadgeFactories } from '../../types';

export class DefaultBadgeBuilder implements BadgeBuilder {
  constructor(private readonly factories: BadgeFactories) {}

  public async getBadgeIds(): Promise<string[]> {
    return Object.keys(this.factories);
  }

  public async createBadge(options: BadgeOptions): Promise<string> {
    const factory = this.factories[options.badgeId];
    const badge = factory
      ? factory.createBadge(options.context)
      : ({
          label: 'unknown badge',
          message: options.badgeId,
          color: 'red',
        } as Badge);

    if (!badge) {
      return '';
    }

    switch (options.format) {
      case 'json':
        return JSON.stringify(
          {
            badge,
            id: options.badgeId,
            url: options.context.badgeUrl,
            markdown: this.getMarkdownCode(badge, options.context.badgeUrl),
          },
          null,
          2,
        );
      case 'svg':
        try {
          const format = {
            message: badge.message,
            color: badge.color || '#36BAA2',
            label: badge.label || '',
            labelColor: badge.labelColor || '',
            style: badge.style || 'flat-square',
          } as Format;
          return makeBadge(format);
        } catch (err) {
          return makeBadge({
            label: 'invalid badge',
            message: `${err}`,
            color: 'red',
          });
        }
      default:
        throw new TypeError(`unsupported badge format: ${options.format}`);
    }
  }

  private getMarkdownCode(params: Badge, badge_url: string): string {
    let alt_text = `${params.label}: ${params.message}`;
    if (params.description && params.description !== params.label) {
      alt_text = `${params.description}, ${alt_text}`;
    }
    const tooltip = params.description ? ` "${params.description}"` : '';
    const img = `![${alt_text}](${badge_url}${tooltip})`;
    return params.link ? `[${img}](${params.link})` : img;
  }
}

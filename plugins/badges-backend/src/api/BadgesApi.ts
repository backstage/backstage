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
import { makeBadge, ValidationError } from 'badge-maker';
import {} from './types';
import { interpolate } from '../utils';

export interface BadgeConfig {
  kind?: 'entity';
  label: string;
  color: string;
  message: string;
}

export class BadgesApi {
  constructor(
    private readonly logger: Logger,
    private readonly config: { [id: string]: BadgeConfig },
  ) {}

  public getBadge(badgeKind: string, badgeId: string, context: object) {
    const badge = this.config[badgeId] || this.config.default;

    if (!badge) {
      return makeBadge({
        label: 'Unknown badge ID',
        message: badgeId,
        color: 'red',
      });
    }

    if (badge.kind && badge.kind !== badgeKind) {
      return makeBadge({
        label: 'Invalid badge kind',
        message: `${badgeId} is for ${badge.kind} not ${badgeKind}`,
        color: 'red',
      });
    }

    const svg = makeBadge({
      label: this.render(badge.label, context),
      message: this.render(badge.message, context),
      color: badge.color || '#36BAA2',
    });

    return svg;
  }

  private render(template, context) {
    try {
      return interpolate(template.replace('$$', '$'), context);
    } catch (err) {
      return `${err} [${template}]`;
    }
  }
}

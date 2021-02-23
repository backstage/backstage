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

import { Entity } from '@backstage/catalog-model';
import { createApiRef } from '@backstage/core';

export const badgesApiRef = createApiRef<BadgesApi>({
  id: 'plugin.badges.client',
  description: 'Used to make requests to the badges backend',
});

export type BadgeStyle =
  | 'plastic'
  | 'flat'
  | 'flat-square'
  | 'for-the-badge'
  | 'social';

interface BadgeParams {
  color?: string;
  description?: string;
  kind?: 'entity';
  label: string;
  labelColor?: string;
  link?: string;
  message: string;
  style?: BadgeStyle;
}

interface Badge extends BadgeParams {
  markdown: string;
}

interface BadgeConfig extends BadgeParams {
  id: string;
}

export interface BadgeSpec {
  /** The rendered fields, markdown code */
  badge: Badge;

  /** The configuration data, with placeholders and all */
  config: BadgeConfig;

  /** The context used when rendering config -> badge */
  context: {
    // here is more, but only badge_url we care about
    badge_url: string;
  };

  format: 'json'; // or 'svg', but we'll never see that as structured
  // data, only as an svg element
}

export interface BadgesApi {
  getEntityBadgeSpecs(entity: Entity): Promise<BadgeSpec[]>;
}

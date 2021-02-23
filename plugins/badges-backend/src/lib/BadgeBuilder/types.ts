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
import { Badge } from '../../types';

export type BadgeOptions = {
  context: {
    app?: {
      title: string;
    };
    entity?: Entity;
    entity_url?: string;
    badge_url?: string;
  };
  config: Badge;
  format: 'svg' | 'json';
};

export type BadgeBuilder = {
  createBadge(options: BadgeOptions): Promise<string>;
  getBadgeConfig(badgeId: string): Promise<Badge>;
  getAllBadgeConfigs(): Promise<Badge[]>;
};

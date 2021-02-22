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

export const BadgeStyles = [
  'plastic',
  'flat',
  'flat-square',
  'for-the-badge',
  'social',
] as const;
export type BadgeStyle = typeof BadgeStyles[number];

export interface BadgeConfig {
  kind?: 'entity';
  label: string;
  message: string;
  color?: string;
  labelColor?: string;
  style?: BadgeStyle;
  title?: string;
  description?: string;
  link?: string;
}

export type BadgeOptions = {
  context: object;
  config: BadgeConfig;
  format: 'svg' | 'json';
};

export type BadgeBuilder = {
  createBadge(options: BadgeOptions): Promise<string>;
  getBadgeConfig(badgeId: string): Promise<BadgeConfig>;
};

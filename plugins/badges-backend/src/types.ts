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

export const BADGE_STYLES = [
  'plastic',
  'flat',
  'flat-square',
  'for-the-badge',
  'social',
] as const;
export type BadgeStyle = typeof BADGE_STYLES[number];

export interface Badge {
  /** Unique name for the badge. */
  id?: string;
  /** Badge message background color. */
  color?: string;
  /** Badge description (tooltip text) */
  description?: string;
  /** Kind of badge (in what context may it be used) */
  kind?: 'entity';
  /**
   * Badge label (should be a rather static value)
   * ref. shields spec https://github.com/badges/shields/blob/master/spec/SPECIFICATION.md
   */
  label: string;
  /** Badge label background color */
  labelColor?: string;
  /** Custom badge link */
  link?: string;
  /** Badge message */
  message: string;
  /** Badge style (apperance). One of "plastic", "flat", "flat-square", "for-the-badge" and "social" */
  style?: BadgeStyle;
  /** (generated) markdown code */
  markdown?: string;
}

export interface BadgeConfig {
  [id: string]: Badge;
}

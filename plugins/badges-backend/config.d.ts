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

export interface Config {
  /**
   * Define all badges.
   *
   * The `label` and `message` fields may use templating to support
   * dynamic content, based on context. Use same syntax as for
   * javascript template literals, but with double `$$`.
   *
   */
  badges?: {
    [badgeId: string]: {
      /**
       * (Optional) Badge kind.
       *
       * Restrict badge usage to a certain kind only.
       * Useful when using templating for label and/or message if they
       * use context data only available for a certain kind of badge.
       *
       * Available badge kinds:
       *
       *   * `entity` The entity data is available as `entity` in the template.
       *
       * Default context for all badges:
       *
       *   * `app.title` As configured or defaults to "Backstage".
       *
       */
      kind?: 'entity';

      /**
       * The badge label.
       */
      label: string;

      /**
       * The badge color. Default: `#36BAA2`.
       */
      color?: string;

      /**
       * The badge message.
       */
      message: string;
    };
  };
}

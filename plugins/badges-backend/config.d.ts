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
   * javascript template literals, but with `_` instead of `$`,
   * e.g. `_{context.variable.name}`.
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
       *   * `entity_url` The (frontend) URL to view the entity in Backstage.
       *
       * Default context for all badges:
       *
       *   * `app.title` As configured or defaults to "Backstage".
       *
       * @visibility frontend
       */
      kind?: 'entity';

      /**
       * The badge label.
       *
       */
      label: string;

      /**
       * The badge message.
       */
      message: string;

      /**
       * The message color. Default: `#36BAA2`.
       */
      color?: string;

      /**
       * The label color. Default: `gray`.
       */
      labelColor?: string;

      /**
       * Visual design of the badge. One of: 'plastic', 'flat', 'flat-square',
       * 'for-the-badge' or 'social'.
       */
      style?: 'plastic' | 'flat' | 'flat-square' | 'for-the-badge' | 'social';

      /**
       * Badge title, used as tooltip text in the markdown code.
       *
       * @visibility frontend
       */
      title?: string;

      /**
       * Badge description, used as alt text in the markdown code.
       * Defaults to badge id.
       *
       * @visibility frontend
       */
      description?: string;

      /**
       * Badge link URL, turns badge into a link in the markdown code.
       *
       * For `entity` badges, there is a `entity_url` in the context
       * that could be appropriate to use here.
       *
       * @visibility frontend
       */
      link?: string;
    };
  };
}

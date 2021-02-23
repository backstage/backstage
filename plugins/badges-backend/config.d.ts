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
   * Define custom badges. By default, the badges are declared in
   * code, and passed to the badges backend `createRouter`, which
   * merges them with any additional badges defined in this
   * configuration.
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
       * Context per badge kind.
       *
       * Entity badges:
       *
       *   * `entity` The entity data is available as `entity` in the template.
       *   * `entity_url` The (frontend) URL to view the entity in Backstage.
       *
       * Default context for all badges:
       *
       *   * `app.title` As configured or defaults to "Backstage".
       *   * `badge_url` The URL to the badge image.
       *
       */
      kind?: 'entity';

      /**
       * The badge label.
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
       *
       * Default: 'flat'
       *
       */
      style?: 'plastic' | 'flat' | 'flat-square' | 'for-the-badge' | 'social';

      /**
       * Badge description, used as prefix on the alt text in the markdown code.
       *
       * Defaults to badge id.
       *
       */
      description?: string;

      /**
       * Badge link URL, turns badge into a link in the markdown code.
       *
       * For `entity` badges, there is a `entity_url` in the context
       * that could be appropriate to use here.
       *
       * Defaults to the `entity_url`, set to falsey value to disable the link.
       *
       */
      link?: string;
    };
  };
}

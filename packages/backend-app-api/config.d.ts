/*
 * Copyright 2020 The Backstage Authors
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
  backend?: {
    /** Used by the feature discovery service */
    packages?:
      | 'all'
      | {
          include?: string[];
          exclude?: string[];
        };

    startup?: {
      default?: {
        /**
         * The default value for `onPluginBootFailure` if not specified for a particular plugin.
         * This defaults to 'abort', which means `onPluginBootFailure: continue` must be specified
         * for backend startup to continue on plugin boot failure. This can also be set to
         * 'continue', which flips the logic for individual plugins so that they must be set to
         * `onPluginBootFailure: abort` to be required.
         */
        onPluginBootFailure?: 'continue' | 'abort';
      };
      plugins?: {
        [pluginId: string]: {
          /**
           * Used to control backend startup behavior when this plugin fails to boot up. Setting
           * this to `continue` allows the backend to continue starting up, even if this plugin
           * fails. This can enable leaving a crashing plugin installed, but still permit backend
           * startup, which may help troubleshoot data-dependent issues. Plugin failures for plugins
           * set to `abort` are fatal (this is the default unless overridden by the `default`
           * setting).
           */
          onPluginBootFailure?: 'continue' | 'abort';
        };
      };
    };
  };
}

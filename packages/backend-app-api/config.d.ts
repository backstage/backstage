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
         * The default value for `optional` if not specified for a particular plugin. This defaults to
         * false, which means `optional: true` must be specified for individual plugins to be considered
         * optional. This can also be set to true, which flips the logic for individual plugins so that
         * they must be set to `optional: false` to be required.
         */
        optional?: boolean;
      };
      plugins?: {
        [pluginId: string]: {
          /**
           * Used to mark plugins as optional, which allows the backend to start up even in the event
           * of a plugin failure. Plugin failures without this configuration are fatal. This can
           * enable leaving a crashing plugin installed, but still permit backend startup, which may
           * help troubleshoot data-dependent issues.
           */
          optional?: boolean;
        };
      };
    };
  };
}

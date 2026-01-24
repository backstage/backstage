/*
 * Copyright 2023 The Backstage Authors
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
  app?: {
    experimental?: {
      /**
       * @visibility frontend
       * @deepVisibility frontend
       * @deprecated This is no longer experimental; use `app.packages` instead.
       */
      packages?: 'all' | { include?: string[]; exclude?: string[] };
    };

    /**
     * Controls what packages are loaded by the new frontend system.
     *
     * @remarks
     *
     * When using the 'all' option, all feature packages that were added as
     * dependencies to the app will be loaded automatically.
     *
     * The `include` and `exclude` options can be used to more finely control
     * which individual package names to include or exclude.
     *
     * @visibility frontend
     * @deepVisibility frontend
     */
    packages?: 'all' | { include?: string[]; exclude?: string[] };

    routes?: {
      /**
       * Maps external route references to regular route references. Both the
       * key and the value is expected to be on the form `<pluginId>.<routeId>`.
       * If the value is `false`, the route will be disabled even if it has a
       * default mapping.
       *
       * @deepVisibility frontend
       */
      bindings?: { [externalRouteRefId: string]: string | false };
    };

    /**
     * @deepVisibility frontend
     */
    extensions?: Array<
      | string
      | {
          [extensionId: string]:
            | boolean
            | {
                attachTo?: { id: string; input: string };
                disabled?: boolean;
                config?: unknown;
              };
        }
    >;

    /**
     * This section enables you to override certain properties of specific or
     * groups of plugins.
     *
     * @remarks
     * All matching entries will be applied to each plugin, with the later
     * entries taking precedence.
     *
     * This configuration is intended to be used primarily to apply overrides
     * for third-party plugins.
     *
     * @deepVisibility frontend
     */
    pluginOverrides?: Array<{
      /**
       * The criteria for matching plugins to override.
       *
       * @remarks
       * If no match criteria are provided, the override will be applied to
       * all plugins.
       */
      match?: {
        /**
         * A pattern that is matched against the plugin ID.
         *
         * @remarks
         * By default the string is interpreted as a glob pattern, but if the
         * string is surrounded by '/' it is interpreted as a regex.
         */
        pluginId?: string;

        /**
         * A pattern that is matched against the package name.
         *
         * @remarks
         * By default the string is interpreted as a glob pattern, but if the
         * string is surrounded by '/' it is interpreted as a regex.
         *
         * Note that this will only work for plugins that provide a
         * `package.json` info loader.
         */
        packageName?: string;
      };
      /**
       * Overrides individual top-level fields of the plugin info.
       */
      info: {
        /**
         * Override the description of the plugin.
         */
        description?: string;
        /**
         * Override the owner entity references of the plugin.
         *
         * @remarks
         * The provided values are interpreted as entity references defaulting
         * to Group entities in the default namespace.
         */
        ownerEntityRefs?: string[];
        /**
         * Override the links of the plugin.
         */
        links?: Array<{ title: string; url: string }>;
      };
    }>;
  };
}

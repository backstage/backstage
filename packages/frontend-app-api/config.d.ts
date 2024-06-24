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
       */
      packages?: 'all' | { include?: string[]; exclude?: string[] };
    };

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
  };
}

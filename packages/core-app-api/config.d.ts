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
  /**
   * Generic frontend configuration.
   */
  app: {
    /**
     * The public absolute root URL that the frontend.
     * @visibility frontend
     */
    baseUrl: string;

    /**
     * The title of the app, as shown in the Backstage web interface.
     * @visibility frontend
     */
    title?: string;

    /**
     * Information about support of this Backstage instance and how to contact the integrator team.
     */
    support?: {
      /**
       * The primary support url.
       * @visibility frontend
       */
      url: string;
      /**
       * A list of categorized support item groupings.
       */
      items: Array<{
        /**
         * The title of the support item grouping.
         * @visibility frontend
         */
        title: string;
        /**
         * An optional icon for the support item grouping.
         * @visibility frontend
         */
        icon?: string;
        /**
         * A list of support links for the Backstage instance inside this grouping.
         */
        links: Array<{
          /** @visibility frontend */
          url: string;
          /** @visibility frontend */
          title?: string;
        }>;
      }>;
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
  };

  /**
   * Generic backend configuration.
   */
  backend: {
    /**
     * The public absolute root URL that the backend is reachable at, from the browser's perspective.
     * @visibility frontend
     */
    baseUrl: string;
  };

  /**
   * Configuration that provides information about the organization that the app is for.
   */
  organization?: {
    /**
     * The name of the organization that the app belongs to.
     * @visibility frontend
     */
    name?: string;
  };

  /**
   * This config was used by the HomepageTimer but has been replaced  by the HeaderWorldClock in the home plugin
   *
   * @deprecated in favor of the HeaderWorldClock which is found in the home plugin
   */
  homepage?: {
    clocks?: Array<{
      /** @visibility frontend */
      label: string;
      /** @visibility frontend */
      timezone: string;
    }>;
  };

  /**
   * Configuration that provides information on available configured authentication providers.
   */
  auth?: {
    /**
     * The 'environment' attribute added as an optional parameter to have configurable environment value for `auth.providers`.
     * default value: 'development'
     * optional values: 'development' | 'production'
     * @visibility frontend
     */
    environment?: string;
  };

  /**
   * Enable redirect authentication flow type, instead of a popup for authentication.
   * @defaultValue false
   * @visibility frontend
   */
  enableExperimentalRedirectFlow?: boolean;

  /**
   * Discovery options.
   *
   * @visibility frontend
   */
  discovery?: {
    /**
     * Endpoints
     *
     * A list of target baseUrls and the associated plugins.
     *
     * @visibility frontend
     */
    endpoints?: Array<{
      /**
       * The target baseUrl to use for the plugin
       *
       * Can be either a string or an object with internal and external keys. (Internal is used for the backend, external for the frontend)
       * Targets with `{{pluginId}}` or `{{ pluginId }} in the url will be replaced with the pluginId.
       *
       * @visibility frontend
       */
      target:
        | string
        | {
            /**
             * @visibility frontend
             */
            external?: string;
          };
      /**
       * Array of plugins which use the target baseUrl.
       *
       * @visibility frontend
       */
      plugins: Array<string>;
    }>;
  };
}

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
    auth?: {
      /**
       * This disables the otherwise default auth policy, which requires all
       * requests to be authenticated with either user or service credentials.
       *
       * Disabling this check means that the backend will no longer block
       * unauthenticated requests, but instead allow them to pass through to
       * plugins.
       *
       * If permissions are enabled, unauthenticated requests will be treated
       * exactly as such, leaving it to the permission policy to determine what
       * permissions should be allowed for an unauthenticated identity. Note
       * that this will also apply to service-to-service calls between plugins
       * unless you configure credentials for service calls.
       */
      dangerouslyDisableDefaultAuthPolicy?: boolean;
    };
  };

  /** Discovery options. */
  discovery?: {
    /**
     * Endpoints
     *
     * A list of target baseUrls and the associated plugins.
     */
    endpoints: {
      /**
       * The target baseUrl to use for the plugin
       *
       * Can be either a string or an object with internal and external keys.
       * Targets with `{{pluginId}}` or `{{ pluginId }} in the url will be replaced with the pluginId.
       */
      target: string | { internal: string; external: string };
      /** Array of plugins which use the target baseUrl. */
      plugins: string[];
    }[];
  };
}

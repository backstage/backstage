/*
 * Copyright 2022 The Backstage Authors
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
   * DevTools configuration.
   */
  devTools?: {
    /**
     * External dependency configuration.
     */
    externalDependencies?: {
      /**
       * The list of endpoints to check.
       */
      endpoints?: Array<{
        /**
         * The name of the endpoint.
         */
        name: string;
        /**
         * Type of check to perform; currently fetch or ping
         */
        type: string;
        /**
         * The target of the endpoint; currently either a URL for fetch or server name for ping.
         */
        target: string;
      }>;
    };
    /**
     * Info configuration
     */
    info?: {
      /**
       * A list of package prefixes that DevTools will use for filtering all available dependencies
       * (default is ["@backstage"])
       */
      packagePrefixes?: string[];
    };
  };
}

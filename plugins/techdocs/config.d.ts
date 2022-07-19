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
   * Configuration options for the techdocs plugin
   * @see http://backstage.io/docs/features/techdocs/configuration
   */
  techdocs: {
    /**
     * Documentation building process depends on the builder attr
     * @visibility frontend
     */
    builder: 'local' | 'external';

    /**
     * Allows fallback to case-sensitive triplets in case of migration issues.
     * @visibility frontend
     * @see https://backstage.io/docs/features/techdocs/how-to-guides#how-to-migrate-from-techdocs-alpha-to-beta
     */
    legacyUseCaseSensitiveTripletPaths?: boolean;

    sanitizer?: {
      /**
       * Allows iframe tag only for listed hosts
       * Example:
       *  allowedIframeHosts: ["example.com"]
       *  this will allow all iframes with the host `example.com` in the src attribute
       * @visibility frontend
       */
      allowedIframeHosts?: string[];
    };
  };
}

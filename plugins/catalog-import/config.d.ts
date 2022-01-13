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
   * Configuration options for the catalog plugin.
   */
  catalog?: {
    /**
     * List of import flow specific options and attributes
     */
    import?: {
      /**
       * Catalog entity descriptor filename, defaults to "catalog-info.yaml"
       * @visibility frontend
       */
      entityFilename?: string;
      /**
       * A branch name used in pull request when registering existing component via UI
       * Valid git refname required, see: https://git-scm.com/docs/git-check-ref-format
       * Defaults to "backstage-integration"
       * @visibility frontend
       */
      pullRequestBranchName?: string;
    };
  };
}

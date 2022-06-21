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

interface AzureDevOpsConfig {
  /**
   * (Optional) The DevOps host; leave empty for `dev.azure.com`, otherwise set to your self-hosted instance host.
   * @visibility backend
   */
  host: string;
  /**
   * (Required) Your organization slug.
   * @visibility backend
   */
  organization: string;
  /**
   * (Required) Your project slug.
   * @visibility backend
   */
  project: string;
  /**
   * (Optional) The repository name. Wildcards are supported as show on the examples above.
   * If not set, all repositories will be searched.
   * @visibility backend
   */
  repository?: string;
  /**
   * (Optional) Where to find catalog-info.yaml files. Wildcards are supported.
   * If not set, defaults to /catalog-info.yaml.
   * @visibility backend
   */
  path?: string;
}

export interface Config {
  catalog?: {
    /**
     * List of provider-specific options and attributes
     */
    providers?: {
      /**
       * AzureDevopsEntityProvider configuration
       */
      azureDevOps?: Record<string, AzureDevOpsConfig>;
    };
  };
}

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
  catalog?: {
    /**
     * List of provider-specific options and attributes
     */
    providers?: {
      /**
       * BitbucketCloudEntityProvider configuration
       *
       * Uses "default" as default id for the single config variant.
       */
      bitbucketCloud?:
        | {
            /**
             * (Optional) Path to the catalog file. Default to "/catalog-info.yaml".
             * @visibility frontend
             */
            catalogPath?: string;
            /**
             * (Required) Your workspace.
             * @visibility frontend
             */
            workspace: string;
            /**
             * (Optional) Filters applied to discovered catalog files in repositories.
             * @visibility frontend
             */
            filters?: {
              /**
               * (Optional) Filter for the repository slug.
               * @visibility frontend
               */
              repoSlug?: RegExp;
              /**
               * (Optional) Filter for the project key.
               * @visibility frontend
               */
              projectKey?: RegExp;
            };
          }
        | Record<
            string,
            {
              /**
               * (Optional) Path to the catalog file. Default to "/catalog-info.yaml".
               * @visibility frontend
               */
              catalogPath?: string;
              /**
               * (Required) Your workspace.
               * @visibility frontend
               */
              workspace: string;
              /**
               * (Optional) Filters applied to discovered catalog files in repositories.
               * @visibility frontend
               */
              filters?: {
                /**
                 * (Optional) Filter for the repository slug.
                 * @visibility frontend
                 */
                repoSlug?: RegExp;
                /**
                 * (Optional) Filter for the project key.
                 * @visibility frontend
                 */
                projectKey?: RegExp;
              };
            }
          >;
    };
  };
}

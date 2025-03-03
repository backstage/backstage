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
  catalog?: {
    providers?: {
      /**
       * BackstageOpenApiEntityProvider configuration
       */
      backstageOpenapi?: {
        /**
         * A list of plugins, whose OpenAPI specs you want to collate in `InternalOpenApiDocumentationProvider`.
         */
        plugins: string[];
        /**
         * Properties to override on the final entity object.
         */
        entityOverrides?: object;
        /**
         * The format of the definition.
         * @defaultValue json
         */
        definitionFormat?: 'json' | 'yaml';
      };
    };
  };
}

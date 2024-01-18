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

import { TaskScheduleDefinitionConfig } from '@backstage/backend-tasks';

export interface Config {
  search?: {
    collators?: {
      /**
       * Configuration options for `@backstage/plugin-search-backend-module-catalog`
       */
      catalog?: {
        /**
         * A templating string with placeholders, to form the final location of
         * the entity.
         *
         * Defaults to '/catalog/:namespace/:kind/:name'
         */
        locationTemplate?: string;
        /**
         * A filter expression passed to the catalog client, to select what
         * entities to collate.
         *
         * Defaults to no filter, ie indexing all entities.
         */
        filter?: object;
        /**
         * The number of entities to process at a time. Keep this at a
         * reasonable number to avoid overloading either the catalog or the
         * search backend.
         *
         * Defaults to 500
         */
        batchSize?: number;
        /**
         * The schedule for how often to run the collation job.
         */
        schedule?: TaskScheduleDefinitionConfig;
      };
    };
  };
}

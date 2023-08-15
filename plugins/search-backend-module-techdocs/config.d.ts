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
       * Configuration options for `@backstage/plugin-search-backend-module-techdocs`
       */
      techdocs?: {
        /**
         * The schedule for how often to run the collation job.
         */
        schedule?: TaskScheduleDefinitionConfig;
        /**
         * A templating string with placeholders, to form the final location of
         * the entity.
         *
         * Defaults to `'/docs/:namespace/:kind/:name/:path'`.
         */
        locationTemplate?: string;
        /**
         * An abstract value that controls the concurrency level of the
         * collation process. Increasing this value will both increase the
         * number of entities fetched at a time from the catalog, as well as how
         * many things are being processed concurrently.
         *
         * Defaults to `10`.
         */
        parallelismLimit?: number;
        /**
         * Defaults to `false`.
         */
        legacyPathCasing?: boolean;
      };
    };
  };
}

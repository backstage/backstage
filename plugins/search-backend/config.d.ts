/*
 * Copyright 2021 The Backstage Authors
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
  /** Configuration options for the search plugin */
  search?: {
    /**
     * Sets the maximum max page limit size. Defaults to 100.
     */
    maxPageLimit?: number;

    /**
     * Options related to the search integration with the Backstage permissions system
     */
    permissions?: {
      /**
       * Limits the amount of time the search backend will spend retrieving and
       * authorizing results from the search engine when permissions are
       * enabled. When the latency of the query endpoint reaches this threshold,
       * the results obtained up until that point will be returned, even if the
       * page is incomplete.
       *
       * This limit is only expected to be hit for broad queries from users with
       * extremely restrictive visibility, or for very high page offsets.
       *
       * @default 1000
       */
      queryLatencyBudgetMs?: number;
    };
  };
}

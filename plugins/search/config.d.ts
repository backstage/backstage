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
  /** Configuration options for the search plugin */
  search?: {
    /**
     * An object representing the default search query configuration.
     * By configuring and modifying the values of this object,
     * you can customize the default values of the search queries
     * and define how it behaves by default.
     */
    query?: {
      /**
       * A number indicating the maximum number of results to be returned
       * per page during pagination.
       * @visibility frontend
       */
      pageLimit?: 10 | 25 | 50 | 100;
    };
  };
}

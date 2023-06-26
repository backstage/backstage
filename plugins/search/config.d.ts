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
  app: {
    /**
     * Configuration options for the search plugin
     */
    search?: {
      /**
       * An object representing the initial state configuration for the SearchPage
       * component. By configuring and modifying the values of the initialState
       * object attributes, you can customize the initial state of the search component
       * and define how it behaves when it is first loaded or reset.
       */
      initialState?: {
        /**
         * A number indicating the maximum number of results to be returned
         * per page during pagination.
         *
         * @visibility frontend
         */
        pageLimit?: 10 | 25 | 50 | 100;
      };
    };
  };
}

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
     * Options for PG
     */
    pg?: {
      /**
       * Options for configuring highlight settings
       * See https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-HEADLINE
       */
      highlightOptions?: {
        /**
         * Used to enable to disable the highlight feature. The default value is true
         */
        useHighlight?: boolean;
        /**
         * Used to set the longest headlines to output. The default value is 35.
         */
        maxWords?: number;
        /**
         * Used to set the shortest headlines to output. The default value is 15.
         */
        minWords?: number;
        /**
         * Words of this length or less will be dropped at the start and end of a headline, unless they are query terms.
         * The default value of three (3) eliminates common English articles.
         */
        shortWord?: number;
        /**
         * If true the whole document will be used as the headline, ignoring the preceding three parameters. The default is false.
         */
        highlightAll?: boolean;
        /**
         * Maximum number of text fragments to display. The default value of zero selects a non-fragment-based headline generation method.
         * A value greater than zero selects fragment-based headline generation (see the linked documentation above for more details).
         */
        maxFragments?: number;
        /**
         * Delimiter string used to concatenate fragments. Defaults to " ... ".
         */
        fragmentDelimiter?: string;
      };
      /**
       * Batch size to use when indexing
       */
      indexerBatchSize?: number;
    };
  };
}

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
    /**
     * @deepVisibility frontend
     */
    experimentalPagination?:
      | boolean
      | {
          limit?: number;
        };

    /**
     * Configuration for the catalog table columns.
     * Allows customizing which columns are displayed and adding custom columns.
     * @deepVisibility frontend
     */
    table?: {
      /**
       * Column configuration options.
       */
      columns?: {
        /**
         * When specified, only these columns are shown (whitelist mode).
         * Available column IDs: name, owner, type, lifecycle, description, tags, namespace, system, targets
         */
        include?: string[];

        /**
         * Columns to remove from the defaults (blacklist mode).
         * Available column IDs: name, owner, type, lifecycle, description, tags, namespace, system, targets
         */
        exclude?: string[];

        /**
         * Custom columns to add from entity metadata.
         */
        custom?: Array<{
          /**
           * Column header text (required).
           */
          title: string;

          /**
           * Entity field path using dot notation.
           * Supports bracket notation for annotations/labels.
           * Examples: "metadata.name", "metadata.annotations['backstage.io/techdocs-ref']"
           */
          field: string;

          /**
           * Column width in pixels (optional).
           */
          width?: number;

          /**
           * Enable sorting for this column (default: true).
           */
          sortable?: boolean;

          /**
           * Value to display when field is empty (optional).
           */
          defaultValue?: string;

          /**
           * Limit column to specific entity kinds (optional).
           * When specified, the column only appears for these kinds.
           */
          kind?: string | string[];
        }>;
      };
    };
  };
}

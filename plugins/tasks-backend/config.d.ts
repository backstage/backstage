/*
 * Copyright 2025 The Backstage Authors
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
  tasks?: {
    /**
     * List of plugin IDs that can have tasks
     */
    enabledPlugins?: string[];
    /**
     * Global formatting rules for task presentation
     */
    formatting?: {
      /**
       * Generic pattern extraction rules
       * These patterns will be applied to all task IDs to extract meaningful parts
       */
      extractionPatterns?: Array<{
        /**
         * Regex pattern to match task IDs
         */
        pattern: string;
        /**
         * Named groups to extract from the pattern
         * Key is the variable name, value is the capture group index (0-based) or literal string value
         */
        extractions: { [key: string]: number | string };
        /**
         * Priority for pattern matching (higher numbers match first)
         */
        priority?: number;
      }>;
      /**
       * Text transformation rules
       * Applied to extracted values before template substitution
       */
      transformations?: Array<{
        /**
         * Variable name to transform
         */
        variable: string;
        /**
         * Transformation rules as key-value pairs
         * If a value matches a key, it will be replaced with the corresponding value
         * Example: { "gcp": "Google Cloud Platform", "gitlab": "GitLab" }
         */
        rules: { [key: string]: string };
        /**
         * Default transformation for values not found in rules
         * Supported: 'titleCase', 'upperCase', 'lowerCase', 'camelCase', 'kebabToTitle', 'snakeToTitle'
         */
        defaultTransform?:
          | 'titleCase'
          | 'upperCase'
          | 'lowerCase'
          | 'camelCase'
          | 'kebabToTitle'
          | 'snakeToTitle';
      }>;
    };
    /**
     * Optional metadata overrides for specific plugins and tasks
     */
    metadata?: {
      [pluginId: string]: {
        /**
         * Default title for all tasks in this plugin
         */
        title?: string;
        /**
         * Default description for all tasks in this plugin
         */
        description?: string;
        /**
         * Task-specific overrides using array format to support arbitrary task names
         */
        tasks?: Array<{
          /**
           * Task name or regex pattern to match
           */
          name: string;
          /**
           * Custom title for this specific task
           * Supports template substitution with {0}, {1}, etc. for regex capture groups
           * Also supports any variable names from extraction patterns
           */
          title?: string;
          /**
           * Custom description for this specific task
           * Supports template substitution with {0}, {1}, etc. for regex capture groups
           * Also supports any variable names from extraction patterns
           */
          description?: string;
          /**
           * Whether the name is a regex pattern (default: false for exact match)
           */
          isPattern?: boolean;
          /**
           * Priority for pattern matching (higher numbers match first)
           * Useful when multiple patterns could match the same task
           */
          priority?: number;
        }>;
      };
    };
  };
}

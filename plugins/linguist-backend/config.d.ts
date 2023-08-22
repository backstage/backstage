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

import { TaskScheduleDefinition } from '@backstage/backend-tasks';
import { HumanDuration } from '@backstage/types';
import { Options as LinguistJsOptions } from 'linguist-js/dist/types';

export interface Config {
  /** Configuration options for the linguist plugin */
  linguist?: {
    schedule?: TaskScheduleDefinition;
    /**
     * @default 20
     */
    batchSize?: number;
    /**
     * @default false
     */
    useSourceLocation?: boolean;
    /**
     * Refresh generated language breakdown
     */
    age?: HumanDuration;
    /**
     * @default ['API', 'Component', 'Template']
     */
    kind?: string[];
    /**
     * [linguist-js](https://www.npmjs.com/package/linguist-js) options
     */
    linguistJsOptions?: LinguistJsOptions;

    /** Options for the tags processor */
    tagsProcessor?: {
      /**
       * Determines how many bytes of a language should be in a repo
       * for it to be added as an entity tag. Defaults to 0.
       */
      bytesThreshold?: number;
      /**
       * The types of linguist languages that should be processed. Can be
       * any of "programming", "data", "markup", "prose". Defaults to ["programming"].
       */
      languageTypes?: string[];
      /**
       * A custom mapping of linguist languages to how they should be rendered as entity tags.
       * If a language is mapped to '' it will not be included as a tag.
       */
      languageMap?: {
        [language: string]: string | undefined;
      };
      /**
       * How long to cache entity languages for in memory. Used to avoid constant db hits during
       * processing. Defaults to 30 minutes.
       */
      cacheTTL?: HumanDuration;
    };
  };
}

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

import { Visit, VisitsApiQueryParams } from './VisitsApi';
import { Config } from '@backstage/config';

/**
 * Reads a single FilterBy config.
 *
 * @param config - The single config object
 *
 * @public
 */
export function readFilterConfig(config: Config): {
  field: keyof Visit;
  operator: '<' | '<=' | '==' | '!=' | '>' | '>=' | 'contains';
  value: string | number;
} {
  try {
    const field = config.getString('field') as keyof Visit;
    const operator = config.getString('operator') as
      | '<'
      | '<='
      | '=='
      | '!='
      | '>'
      | '>='
      | 'contains';
    const value = config.getString('value');
    return { field, operator, value };
  } catch (error) {
    throw new Error(`Invalid config, ${error}`);
  }
}

/**
 * Reads a set of filter by configs.
 *
 * @param configs - All of the config objects
 *
 * @public
 */
export function createFilterByQueryParamFromConfig(
  configs: Config[],
): VisitsApiQueryParams['filterBy'] | undefined {
  try {
    return configs.map(readFilterConfig);
  } catch {
    return undefined;
  }
}

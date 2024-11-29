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

import {
  Visit,
  VisitsApiQueryParams,
  Operators,
  isOperator,
} from './VisitsApi';
import { Config } from '@backstage/config';

/**
 * Reads a single FilterBy config.
 *
 * @param config - The single config object
 *
 * @public
 */

export function readFilterConfig(config: Config):
  | {
      field: keyof Visit;
      operator: Operators;
      value: string | number;
    }
  | undefined {
  try {
    const field = config.getString('field') as keyof Visit;
    const operator = config.getString('operator');
    const value = getValue(config);
    if (isOperator(operator) && value !== undefined) {
      return { field, operator, value };
    }
    return undefined;
  } catch (error) {
    // invalid filter config - ignore filter
    return undefined;
  }
}

function getValue(config: Config) {
  let value = undefined;
  try {
    value = config.getString('value');
  } catch (error) {
    try {
      value = config.getNumber('value');
    } catch {
      // value is not string or number - ignore filter
    }
  }
  return value;
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
    return configs
      .map(readFilterConfig)
      .filter(Boolean) as VisitsApiQueryParams['filterBy'];
  } catch {
    return undefined;
  }
}

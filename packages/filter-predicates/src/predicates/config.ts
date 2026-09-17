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

import { Config } from '@backstage/config';
import { InputError, stringifyError } from '@backstage/errors';
import { parseFilterPredicate } from './schema';
import { FilterPredicate } from './types';

/**
 * Options for {@link readFilterPredicateFromConfig} and {@link readOptionalFilterPredicateFromConfig}.
 *
 * @public
 */
export interface ReadFilterPredicateFromConfigOptions {
  /**
   * The key to read from the config. If not provided, the entire config is used.
   */
  key?: string;
}

/**
 * Read a filter predicate expression from a config object.
 *
 * @public
 */
export function readFilterPredicateFromConfig(
  config: Config,
  options?: ReadFilterPredicateFromConfigOptions,
): FilterPredicate {
  const key = options?.key;
  const value = key ? config.get(key) : config.get();

  try {
    return parseFilterPredicate(value);
  } catch (error) {
    const where = key ? ` at '${key}'` : '';
    throw new InputError(
      `Could not read filter predicate from config${where}: ${stringifyError(
        error,
      )}`,
    );
  }
}

/**
 * Read an optional filter predicate expression from a config object.
 *
 * @public
 */
export function readOptionalFilterPredicateFromConfig(
  config: Config,
  options?: ReadFilterPredicateFromConfigOptions,
): FilterPredicate | undefined {
  const key = options?.key;
  const value = key ? config.getOptional(key) : config.getOptional();

  if (value === undefined) {
    return undefined;
  }

  return readFilterPredicateFromConfig(config, options);
}

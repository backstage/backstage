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

import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { HumanDuration } from '@backstage/types';

export const propsOfHumanDuration = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
];

/**
 * Reads a duration from a config object.
 *
 * @public
 * @remarks
 *
 * This does not support optionality; if you want to support optional durations,
 * you need to first check the presence of the target with `config.has(...)` and
 * then call this function.
 *
 * @param config - A configuration object
 * @param key - If specified, read the duration from the given subkey
 *        under the config object
 * @returns A duration object
 */
export function readDurationFromConfig(
  config: Config,
  options?: {
    key?: string;
  },
): HumanDuration {
  let root: Config;
  let found = false;
  const result: Record<string, number> = {};

  try {
    root = options?.key ? config.getConfig(options.key) : config;
    for (const prop of propsOfHumanDuration) {
      const value = root.getOptionalNumber(prop);
      if (value !== undefined) {
        result[prop] = value;
        found = true;
      }
    }
  } catch (error) {
    // This needs no contextual key prefix since the config reader adds it to
    // its own errors
    throw new InputError(`Failed to read duration from config, ${error}`);
  }

  try {
    if (!found) {
      const good = propsOfHumanDuration.map(p => `'${p}'`).join(', ');
      throw new Error(`Needs one or more of ${good}`);
    }

    const invalidProps = root
      .keys()
      .filter(prop => !propsOfHumanDuration.includes(prop));
    if (invalidProps.length) {
      const what = invalidProps.length === 1 ? 'property' : 'properties';
      const bad = invalidProps.map(p => `'${p}'`).join(', ');
      const good = propsOfHumanDuration.map(p => `'${p}'`).join(', ');
      throw new Error(
        `Unknown ${what} ${bad}; expected one or more of ${good}`,
      );
    }
  } catch (error) {
    // For our own errors, even though we don't know where we are anchored in
    // the config hierarchy, we try to be helpful and at least add the subkey if
    // we have it
    let prefix = 'Failed to read duration from config';
    if (options?.key) {
      prefix += ` at '${options.key}'`;
    }
    throw new InputError(`${prefix}, ${error}`);
  }

  return result as HumanDuration;
}

/*
 * Copyright 2020 The Backstage Authors
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

import os from 'node:os';

const defaultConcurrency = Math.max(Math.ceil(os.cpus().length / 2), 1);

const CONCURRENCY_ENV_VAR = 'BACKSTAGE_CLI_CONCURRENCY';
const DEPRECATED_CONCURRENCY_ENV_VAR = 'BACKSTAGE_CLI_BUILD_PARALLEL';

type ConcurrencyOption = boolean | string | number | null | undefined;

function parseConcurrencyOption(value: ConcurrencyOption): number {
  if (value === undefined || value === null) {
    return defaultConcurrency;
  } else if (typeof value === 'boolean') {
    return value ? defaultConcurrency : 1;
  } else if (typeof value === 'number' && Number.isInteger(value)) {
    if (value < 1) {
      return 1;
    }
    return value;
  } else if (typeof value === 'string') {
    if (value === 'true') {
      return parseConcurrencyOption(true);
    } else if (value === 'false') {
      return parseConcurrencyOption(false);
    }
    const parsed = Number(value);
    if (Number.isInteger(parsed)) {
      return parseConcurrencyOption(parsed);
    }
  }

  throw Error(
    `Concurrency option value '${value}' is not a boolean or integer`,
  );
}

let hasWarnedDeprecation = false;

/** @internal */
export function getEnvironmentConcurrency() {
  if (process.env[CONCURRENCY_ENV_VAR] !== undefined) {
    return parseConcurrencyOption(process.env[CONCURRENCY_ENV_VAR]);
  }
  if (process.env[DEPRECATED_CONCURRENCY_ENV_VAR] !== undefined) {
    if (!hasWarnedDeprecation) {
      hasWarnedDeprecation = true;
      console.warn(
        `The ${DEPRECATED_CONCURRENCY_ENV_VAR} environment variable is deprecated, use ${CONCURRENCY_ENV_VAR} instead`,
      );
    }
    return parseConcurrencyOption(process.env[DEPRECATED_CONCURRENCY_ENV_VAR]);
  }
  return defaultConcurrency;
}

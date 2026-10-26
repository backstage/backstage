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

import * as winston from 'winston';
import { runCheck } from '@backstage/cli-common';

export async function checkIfDockerIsOperational(
  logger: winston.Logger,
): Promise<boolean> {
  logger.info('Checking Docker status...');
  const isOperational = await runCheck(['docker', 'info']);
  if (isOperational) {
    logger.info(
      'Docker is up and running. Proceed to starting up documentation server',
    );
    return true;
  }
  logger.error(
    'Docker is not running. Exiting. Please check status of Docker daemon with `docker info` before re-running',
  );
  return false;
}

/**
 * Picks the value of a renamed flag, warning whenever the deprecated name is
 * used and noting when it is ignored because the new name is also set.
 */
export function resolveDeprecatedOption(
  logger: { warn(message: string): void },
  options: {
    value: string | undefined;
    flag: string;
    deprecatedValue: string | undefined;
    deprecatedFlag: string;
  },
): string | undefined {
  const { value, flag, deprecatedValue, deprecatedFlag } = options;
  if (deprecatedValue !== undefined) {
    const ignored =
      value !== undefined ? ` Ignoring it because ${flag} is also set.` : '';
    logger.warn(
      `${deprecatedFlag} is deprecated and will be removed in a future release. Use ${flag} instead.${ignored}`,
    );
  }
  return value ?? deprecatedValue;
}

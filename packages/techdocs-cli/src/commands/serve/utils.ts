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

import { promisify } from 'util';
import * as winston from 'winston';
import { execFile } from 'child_process';

export async function checkIfDockerIsOperational(
  logger: winston.Logger,
): Promise<boolean> {
  logger.info('Checking Docker status...');
  try {
    const runCheck = promisify(execFile);
    await runCheck('docker', ['info'], { shell: true });
    logger.info(
      'Docker is up and running. Proceed to starting up mkdocs server',
    );
    return true;
  } catch {
    logger.error(
      'Docker is not running. Exiting. Please check status of Docker daemon with `docker info` before re-running',
    );
    return false;
  }
}

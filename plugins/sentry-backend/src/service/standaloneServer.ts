/*
 * Copyright 2020 Spotify AB
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

import { Server } from 'http';
import { Logger } from 'winston';
import { createStandaloneApplication } from './standaloneApplication';

const PORT = 5009;

export async function startStandaloneServer(
  parentLogger: Logger,
): Promise<Server> {
  const logger = parentLogger.child({ service: 'scaffolder-backend' });
  logger.debug('Creating application...');

  const app = await createStandaloneApplication(logger);

  logger.debug('Starting application server...');
  return await new Promise((resolve, reject) => {
    const server = app.listen(PORT, (err?: Error) => {
      if (err) {
        reject(err);
        return;
      }

      logger.info(`Listening on port ${PORT}`);
      resolve(server);
    });
  });
}

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

import winston, { Logger } from 'winston';

let rootLogger: Logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format:
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.simple(),
        ),
  defaultMeta: { service: 'backstage' },
  transports: [
    new winston.transports.Console({
      silent:
        process.env.JEST_WORKER_ID !== undefined && !process.env.LOG_LEVEL,
    }),
  ],
});

export function getRootLogger(): Logger {
  return rootLogger;
}

export function setRootLogger(newLogger: Logger) {
  rootLogger = newLogger;
}

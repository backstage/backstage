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

import { merge } from 'lodash';
import { Config } from '@backstage/config';
import * as winston from 'winston';
import { LoggerOptions } from 'winston';
import { coloredFormat } from './formats';

type FilteredKeys = Record<string, string>;

let rootLogger: winston.Logger;
let filteredKeys: FilteredKeys;

/**
 {
    secret-1: 'integrations.github[0].token',
    secrets-2: 'something'
 }
 */

/** @public */
export function getRootLogger(): winston.Logger {
  return rootLogger;
}

/** @public */
export function setRootLogger(newLogger: winston.Logger) {
  rootLogger = newLogger;
}

export function setRootLoggerFilteredKeys(_filteredKeys: FilteredKeys) {
  filteredKeys = _filteredKeys;
}

/** @public */
export function createRootLogger(
  options: winston.LoggerOptions = {},
  env = process.env,
): winston.Logger {
  // TODO(Harry/Himanshu): Get the config schema, filter all the configs with @visibility secret, and pass that to winston so that it can mask it in the logs. https://github.com/winstonjs/winston/issues/1079#issuecomment-382861053

  const logger = winston.createLogger(
    merge<LoggerOptions, LoggerOptions>(
      {
        level: env.LOG_LEVEL || 'info',
        format: winston.format.combine(
          winston.format(info => {
            // TODO(Harry/Himanshu): Iterate over all secrets, and substitute info.message string. Or dynamically create regex from all the secrets and do a one time substitution.
            // example: info.message = info.message.replace(new RegExp('abc123', 'g'), "**[Redacted: Config integration.github.token]**");
            // Make sure do it in a case-insensitive way
            Object.entries(filteredKeys || {}).forEach(([key, value]) => {
              info.message = info.message.replace(new RegExp(key, 'g'), value);
            });
            return info;
          })(),
          env.NODE_ENV === 'production' ? winston.format.json() : coloredFormat,
        ),
        defaultMeta: {
          service: 'backstage',
        },
        transports: [
          new winston.transports.Console({
            silent: env.JEST_WORKER_ID !== undefined && !env.LOG_LEVEL,
          }),
        ],
      },
      options,
    ),
  );

  setRootLogger(logger);

  return logger;
}

rootLogger = createRootLogger();

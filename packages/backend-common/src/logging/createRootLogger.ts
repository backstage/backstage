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

import { WinstonLogger } from '@backstage/backend-app-api';
import { merge } from 'lodash';
import * as winston from 'winston';
import { LoggerOptions } from 'winston';
import { setRootLogger } from './globalLoggers';

const redacter = WinstonLogger.redacter();

export const setRootLoggerRedactionList = redacter.add;

/**
 * A winston formatting function that finds occurrences of filteredKeys
 * and replaces them with the corresponding identifier.
 *
 * @public
 */
export function redactWinstonLogLine(
  info: winston.Logform.TransformableInfo,
): winston.Logform.TransformableInfo {
  return redacter.format.transform(info) as winston.Logform.TransformableInfo;
}

/**
 * Creates a pretty printed winston log formatter.
 *
 * @public
 */
export const coloredFormat = WinstonLogger.colorFormat();

/**
 * Creates a default "root" logger. This also calls {@link setRootLogger} under
 * the hood.
 *
 * @remarks
 *
 * This is the logger instance that will be the foundation for all other logger
 * instances passed to plugins etc, in a given backend.
 *
 * @public
 */
export function createRootLogger(
  options: winston.LoggerOptions = {},
  env = process.env,
): winston.Logger {
  const logger = winston
    .createLogger(
      merge<LoggerOptions, LoggerOptions>(
        {
          level: env.LOG_LEVEL || 'info',
          format: winston.format.combine(
            redacter.format,
            env.NODE_ENV === 'production'
              ? winston.format.json()
              : WinstonLogger.colorFormat(),
          ),
          transports: [
            new winston.transports.Console({
              silent: env.JEST_WORKER_ID !== undefined && !env.LOG_LEVEL,
            }),
          ],
        },
        options,
      ),
    )
    .child({ service: 'backstage' });

  setRootLogger(logger);

  return logger;
}

setRootLogger(createRootLogger());

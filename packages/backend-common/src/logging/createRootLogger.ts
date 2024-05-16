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
import { format, LoggerOptions } from 'winston';
import { setRootLogger } from './globalLoggers';
import { TransformableInfo } from 'logform';

const getRedacter = (() => {
  let redacter: ReturnType<typeof WinstonLogger.redacter> | undefined =
    undefined;
  return () => {
    if (!redacter) {
      redacter = WinstonLogger.redacter();
    }
    return redacter;
  };
})();

export const setRootLoggerRedactionList = (
  redactions: Iterable<string>,
): void => {
  getRedacter().add(redactions);
};

/**
 * A winston formatting function that finds occurrences of filteredKeys
 * and replaces them with the corresponding identifier.
 *
 * @public
 */
export function redactWinstonLogLine(
  info: winston.Logform.TransformableInfo,
): winston.Logform.TransformableInfo {
  return getRedacter().format.transform(
    info,
  ) as winston.Logform.TransformableInfo;
}

const colorizer = format.colorize();

// NOTE: This is a copy of the WinstonLogger.colorFormat to avoid a circular dependency
/**
 * Creates a pretty printed winston log formatter.
 *
 * @public
 * @deprecated As we are going to deprecate the legacy backend, this formatter utility will be removed in the future.
 * If you need to format logs in the new system, please use the `WinstonLogger.colorFormat()` from `@backstage/backend-app-api` instead.
 */
export const coloredFormat = format.combine(
  format.timestamp(),
  format.colorize({
    colors: {
      timestamp: 'dim',
      prefix: 'blue',
      field: 'cyan',
      debug: 'grey',
    },
  }),
  format.printf((info: TransformableInfo) => {
    const { timestamp, level, message, plugin, service, ...fields } = info;
    const prefix = plugin || service;
    const timestampColor = colorizer.colorize('timestamp', timestamp);
    const prefixColor = colorizer.colorize('prefix', prefix);

    const extraFields = Object.entries(fields)
      .map(
        ([key, value]) => `${colorizer.colorize('field', `${key}`)}=${value}`,
      )
      .join(' ');

    return `${timestampColor} ${prefixColor} ${level} ${message} ${extraFields}`;
  }),
);

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
 * @deprecated As we are going to deprecate the legacy backend, this function will be removed in the future.
 * If you need to create the root logger in the new system, please check out this documentation:
 * https://backstage.io/docs/backend-system/core-services/logger
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
            getRedacter().format,
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

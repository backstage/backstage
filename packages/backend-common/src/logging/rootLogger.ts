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
import * as winston from 'winston';
import { LoggerOptions } from 'winston';
import { coloredFormat } from './formats';
import { escapeRegExp } from '../util/escapeRegExp';

let rootLogger: winston.Logger;
let redactionRegExp: RegExp;

/** @public */
export function getRootLogger(): winston.Logger {
  return rootLogger;
}

/** @public */
export function setRootLogger(newLogger: winston.Logger) {
  rootLogger = newLogger;
}

export function setRootLoggerRedactionList(redactionList: string[]) {
  if (redactionList.length) {
    redactionRegExp = new RegExp(
      `(${redactionList.map(escapeRegExp).join('|')})`,
      'g',
    );
  }
}

/**
 * A winston formatting function that finds occurrences of filteredKeys
 * and replaces them with the corresponding identifier.
 */
function redactLogLine(info: winston.Logform.TransformableInfo) {
  // TODO(hhogg): The logger is created before the config is loaded,
  // because the logger is needed in the config loader. There is a risk of
  // a secret being logged out during the config loading stage.
  if (redactionRegExp) {
    info.message = info.message.replace(redactionRegExp, '[REDACTED]');
  }

  return info;
}

/** @public */
export function createRootLogger(
  options: winston.LoggerOptions = {},
  env = process.env,
): winston.Logger {
  const logger = winston.createLogger(
    merge<LoggerOptions, LoggerOptions>(
      {
        level: env.LOG_LEVEL || 'info',
        format: winston.format.combine(
          winston.format(redactLogLine)(),
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

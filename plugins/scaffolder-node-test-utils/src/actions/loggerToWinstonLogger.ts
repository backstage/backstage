/*
 * Copyright 2022 The Backstage Authors
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

import { LoggerService } from '@backstage/backend-plugin-api';
import { JsonObject } from '@backstage/types';
import { Logger as WinstonLogger, createLogger } from 'winston';
import Transport, { TransportStreamOptions } from 'winston-transport';

class BackstageLoggerTransport extends Transport {
  constructor(
    private readonly backstageLogger: LoggerService,
    opts?: TransportStreamOptions,
  ) {
    super(opts);
  }

  log(info: unknown, callback: VoidFunction) {
    if (typeof info !== 'object' || info === null) {
      callback();
      return;
    }
    const { level, message, ...meta } = info as JsonObject;
    switch (level) {
      case 'error':
        this.backstageLogger.error(String(message), meta);
        break;
      case 'warn':
        this.backstageLogger.warn(String(message), meta);
        break;
      case 'info':
        this.backstageLogger.info(String(message), meta);
        break;
      case 'debug':
        this.backstageLogger.debug(String(message), meta);
        break;
      default:
        this.backstageLogger.info(String(message), meta);
    }
    callback();
  }
}

/**
 * A helper function to convert a Backstage LoggerService to a Winston Logger.
 * @internal
 */
export function loggerToWinstonLogger(
  logger: LoggerService,
  opts?: TransportStreamOptions,
): WinstonLogger {
  return createLogger({
    transports: [new BackstageLoggerTransport(logger, opts)],
  });
}

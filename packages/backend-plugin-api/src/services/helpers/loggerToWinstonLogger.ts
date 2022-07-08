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

import { Logger as BackstageLogger } from '../definitions';
import { Logger as WinstonLogger, createLogger } from 'winston';
import Transport, { TransportStreamOptions } from 'winston-transport';

class BackstageLoggerTransport extends Transport {
  constructor(
    private readonly backstageLogger: BackstageLogger,
    opts?: TransportStreamOptions,
  ) {
    super(opts);
  }

  log(info: { message: string }, callback: VoidFunction) {
    // TODO: add support for levels and fields
    this.backstageLogger.info(info.message);
    callback();
  }
}

/** @public */
export function loggerToWinstonLogger(
  logger: BackstageLogger,
  opts?: TransportStreamOptions,
): WinstonLogger {
  return createLogger({
    transports: [new BackstageLoggerTransport(logger, opts)],
  });
}

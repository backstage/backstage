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

import {
  LoggerService,
  LogMeta,
  RootLoggerService,
} from '@backstage/backend-plugin-api';
import type { mockServices } from './mockServices';

export class MockLogger implements RootLoggerService {
  #levels: Exclude<mockServices.rootLogger.Options['levels'], boolean>;
  #meta: LogMeta;

  error(message: string, meta?: LogMeta | Error | undefined): void {
    this.#log('error', message, meta);
  }

  warn(message: string, meta?: LogMeta | Error | undefined): void {
    this.#log('warn', message, meta);
  }

  info(message: string, meta?: LogMeta | Error | undefined): void {
    this.#log('info', message, meta);
  }

  debug(message: string, meta?: LogMeta | Error | undefined): void {
    this.#log('debug', message, meta);
  }

  child(meta: LogMeta): LoggerService {
    return new MockLogger(this.#levels, { ...this.#meta, ...meta });
  }

  constructor(
    levels: mockServices.rootLogger.Options['levels'],
    meta: LogMeta,
  ) {
    if (typeof levels === 'boolean') {
      this.#levels = {
        error: levels,
        debug: levels,
        info: levels,
        warn: levels,
      };
    } else {
      this.#levels = levels;
    }
    this.#meta = meta;
  }

  #log(
    level: 'error' | 'warn' | 'info' | 'debug',
    message: string,
    meta?: LogMeta | Error | undefined,
  ) {
    if (this.#levels[level]) {
      const labels = Object.entries(this.#meta)
        .map(([key, value]) => `${key}=${value}`)
        .join(',');
      console[level](`${labels} ${message}`, meta);
    }
  }
}

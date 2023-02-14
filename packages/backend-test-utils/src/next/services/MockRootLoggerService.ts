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
  RootLoggerService,
} from '@backstage/backend-plugin-api';
import { JsonObject } from '@backstage/types';
import type { mockServices } from './mockServices';

const levels = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

export class MockRootLoggerService implements RootLoggerService {
  #level: number;
  #meta: JsonObject;

  static create(
    options?: mockServices.rootLogger.Options,
  ): MockRootLoggerService {
    const level = options?.level ?? 'none';
    if (!(level in levels)) {
      throw new Error(`Invalid log level '${level}'`);
    }
    return new MockRootLoggerService(levels[level], {});
  }

  error(message: string, meta?: JsonObject | Error | undefined): void {
    this.#log('error', message, meta);
  }

  warn(message: string, meta?: JsonObject | Error | undefined): void {
    this.#log('warn', message, meta);
  }

  info(message: string, meta?: JsonObject | Error | undefined): void {
    this.#log('info', message, meta);
  }

  debug(message: string, meta?: JsonObject | Error | undefined): void {
    this.#log('debug', message, meta);
  }

  child(meta: JsonObject): LoggerService {
    return new MockRootLoggerService(this.#level, { ...this.#meta, ...meta });
  }

  private constructor(level: number, meta: JsonObject) {
    this.#level = level;
    this.#meta = meta;
  }

  #log(
    level: 'error' | 'warn' | 'info' | 'debug',
    message: string,
    meta?: JsonObject | Error | undefined,
  ) {
    const levelValue = levels[level] ?? 0;
    if (levelValue <= this.#level) {
      const labels = Object.entries(this.#meta)
        .map(([key, value]) => `${key}=${value}`)
        .join(',');
      console[level](`${labels} ${message}`, meta);
    }
  }
}

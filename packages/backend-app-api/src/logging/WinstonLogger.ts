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

// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import {
  WinstonLogger as _WinstonLogger,
  type WinstonLoggerOptions as _WinstonLoggerOptions,
} from '../../../backend-defaults/src/entrypoints/rootLogger';

import {
  LoggerService,
  RootLoggerService,
} from '@backstage/backend-plugin-api';
import { JsonObject } from '@backstage/types';
import { Format } from 'logform';

/**
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootLogger` instead.
 */
export type WinstonLoggerOptions = _WinstonLoggerOptions;

/**
 * A {@link @backstage/backend-plugin-api#LoggerService} implementation based on winston.
 *
 * @public
 * @deprecated Please import from `@backstage/backend-defaults/rootLogger` instead.
 */
export class WinstonLogger implements RootLoggerService {
  /**
   * Creates a {@link WinstonLogger} instance.
   */
  static create(options: WinstonLoggerOptions): WinstonLogger {
    return new WinstonLogger(_WinstonLogger.create(options));
  }

  /**
   * Creates a winston log formatter for redacting secrets.
   */
  static redacter(): {
    format: Format;
    add: (redactions: Iterable<string>) => void;
  } {
    return _WinstonLogger.redacter();
  }

  /**
   * Creates a pretty printed winston log formatter.
   */
  static colorFormat(): Format {
    return _WinstonLogger.colorFormat();
  }

  private constructor(private readonly impl: _WinstonLogger) {}

  error(message: string, meta?: JsonObject): void {
    this.impl.error(message, meta);
  }

  warn(message: string, meta?: JsonObject): void {
    this.impl.warn(message, meta);
  }

  info(message: string, meta?: JsonObject): void {
    this.impl.info(message, meta);
  }

  debug(message: string, meta?: JsonObject): void {
    this.impl.debug(message, meta);
  }

  child(meta: JsonObject): LoggerService {
    return this.impl.child(meta);
  }

  addRedactions(redactions: Iterable<string>) {
    this.impl.addRedactions(redactions);
  }
}

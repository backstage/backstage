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
import { Format } from 'logform';
import { Logger, transport as Transport, createLogger, format } from 'winston';
import { colorFormat } from '../../lib/colorFormat';
import { defaultConsoleTransport } from '../../lib/defaultConsoleTransport';
import { redacterFormat } from '../../lib/redacterFormat';

/**
 * @public
 */
export interface WinstonLoggerOptions {
  meta?: JsonObject;
  level?: string;
  format?: Format;
  transports?: Transport[];
}

/**
 * A {@link @backstage/backend-plugin-api#LoggerService} implementation based on winston.
 *
 * @public
 */
export class WinstonLogger implements RootLoggerService {
  #winston: Logger;
  #addRedactions?: (redactions: Iterable<string>) => void;

  /**
   * Creates a {@link WinstonLogger} instance.
   */
  static create(options: WinstonLoggerOptions): WinstonLogger {
    const redacter = WinstonLogger.redacter();
    const defaultFormatter =
      process.env.NODE_ENV === 'production'
        ? format.json()
        : WinstonLogger.colorFormat();

    let logger = createLogger({
      level: process.env.LOG_LEVEL || options.level || 'info',
      format: format.combine(
        options.format ?? defaultFormatter,
        redacter.format,
      ),
      transports: options.transports ?? defaultConsoleTransport,
    });

    if (options.meta) {
      logger = logger.child(options.meta);
    }

    return new WinstonLogger(logger, redacter.add);
  }

  /**
   * Creates a winston log formatter for redacting secrets.
   */
  static redacter(): {
    format: Format;
    add: (redactions: Iterable<string>) => void;
  } {
    return redacterFormat();
  }

  /**
   * Creates a pretty printed winston log formatter.
   */
  static colorFormat(): Format {
    return colorFormat();
  }

  private constructor(
    winston: Logger,
    addRedactions?: (redactions: Iterable<string>) => void,
  ) {
    this.#winston = winston;
    this.#addRedactions = addRedactions;
  }

  error(message: string, meta?: JsonObject): void {
    this.#winston.error(message, meta);
  }

  warn(message: string, meta?: JsonObject): void {
    this.#winston.warn(message, meta);
  }

  info(message: string, meta?: JsonObject): void {
    this.#winston.info(message, meta);
  }

  debug(message: string, meta?: JsonObject): void {
    this.#winston.debug(message, meta);
  }

  child(meta: JsonObject): LoggerService {
    return new WinstonLogger(this.#winston.child(meta));
  }

  addRedactions(redactions: Iterable<string>) {
    this.#addRedactions?.(redactions);
  }
}

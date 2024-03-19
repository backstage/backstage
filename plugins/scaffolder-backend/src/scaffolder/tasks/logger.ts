/*
 * Copyright 2024 The Backstage Authors
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
import { Format, TransformableInfo } from 'logform';
import {
  Logger,
  format,
  createLogger,
  transports,
  transport as Transport,
} from 'winston';

/**
 * Escapes a given string to be used inside a RegExp.
 *
 * Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 */
const escapeRegExp = (text: string) => {
  return text.replace(/[.*+?^${}(\)|[\]\\]/g, '\\$&');
};

interface WinstonLoggerOptions {
  meta?: JsonObject;
  level: string;
  format: Format;
  transports: Transport[];
}

export class WinstonLogger implements RootLoggerService {
  #winston: Logger;
  #addRedactions?: (redactions: Iterable<string>) => void;

  /**
   * Creates a {@link WinstonLogger} instance.
   */
  static create(options: WinstonLoggerOptions): WinstonLogger {
    const redacter = WinstonLogger.redacter();

    let logger = createLogger({
      level: options.level,
      format: format.combine(redacter.format, options.format),
      transports: options.transports ?? new transports.Console(),
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
    const redactionSet = new Set<string>();

    let redactionPattern: RegExp | undefined = undefined;

    return {
      format: format(info => {
        if (redactionPattern && typeof info.message === 'string') {
          info.message = info.message.replace(redactionPattern, '[REDACTED]');
        }
        if (redactionPattern && typeof info.stack === 'string') {
          info.stack = info.stack.replace(redactionPattern, '[REDACTED]');
        }
        return info;
      })(),
      add(newRedactions) {
        let added = 0;
        for (const redactionToTrim of newRedactions) {
          // Trimming the string ensures that we don't accdentally get extra
          // newlines or other whitespace interfering with the redaction; this
          // can happen for example when using string literals in yaml
          const redaction = redactionToTrim.trim();
          // Exclude secrets that are empty or just one character in length. These
          // typically mean that you are running local dev or tests, or using the
          // --lax flag which sets things to just 'x'.
          if (redaction.length <= 1) {
            continue;
          }
          if (!redactionSet.has(redaction)) {
            redactionSet.add(redaction);
            added += 1;
          }
        }
        if (added > 0) {
          const redactions = Array.from(redactionSet)
            .map(r => escapeRegExp(r))
            .join('|');
          redactionPattern = new RegExp(`(${redactions})`, 'g');
        }
      },
    };
  }

  /**
   * Creates a pretty printed winston log formatter.
   */
  static colorFormat(): Format {
    const colorizer = format.colorize();

    return format.combine(
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
            ([key, value]) =>
              `${colorizer.colorize('field', `${key}`)}=${value}`,
          )
          .join(' ');

        return `${timestampColor} ${prefixColor} ${level} ${message} ${extraFields}`;
      }),
    );
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

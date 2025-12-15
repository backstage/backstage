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
import { Format, TransformableInfo } from 'logform';
import {
  Logger,
  format,
  createLogger,
  transports,
  transport as Transport,
  config as winstonConfig,
} from 'winston';
import { MESSAGE } from 'triple-beam';
import { escapeRegExp } from '../../lib/escapeRegExp';
import { winstonLevels, WinstonLoggerLevelOverride } from './types';
import { createLogMatcher } from './utils';

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
  #setLevelOverrides?: (overrides: WinstonLoggerLevelOverride[]) => void;

  /**
   * Creates a {@link WinstonLogger} instance.
   */
  static create(options: WinstonLoggerOptions): WinstonLogger {
    const defaultLogLevel = process.env.LOG_LEVEL || options.level || 'info';

    const redacter = WinstonLogger.redacter();
    const logLevelFilter = WinstonLogger.logLevelFilter(defaultLogLevel);

    const defaultFormatter =
      process.env.NODE_ENV === 'production'
        ? format.json()
        : WinstonLogger.colorFormat();

    let logger = createLogger({
      // Lowest level possible as we let the logLevelFilter do the filtering
      level: 'silly',
      format: format.combine(
        logLevelFilter.format,
        options.format ?? defaultFormatter,
        redacter.format,
      ),
      transports: options.transports ?? new transports.Console(),
    });

    if (options.meta) {
      logger = logger.child(options.meta);
    }

    return new WinstonLogger(logger, redacter.add, logLevelFilter.setOverrides);
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
      format: format((obj: TransformableInfo) => {
        if (!redactionPattern || !obj) {
          return obj;
        }

        if (typeof obj[MESSAGE] === 'string') {
          obj[MESSAGE] = obj[MESSAGE].replace(redactionPattern, '***');
        }

        return obj;
      })(),
      add(newRedactions) {
        let added = 0;
        for (const redactionToTrim of newRedactions) {
          // Skip null or undefined values
          if (redactionToTrim === null || redactionToTrim === undefined) {
            continue;
          }
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
        const timestampColor = colorizer.colorize(
          'timestamp',
          String(timestamp),
        );
        const prefixColor = colorizer.colorize('prefix', String(prefix));

        const extraFields = Object.entries(fields)
          .map(([key, value]) => {
            let stringValue = '';

            try {
              stringValue = JSON.stringify(value);
            } catch (e) {
              stringValue = '[field value not castable to string]';
            }

            return `${colorizer.colorize('field', `${key}`)}=${stringValue}`;
          })
          .join(' ');

        return `${timestampColor} ${prefixColor} ${level} ${message} ${extraFields}`;
      }),
    );
  }

  /**
   * Formatter that filters log levels using overrides, falling back to the default level when no criteria match.
   */
  static logLevelFilter(
    defaultLogLevel: keyof winstonConfig.NpmConfigSetLevels,
  ): {
    format: Format;
    setOverrides: (overrides: WinstonLoggerLevelOverride[]) => void;
  } {
    const overrides: {
      predicate: (log: TransformableInfo) => boolean;
      level: string;
    }[] = [];

    return {
      format: format(log => {
        for (const override of overrides) {
          if (override.predicate(log)) {
            // Discard the log if the log level is below the override
            // eg, if the override level is 'warn' (1) and the log is 'debug' (5)
            if (winstonLevels[log.level] > winstonLevels[override.level]) {
              return false;
            }

            return log;
          }
        }

        // Ignore logs that are below the global level
        // eg, if the global level is 'warn' (1) and the log level is 'debug' (5)
        if (winstonLevels[log.level] > winstonLevels[defaultLogLevel]) {
          return false;
        }

        return log;
      })(),
      setOverrides: newOverrides => {
        const newOverridesPredicates = newOverrides.map(o => ({
          predicate: createLogMatcher(o.matchers),
          level: o.level,
        }));
        // Replace the content while preserving the reference to support live config updates
        overrides.splice(0, overrides.length, ...newOverridesPredicates);
      },
    };
  }

  private constructor(
    winston: Logger,
    addRedactions?: (redactions: Iterable<string>) => void,
    setLevelOverrides?: (overrides: WinstonLoggerLevelOverride[]) => void,
  ) {
    this.#winston = winston;
    this.#addRedactions = addRedactions;
    this.#setLevelOverrides = setLevelOverrides;
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

  setLevelOverrides(overrides: WinstonLoggerLevelOverride[]) {
    this.#setLevelOverrides?.(overrides);
  }
}

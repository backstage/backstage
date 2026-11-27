/*
 * Copyright 2026 The Backstage Authors
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
import { PassThrough } from 'node:stream';
import { styleText } from 'node:util';
import { escapeRegExp } from '../../lib/escapeRegExp';
import {
  loggerLevels,
  LoggerLevelOverride,
  LoggerInfo,
  LoggerFormat,
  LoggerTransport,
} from './types';
import { LEVEL, MESSAGE, jsonFormat } from './formats';
import { createLogMatcher } from './utils';

const logLevelColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'green',
  verbose: 'cyan',
  debug: 'gray',
  silly: 'magenta',
} as const;

const colorOptions = { validateStream: false } as const;

/**
 * @public
 */
export interface DefaultRootLoggerServiceOptions {
  /** Metadata included in all log entries. */
  meta?: JsonObject;
  /** Minimum log level, defaulting to `info`. Overridden by `LOG_LEVEL`. */
  level?: string;
  /** A custom format. Accepts Winston 3 and `logform` format instances. */
  format?: LoggerFormat;
  /** Custom output streams, including Winston 3 transports. Defaults to stdout. */
  transports?: LoggerTransport[];
}

/**
 * A {@link @backstage/backend-plugin-api#LoggerService} implementation with built-in console output and support for Winston 3 formats and transports.
 *
 * @public
 */
export class DefaultRootLoggerService implements RootLoggerService {
  #write: (info: LoggerInfo) => void;
  #meta: JsonObject;
  #addRedactions: (redactions: Iterable<string>) => void;
  #setLevelOverrides: (overrides: LoggerLevelOverride[]) => void;

  /**
   * Creates a root logger. The default output is timestamped JSON in production
   * and colored text in development. Custom formats and transports can be
   * supplied without installing Winston in the backend defaults package.
   */
  static create(
    options: DefaultRootLoggerServiceOptions = {},
  ): DefaultRootLoggerService {
    const redacter = DefaultRootLoggerService.redacter();
    const filter = DefaultRootLoggerService.logLevelFilter(
      process.env.LOG_LEVEL || options.level || 'info',
    );
    const formatter =
      options.format ??
      (process.env.NODE_ENV === 'production'
        ? jsonFormat()
        : DefaultRootLoggerService.colorFormat());

    // A real pipe supplies the parent properties and stream semantics expected
    // by Winston transports, including their own formats and level filtering.
    const outputs = options.transports?.map(transport => {
      // Older readable-stream versions used by Winston lack writableObjectMode.
      const state = transport as LoggerTransport & {
        _writableState?: { objectMode?: boolean };
      };
      if (!transport.writableObjectMode && !state._writableState?.objectMode) {
        throw new Error(
          'Logger transports must be writable streams in object mode',
        );
      }
      const output = Object.assign(new PassThrough({ objectMode: true }), {
        levels: loggerLevels,
        level: 'silly',
      });
      transport.once('unpipe', parent => {
        if (parent === output) output.destroy();
      });
      output.pipe(transport);
      return output;
    });

    return new DefaultRootLoggerService(
      info => {
        if (!filter.format.transform(info)) {
          return;
        }
        const formatted = formatter.transform(info, formatter.options);
        if (!formatted || typeof formatted !== 'object') {
          return;
        }
        redacter.format.transform(formatted);
        if (outputs) {
          for (const output of outputs) {
            if (!output.destroyed) output.write({ ...formatted });
          }
        } else {
          process.stdout.write(`${formatted[MESSAGE]}\n`);
        }
      },
      options.meta ?? {},
      redacter.add,
      filter.setOverrides,
    );
  }

  /**
   * Creates a Winston-compatible log formatter for redacting secrets.
   */
  static redacter(): {
    format: LoggerFormat;
    add: (redactions: Iterable<string>) => void;
  } {
    const redactionSet = new Set<string>();

    let redactionPattern: RegExp | undefined = undefined;

    return {
      format: {
        transform(obj: LoggerInfo) {
          if (!redactionPattern || !obj) {
            return obj;
          }

          if (typeof obj[MESSAGE] === 'string') {
            obj[MESSAGE] = obj[MESSAGE].replace(redactionPattern, '***');
          }

          return obj;
        },
      },
      add(newRedactions) {
        let added = 0;
        for (const redactionToTrim of newRedactions) {
          // Skip null or undefined values
          if (redactionToTrim === null || redactionToTrim === undefined) {
            continue;
          }
          // Trimming the string ensures that we don't accidentally get extra
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
   * Creates a Winston-compatible format for colored development logs.
   */
  static colorFormat(): LoggerFormat {
    return {
      transform(info) {
        info.timestamp ??= new Date().toISOString();
        const { timestamp, level, message, plugin, service, ...fields } = info;
        const coloredLevel = styleText(
          logLevelColors[level as keyof typeof logLevelColors] ?? 'white',
          level,
          colorOptions,
        );
        const extraFields = Object.entries(fields)
          .map(([key, value]) => {
            let stringValue;
            try {
              stringValue = JSON.stringify(value);
            } catch {
              stringValue = '[field value not castable to string]';
            }
            return `${styleText('cyan', key, colorOptions)}=${stringValue}`;
          })
          .join(' ');
        info.level = coloredLevel;
        info[MESSAGE] = `${styleText(
          'dim',
          String(timestamp),
          colorOptions,
        )} ${styleText(
          'blue',
          String(plugin || service),
          colorOptions,
        )} ${coloredLevel} ${message} ${extraFields}`;
        return info;
      },
    };
  }

  /**
   * Formatter that filters log levels using overrides, falling back to the default level when no criteria match.
   */
  static logLevelFilter(defaultLogLevel: string): {
    format: LoggerFormat;
    setOverrides: (overrides: LoggerLevelOverride[]) => void;
  } {
    const overrides: {
      predicate: (log: LoggerInfo) => boolean;
      level: string;
    }[] = [];

    return {
      format: {
        transform(log) {
          for (const override of overrides) {
            if (override.predicate(log)) {
              // Discard the log if the log level is below the override
              // eg, if the override level is 'warn' (1) and the log is 'debug' (5)
              if (loggerLevels[log.level] > loggerLevels[override.level]) {
                return false;
              }

              return log;
            }
          }

          // Ignore logs that are below the global level
          // eg, if the global level is 'warn' (1) and the log level is 'debug' (5)
          if (loggerLevels[log.level] > loggerLevels[defaultLogLevel]) {
            return false;
          }

          return log;
        },
      },
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
    write: (info: LoggerInfo) => void,
    meta: JsonObject,
    addRedactions: (redactions: Iterable<string>) => void,
    setLevelOverrides: (overrides: LoggerLevelOverride[]) => void,
  ) {
    this.#write = write;
    this.#meta = meta;
    this.#addRedactions = addRedactions;
    this.#setLevelOverrides = setLevelOverrides;
  }

  error(message: string, meta?: Error | JsonObject): void {
    this.#log('error', message, meta);
  }

  warn(message: string, meta?: Error | JsonObject): void {
    this.#log('warn', message, meta);
  }

  info(message: string, meta?: Error | JsonObject): void {
    this.#log('info', message, meta);
  }

  debug(message: string, meta?: Error | JsonObject): void {
    this.#log('debug', message, meta);
  }

  #log(level: string, message: string, meta?: Error | JsonObject) {
    const info: LoggerInfo = {
      ...this.#meta,
      ...meta,
      level,
      message: meta?.message ? `${message} ${meta.message}` : message,
      [LEVEL]: level,
    };
    if (meta instanceof Error) {
      info.stack = meta.stack;
      info.cause = meta.cause;
    }
    this.#write(info);
  }

  child(meta: JsonObject): LoggerService {
    return new DefaultRootLoggerService(
      this.#write,
      { ...this.#meta, ...meta },
      this.#addRedactions,
      this.#setLevelOverrides,
    );
  }

  addRedactions(redactions: Iterable<string>) {
    this.#addRedactions(redactions);
  }

  setLevelOverrides(overrides: LoggerLevelOverride[]) {
    this.#setLevelOverrides(overrides);
  }
}

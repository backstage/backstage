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
import Transport, { TransportStreamOptions } from 'winston-transport';
import { Logger, format, createLogger, transports } from 'winston';
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
import { TaskContext } from '@backstage/plugin-scaffolder-node';
import type { ErrorLike } from '@backstage/errors';
import _ from 'lodash';

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

// This is a workaround for being able to preserve the log format of the root logger.
// Will revisit all of this implementation once we can break the router to use only `LoggerService`.
export class BackstageLoggerTransport extends Transport {
  private readonly backstageLogger: LoggerService;
  private readonly taskContext: TaskContext;
  private readonly stepId: string;

  constructor(
    backstageLogger: LoggerService,
    taskContext: TaskContext,
    stepId: string,
    opts?: TransportStreamOptions,
  ) {
    super(opts);
    this.backstageLogger = backstageLogger;
    this.taskContext = taskContext;
    this.stepId = stepId;
  }

  log(info: TransformableInfo, callback: VoidFunction) {
    if (typeof info !== 'object' || info === null) {
      callback();
      return;
    }

    const message = info[MESSAGE];
    const level = info[LEVEL];

    switch (level) {
      case 'error':
        this.backstageLogger.error(String(message));
        break;
      case 'warn':
        this.backstageLogger.warn(String(message));
        break;
      case 'info':
        this.backstageLogger.info(String(message));
        break;
      case 'debug':
        this.backstageLogger.debug(String(message));
        break;
      default:
        this.backstageLogger.info(String(message));
        break;
    }

    this.taskContext.emitLog(String(message), { stepId: this.stepId });
    callback();
  }
}

export class WinstonLogger implements RootLoggerService {
  #winston: Logger;
  #addRedactions?: (redactions: Iterable<string>) => void;
  #redact?: (value: string) => string;
  #redactError?: (error: unknown) => ErrorLike;

  /**
   * Creates a {@link WinstonLogger} instance.
   */
  static create(options: WinstonLoggerOptions): WinstonLogger {
    const redacter = WinstonLogger.redacter();

    let logger = createLogger({
      level: options.level,
      format: format.combine(options.format, redacter.format),
      transports: options.transports ?? new transports.Console(),
    });

    if (options.meta) {
      logger = logger.child(options.meta);
    }

    return new WinstonLogger(
      logger,
      redacter.add,
      redacter.redact,
      redacter.redactError,
    );
  }

  /**
   * Creates a winston log formatter for redacting secrets.
   */
  static redacter(): {
    format: Format;
    add: (redactions: Iterable<string>) => void;
    redact: (value: string) => string;
    redactError: (error: unknown) => ErrorLike;
  } {
    const redactionSet = new Set<string>();

    let redactionPattern: RegExp | undefined = undefined;

    const redact = (value: string) => {
      if (!redactionPattern) {
        return value;
      }

      const ranges = Array.from(value.matchAll(redactionPattern), match => ({
        start: match.index,
        end: match.index + match[1].length,
      }));
      if (ranges.length === 0) {
        return value;
      }

      const mergedRanges: { start: number; end: number }[] = [];
      for (const range of ranges) {
        const previous = mergedRanges.at(-1);
        if (previous && range.start < previous.end) {
          previous.end = Math.max(previous.end, range.end);
        } else {
          mergedRanges.push(range);
        }
      }

      let result = '';
      let cursor = 0;
      for (const range of mergedRanges) {
        result += `${value.slice(cursor, range.start)}***`;
        cursor = range.end;
      }
      return result + value.slice(cursor);
    };

    const createSanitizedError = (
      name = 'Error',
      message = 'Task failed',
      stack?: string,
    ): ErrorLike => {
      const sanitizedError = new Error(message) as ErrorLike;
      sanitizedError.name = name;
      if (stack !== undefined) {
        sanitizedError.stack = stack;
      }
      return sanitizedError;
    };

    const createUnknownError = (value: unknown): ErrorLike => {
      try {
        return createSanitizedError(
          'Error',
          redact(`unknown error '${String(value)}'`),
        );
      } catch {
        return createSanitizedError(
          'Error',
          `unknown error of type '${typeof value}'`,
        );
      }
    };

    const redactError = (error: unknown): ErrorLike => {
      if (
        (typeof error !== 'object' || error === null) &&
        typeof error !== 'function'
      ) {
        return typeof error === 'string'
          ? createSanitizedError('Error', redact(error))
          : createUnknownError(error);
      }

      const errorLike = error as Partial<ErrorLike>;
      let originalName: unknown;
      let originalMessage: unknown;
      let originalStack: unknown;

      try {
        originalName = errorLike.name;
        originalMessage = errorLike.message;
        originalStack = errorLike.stack;
      } catch {
        return createSanitizedError();
      }

      if (
        typeof originalName !== 'string' ||
        !originalName ||
        typeof originalMessage !== 'string'
      ) {
        return createUnknownError(error);
      }

      const name = redact(originalName);
      const message = redact(originalMessage);
      const stack =
        typeof originalStack === 'string' ? redact(originalStack) : undefined;

      return createSanitizedError(name, message, stack);
    };

    return {
      format: format((obj: TransformableInfo) => {
        if (!redactionPattern || !obj) {
          return obj;
        }

        if (typeof obj[MESSAGE] === 'string') {
          obj[MESSAGE] = redact(obj[MESSAGE]);
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
            .sort((a, b) => b.length - a.length)
            .map(r => escapeRegExp(r))
            .join('|');
          redactionPattern = new RegExp(`(?=(${redactions}))`, 'g');
        }
      },
      redact,
      redactError,
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
        const { timestamp, plugin, service } = info;
        const message = info[MESSAGE];
        const level = info[LEVEL];
        const fields = info[SPLAT];
        const prefix = plugin || service;
        const timestampColor = colorizer.colorize(
          'timestamp',
          String(timestamp),
        );
        const prefixColor = colorizer.colorize('prefix', String(prefix));

        const extraFields = Object.entries(fields as any)
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
    redact?: (value: string) => string,
    redactError?: (error: unknown) => ErrorLike,
  ) {
    this.#winston = winston;
    this.#addRedactions = addRedactions;
    this.#redact = redact;
    this.#redactError = redactError;
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
    return new WinstonLogger(
      this.#winston.child(meta),
      this.#addRedactions,
      this.#redact,
      this.#redactError,
    );
  }

  addRedactions(redactions: Iterable<string>) {
    this.#addRedactions?.(redactions);
  }

  redact(value: string) {
    return this.#redact?.(value) ?? value;
  }

  redactError(error: unknown): ErrorLike {
    return (
      this.#redactError?.(error) ?? (new Error('Task failed') as ErrorLike)
    );
  }
}

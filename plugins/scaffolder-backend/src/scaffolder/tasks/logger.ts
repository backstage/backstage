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
import _ from 'lodash';
import { TaskRedacter } from './TaskRedacter';

interface WinstonLoggerOptions {
  meta?: JsonObject;
  level: string;
  format: Format;
  transports: Transport[];
  redacter: TaskRedacter;
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
  readonly #redacter: TaskRedacter;

  /**
   * Creates a {@link WinstonLogger} instance.
   */
  static create(options: WinstonLoggerOptions): WinstonLogger {
    let logger = createLogger({
      level: options.level,
      format: format.combine(
        options.format,
        WinstonLogger.redacter(options.redacter),
      ),
      transports: options.transports ?? new transports.Console(),
    });

    if (options.meta) {
      logger = logger.child(options.meta);
    }

    return new WinstonLogger(logger, options.redacter);
  }

  /**
   * Creates a winston log formatter for redacting secrets.
   */
  static redacter(): {
    format: Format;
    add: (redactions: Iterable<string>) => void;
    redact: (value: string) => string;
    redactError: (error: unknown) => Error;
  };
  static redacter(redacter: TaskRedacter): Format;
  static redacter(redacter?: TaskRedacter):
    | Format
    | {
        format: Format;
        add: (redactions: Iterable<string>) => void;
        redact: (value: string) => string;
        redactError: (error: unknown) => Error;
      } {
    const taskRedacter = redacter ?? new TaskRedacter();
    const formatter = format((obj: TransformableInfo) => {
      if (obj && typeof obj[MESSAGE] === 'string') {
        obj[MESSAGE] = taskRedacter.redactString(obj[MESSAGE]);
      }
      return obj;
    })();

    if (redacter) {
      return formatter;
    }

    return {
      format: formatter,
      add: values => taskRedacter.add(values),
      redact: value => taskRedacter.redactString(value),
      redactError: error => taskRedacter.redactError(error),
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

  private constructor(winston: Logger, redacter: TaskRedacter) {
    this.#winston = winston;
    this.#redacter = redacter;
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
    return new WinstonLogger(this.#winston.child(meta), this.#redacter);
  }

  addRedactions(redactions: Iterable<string>) {
    this.#redacter.add(redactions);
  }

  redact(value: string) {
    return this.#redacter.redactString(value);
  }

  redactError(error: unknown): Error {
    return this.#redacter.redactError(error);
  }
}

/*
 * Copyright 2025 The Backstage Authors
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
import { JsonObject, JsonPrimitive } from '@backstage/types';
import { Writable } from 'node:stream';

/**
 * A structured log entry, compatible with Winston 3 formats and transports.
 *
 * @public
 */
export interface LoggerInfo {
  level: string;
  message: unknown;
  [key: string | symbol]: unknown;
}

/**
 * A log format, compatible with formats from `logform` and Winston 3.
 *
 * @public
 */
export interface LoggerFormat {
  options?: object;
  transform(info: LoggerInfo, options?: unknown): LoggerInfo | boolean;
}

/**
 * An object-mode writable stream that receives log entries.
 * Winston 3 transport instances can be supplied directly.
 *
 * @public
 */
export type LoggerTransport = Writable;

/**
 * @public
 */
export type LoggerLevelOverrideMatchers = {
  [key: string]: JsonPrimitive | JsonPrimitive[] | undefined;
};

/**
 * @public
 */
export type LoggerLevelOverride = {
  matchers: LoggerLevelOverrideMatchers;
  level: string;
};

export type RootLoggerConfig = {
  level?: string;
  meta?: JsonObject;
  overrides?: LoggerLevelOverride[];
  redactAllowlist?: string[];
};

/**
 * @public
 * @deprecated Use {@link LoggerLevelOverrideMatchers} instead.
 */
export type WinstonLoggerLevelOverrideMatchers = LoggerLevelOverrideMatchers;

/**
 * @public
 * @deprecated Use {@link LoggerLevelOverride} instead.
 */
export type WinstonLoggerLevelOverride = LoggerLevelOverride;

export const loggerLevels: Record<string, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

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
  DefaultRootLoggerService,
  DefaultRootLoggerServiceOptions,
} from './DefaultRootLoggerService';
import { LoggerFormat, LoggerTransport } from './types';

/**
 * @public
 * @deprecated Use {@link DefaultRootLoggerService} instead.
 */
export const WinstonLogger = DefaultRootLoggerService;

/**
 * @public
 * @deprecated Use {@link DefaultRootLoggerService} instead.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare -- preserve the class alias in both the type and value namespaces
export type WinstonLogger = DefaultRootLoggerService;

/**
 * @public
 * @deprecated Use {@link DefaultRootLoggerServiceOptions} instead.
 */
export interface WinstonLoggerOptions extends DefaultRootLoggerServiceOptions {
  // Keep the transport members available to existing options consumers without
  // making them part of the native logger's transport contract.
  transports?: Array<
    LoggerTransport & {
      format?: LoggerFormat;
      level?: string;
      silent?: boolean;
      handleExceptions?: boolean;
      handleRejections?: boolean;
      log?(info: any, next: () => void): any;
      logv?(info: any, next: () => void): any;
      close?(): void;
    }
  >;
}

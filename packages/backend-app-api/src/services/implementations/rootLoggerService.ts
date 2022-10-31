/*
 * Copyright 2022 The Backstage Authors
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

import { createRootLogger } from '@backstage/backend-common';
import {
  createServiceFactory,
  Logger,
  rootLoggerServiceRef,
} from '@backstage/backend-plugin-api';
import { Logger as WinstonLogger } from 'winston';

class BackstageLogger implements Logger {
  static fromWinston(logger: WinstonLogger): BackstageLogger {
    return new BackstageLogger(logger);
  }

  private constructor(private readonly winston: WinstonLogger) {}

  info(message: string, ...meta: any[]): void {
    this.winston.info(message, ...meta);
  }

  child(fields: { [name: string]: string }): Logger {
    return new BackstageLogger(this.winston.child(fields));
  }
}

/** @public */
export const rootLoggerFactory = createServiceFactory({
  service: rootLoggerServiceRef,
  deps: {},
  async factory() {
    return BackstageLogger.fromWinston(createRootLogger());
  },
});

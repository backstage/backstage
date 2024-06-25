/*
 * Copyright 2020 The Backstage Authors
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

import * as winston from 'winston';
import { createRootLogger } from './createRootLogger';

/**
 * A logger that just throws away all messages.
 *
 * @public
 * @deprecated As we are going to deprecate the legacy backend, this function will be removed in the future.
 * If you need to mock the root logger in the new system, please use `mockServices.logger.mock()` from `@backstage/test-utils` instead.
 */
export function getVoidLogger(): winston.Logger {
  return winston.createLogger({
    transports: [new winston.transports.Console({ silent: true })],
  });
}

let rootLogger: winston.Logger;

/**
 * Gets the current root logger.
 *
 * @public
 * @deprecated As we are going to deprecate the legacy backend, this function will be removed in the future.
 * If you need to get the root logger in the new system, please check out this documentation:
 * https://backstage.io/docs/backend-system/core-services/logger
 */
export function getRootLogger(): winston.Logger {
  if (!rootLogger) {
    rootLogger = createRootLogger();
  }
  return rootLogger;
}

/**
 * Sets a completely custom default "root" logger.
 *
 * @remarks
 *
 * This is the logger instance that will be the foundation for all other logger
 * instances passed to plugins etc, in a given backend.
 *
 * Only use this if you absolutely need to make a completely custom logger.
 * Normally if you want to make light adaptations to the default logger
 * behavior, you would instead call {@link createRootLogger}.
 *
 * @public
 * @deprecated As we are going to deprecate the legacy backend, this function will be removed in the future.
 * If you need to set the root logger in the new system, please check out this documentation:
 * https://backstage.io/docs/backend-system/core-services/logger
 */
export function setRootLogger(newLogger: winston.Logger) {
  rootLogger = newLogger;
}

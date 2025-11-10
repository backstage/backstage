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

import { JsonObject } from '@backstage/types';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getOrCreateGlobalSingleton } from '../utilities/globals';
import { LoggerService } from './LoggerService';

/**
 * Root-level logging.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/root-logger | service documentation} for more details.
 *
 * @public
 */
export interface RootLoggerService extends LoggerService {}

const loggerMetaContextStorage = getOrCreateGlobalSingleton(
  'coreLoggerMetaContext',
  () => new AsyncLocalStorage<JsonObject>(),
);

/**
 * Runs a function, wherein all emitted logging should be amended with a set of
 * values. This can be used to add contextual information that should be part of
 * every message logged, such as a plugin ID or a user ID etc.
 *
 * @public
 */
export function runWithLoggerMetaContext<TReturn>(
  meta: JsonObject,
  fn: () => TReturn,
): TReturn {
  const newMeta = { ...getLoggerMetaContext(), ...meta };
  return loggerMetaContextStorage.run(newMeta, () => {
    return fn();
  });
}

/**
 * Gets the current logger meta context.
 *
 * @public
 */
export function getLoggerMetaContext(): JsonObject {
  return loggerMetaContextStorage.getStore() ?? {};
}

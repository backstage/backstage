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

/**
 * A service that provides a logging facility.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/logger | service documentation} for more details.
 *
 * @public
 */
export interface LoggerService {
  error(message: string, meta?: Error | JsonObject): void;
  warn(message: string, meta?: Error | JsonObject): void;
  info(message: string, meta?: Error | JsonObject): void;
  debug(message: string, meta?: Error | JsonObject): void;

  child(meta: JsonObject): LoggerService;
}

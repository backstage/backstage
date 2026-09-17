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

import { LoggerService } from '@backstage/backend-plugin-api';
import { JsonObject } from '@backstage/types';

export type LogContent = { message: string; meta?: Error | JsonObject };

export type Logs = {
  errors?: LogContent[];
  warns?: LogContent[];
  infos?: LogContent[];
  debugs?: LogContent[];
};

export class MockedLogger implements LoggerService {
  logs: Logs = {};

  error(message: string, meta?: Error | JsonObject): void {
    if (!this.logs.errors) {
      this.logs.errors = [];
    }
    this.logs.errors!.push(toLogContent(message, meta));
  }
  warn(message: string, meta?: Error | JsonObject): void {
    if (!this.logs.warns) {
      this.logs.warns = [];
    }
    this.logs.warns!.push(toLogContent(message, meta));
  }
  info(message: string, meta?: Error | JsonObject): void {
    if (!this.logs.infos) {
      this.logs.infos = [];
    }
    this.logs.infos!.push(toLogContent(message, meta));
  }
  debug(message: string, meta?: Error | JsonObject): void {
    if (!this.logs.debugs) {
      this.logs.debugs = [];
    }
    this.logs.debugs!.push(toLogContent(message, meta));
  }

  child(_: JsonObject): LoggerService {
    return this;
  }
}

function toLogContent(message: string, meta?: Error | JsonObject): LogContent {
  if (!meta) {
    return { message };
  }
  const jsonObject = Object.fromEntries(Object.entries(meta));
  if ('name' in meta) {
    jsonObject.name = meta.name;
  }
  if ('message' in meta) {
    jsonObject.message = meta.message;
  }
  return {
    message,
    meta: jsonObject,
  };
}

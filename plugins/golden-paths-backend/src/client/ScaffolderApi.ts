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
  ScaffolderClientCancelTaskOptions,
  ScaffolderClientListEventsOptions,
} from './types';
import { JsonObject } from '@backstage/types';
import { SerializedTaskEvent } from '@backstage/plugin-golden-paths-common';
import { IncomingHttpHeaders } from 'node:http';

/**
 * An API to interact with the scaffolder backend.
 *
 * @public
 */
export interface ScaffolderApi {
  listEvents(
    options: ScaffolderClientListEventsOptions,
  ): Promise<{ events: SerializedTaskEvent[] }>;

  cancelTask(options: ScaffolderClientCancelTaskOptions): Promise<void>;

  createTaskExecution(
    body: JsonObject,
    headers: IncomingHttpHeaders,
  ): Promise<string>;
}

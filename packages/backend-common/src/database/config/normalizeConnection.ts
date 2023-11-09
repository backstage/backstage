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

import { JsonObject } from '@backstage/types';
import { Knex } from 'knex';
import { parseConnectionString } from '../connection';

/**
 * Normalizes a connection config or string into an object which can be passed
 * to Knex.
 */
export function normalizeConnection(
  connection: Knex.StaticConnectionConfig | JsonObject | string | undefined,
  client: string,
): Partial<Knex.StaticConnectionConfig> {
  if (typeof connection === 'undefined' || connection === null) {
    return {};
  }

  return typeof connection === 'string' || connection instanceof String
    ? parseConnectionString(connection as string, client)
    : connection;
}

/*
 * Copyright 2021 The Backstage Authors
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
import { Knex } from 'knex';

export async function queryPostgresMajorVersion(knex: Knex): Promise<number> {
  if (knex.client.config.client !== 'pg') {
    throw new Error("Can't resolve version, not a postgres database");
  }

  const { rows } = await knex.raw('SHOW server_version_num');
  const [result] = rows;
  const version = +result.server_version_num;
  const majorVersion = Math.floor(version / 10000);
  return majorVersion;
}

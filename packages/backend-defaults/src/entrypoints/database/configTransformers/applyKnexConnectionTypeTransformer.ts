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

import { Knex } from 'knex';
import { KnexConnectionTypeTransformer } from '../types';

export async function applyKnexConnectionTypeTransformer(
  config: Knex.Config,
  transformers: Record<string, KnexConnectionTypeTransformer>,
): Promise<Knex.Config> {
  const sanitizedConfig = JSON.parse(JSON.stringify(config));

  const connectionType = sanitizedConfig.connection
    ? (sanitizedConfig.connection as any).type
    : undefined;
  if (
    !!sanitizedConfig.connection &&
    !!connectionType &&
    connectionType !== 'default'
  ) {
    if (!transformers[connectionType]) {
      throw Error(`Unknown connection type: ${connectionType}`);
    }

    sanitizedConfig.connection = await transformers[connectionType](
      sanitizedConfig.connection,
    );

    // connection.type is not a Knex Configuration Property
    // It is only used to select potential configuration transformers
  }
  delete (sanitizedConfig.connection as any).type;
  return sanitizedConfig;
}

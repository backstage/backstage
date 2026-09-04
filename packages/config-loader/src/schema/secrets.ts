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

import type { Config } from '@backstage/config';
import type { ConfigSchema } from './types';

/**
 * Enumerates string values selected by a configuration schema as secret.
 *
 * @public
 */
export function enumerateConfigSecrets(options: {
  config: Config;
  schema: ConfigSchema;
}): Set<string> {
  const [secretsData] = options.schema.process(
    [
      {
        data: options.config.getOptional() ?? {},
        context: 'schema-enumerator',
      },
    ],
    {
      visibility: ['secret'],
      ignoreSchemaErrors: true,
    },
  );
  const secrets = new Set<string>();
  JSON.parse(
    JSON.stringify(secretsData.data),
    (_, value) => typeof value === 'string' && secrets.add(value),
  );
  return secrets;
}

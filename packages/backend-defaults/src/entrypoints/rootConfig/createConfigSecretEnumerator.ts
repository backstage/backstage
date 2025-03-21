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

import { LoggerService } from '@backstage/backend-plugin-api';
import type { Config } from '@backstage/config';
import { ConfigSchema, loadConfigSchema } from '@backstage/config-loader';
import { getPackages } from '@manypkg/get-packages';

/** @public */
export async function createConfigSecretEnumerator(options: {
  logger: LoggerService;
  dir?: string;
  schema?: ConfigSchema;
}): Promise<(config: Config) => Iterable<string>> {
  const { logger, dir = process.cwd() } = options;
  const { packages } = await getPackages(dir);
  const schema =
    options.schema ??
    (await loadConfigSchema({
      dependencies: packages.map(p => p.packageJson.name),
    }));

  return (config: Config) => {
    const [secretsData] = schema.process(
      [{ data: config.getOptional() ?? {}, context: 'schema-enumerator' }],
      {
        visibility: ['secret'],
        ignoreSchemaErrors: true,
      },
    );
    const secrets = new Set<string>();
    JSON.parse(
      JSON.stringify(secretsData.data),
      (_, v) => typeof v === 'string' && secrets.add(v),
    );
    logger.info(
      `Found ${secrets.size} new secrets in config that will be redacted`,
    );
    return secrets;
  };
}

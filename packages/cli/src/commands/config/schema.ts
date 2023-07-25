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

import { OptionValues } from 'commander';
import { JSONSchema7 as JSONSchema } from 'json-schema';
import { stringify as stringifyYaml } from 'yaml';
import { pathToFileURL } from 'url';
import { loadCliConfig } from '../../lib/config';
import { mergeConfigSchemas } from '@backstage/config-loader';

export default async (opts: OptionValues) => {
  const { schema } = await loadCliConfig({
    args: [],
    fromPackage: opts.package,
    mockEnv: true,
  });

  const serializedSchemas = schema.serialize().schemas as unknown as Array<{
    value: JSONSchema;
    path: string;
  }>;

  let configSchema: JSONSchema | { schemas: JSONSchema[] };
  if (opts.merge) {
    configSchema = mergeConfigSchemas(serializedSchemas.map(_ => _.value));
    configSchema.title = 'Application Configuration Schema';
    configSchema.description =
      'This is the schema describing the structure of the app-config.yaml configuration file.';
  } else {
    configSchema = {
      schemas: serializedSchemas.map(_ => ({
        ...(_.value as JSONSchema),
        $id: String(pathToFileURL(_.path)),
      })),
    };
  }

  if (opts.format === 'json') {
    process.stdout.write(`${JSON.stringify(configSchema, null, 2)}\n`);
  } else {
    process.stdout.write(`${stringifyYaml(configSchema)}\n`);
  }
};

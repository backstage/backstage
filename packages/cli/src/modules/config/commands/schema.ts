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

import { cli } from 'cleye';
import { JSONSchema7 as JSONSchema } from 'json-schema';
import { stringify as stringifyYaml } from 'yaml';
import { loadCliConfig } from '../lib/config';
import { JsonObject } from '@backstage/types';
import { mergeConfigSchemas } from '@backstage/config-loader';
import type { CommandContext } from '../../../wiring/types';

export default async ({ args, info }: CommandContext) => {
  const {
    flags: { merge, format, package: pkg },
  } = cli(
    {
      help: info,
      flags: {
        package: { type: String, description: 'Package to print schema for' },
        format: { type: String, description: 'Output format (yaml or json)' },
        merge: {
          type: Boolean,
          description: 'Merge all schemas into a single schema',
        },
      },
    },
    undefined,
    args,
  );

  const { schema } = await loadCliConfig({
    args: [],
    fromPackage: pkg,
    mockEnv: true,
  });

  let configSchema: JsonObject | JSONSchema;
  if (merge) {
    configSchema = mergeConfigSchemas(
      (schema.serialize().schemas as JsonObject[]).map(
        _ => _.value as JSONSchema,
      ),
    );
    configSchema.title = 'Application Configuration Schema';
    configSchema.description =
      'This is the schema describing the structure of the app-config.yaml configuration file.';
  } else {
    configSchema = schema.serialize();
  }

  if (format === 'json') {
    process.stdout.write(`${JSON.stringify(configSchema, null, 2)}\n`);
  } else {
    process.stdout.write(`${stringifyYaml(configSchema)}\n`);
  }
};

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

import { cli } from 'cleye';
import yaml from 'yaml';
import type { CliCommandContext } from '@backstage/cli-node';
import type { Entity } from '@backstage/catalog-model';
import { createCatalogClient } from '../lib/catalogClient';
import { instanceFlag, resolveAuth } from '../lib/resolveAuth';
import { writeJson } from '../lib/intentFormat';
import { readFileOrStdin } from '../lib/input';

export default async ({ args, info }: CliCommandContext) => {
  const parsed = cli(
    {
      name: info.usage,
      strictFlags: true,
      parameters: ['[file]'],
      flags: {
        location: {
          type: String,
          description:
            'Location to validate the entity as, for example a url: location',
        },
        ...instanceFlag,
      },
    },
    undefined,
    args,
  );
  const { flags } = parsed;
  const file = parsed._.file;

  if (!file) {
    throw new Error(
      'An entity YAML file is required, use "-" to read from stdin. Usage: catalog validate <file>',
    );
  }
  const entityYaml = await readFileOrStdin(file);

  let entity: Entity;
  try {
    entity = yaml.parse(entityYaml);
  } catch (yamlError: any) {
    writeJson({
      isValid: false,
      isValidYaml: false,
      errors: [`YAML parsing error: ${yamlError.message}`],
    });
    process.exitCode = 1;
    return;
  }

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = createCatalogClient(baseUrl);

  const resp = await client.validateEntity(
    entity,
    flags.location ?? 'url:https://localhost/entity-validator',
    { token: accessToken },
  );

  writeJson({
    isValid: resp.valid,
    isValidYaml: true,
    errors: resp.valid ? [] : resp.errors.map(e => e.message),
    entity: resp.valid ? entity : undefined,
  });
  if (!resp.valid) {
    process.exitCode = 1;
  }
};

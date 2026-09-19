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
import { readFileSync } from 'node:fs';
import yaml from 'yaml';
import type { CliCommandContext } from '@backstage/cli-node';
import type { Entity } from '@backstage/catalog-model';
import { createCatalogClient } from '../lib/catalogClient';
import { resolveAuth } from '../lib/resolveAuth';
import { writeJson } from '../lib/intentFormat';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      name: info.usage,
      flags: {
        entity: {
          type: String,
          description: 'Entity YAML content',
        },
        'entity-file': {
          type: String,
          description: 'Path to a file containing entity YAML',
        },
        location: { type: String, description: 'Location to validate' },
        output: {
          type: String,
          description: 'Output format: human (default), json',
        },
        instance: {
          type: String,
          description: 'Name of the instance to use',
        },
      },
    },
    undefined,
    args,
  );

  const entityYaml = flags['entity-file']
    ? readFileSync(flags['entity-file'], 'utf8')
    : flags.entity;

  if (!entityYaml) {
    throw new Error(
      '--entity or --entity-file is required. Usage: catalog validate --entity-file entity.yaml',
    );
  }

  let entity: Entity;
  try {
    entity = yaml.parse(entityYaml);
  } catch (yamlError: any) {
    writeJson({
      isValid: false,
      isValidYaml: false,
      errors: [`YAML parsing error: ${yamlError.message}`],
    });
    return;
  }

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = createCatalogClient(baseUrl);

  try {
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
  } catch (error: any) {
    writeJson({
      isValid: false,
      isValidYaml: false,
      errors: [`Validation error: ${error.message}`],
    });
  }
};

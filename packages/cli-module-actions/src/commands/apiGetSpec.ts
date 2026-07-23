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
import type { CliCommandContext } from '@backstage/cli-node';
import { ActionsClient } from '../lib/ActionsClient';
import { resolveAuth } from '../lib/resolveAuth';
import { parseOutputFlag, writeJson } from '../lib/intentFormat';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      name: info.usage,
      flags: {
        name: { type: String, description: 'API entity name (required)' },
        namespace: {
          type: String,
          description: 'Entity namespace (default: default)',
        },
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

  if (!flags.name) {
    throw new Error(
      '--name is required. Usage: api get-spec --name <api-name>',
    );
  }

  const mode = parseOutputFlag(flags as Record<string, unknown>);
  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = new ActionsClient(baseUrl, accessToken);

  const input: Record<string, unknown> = { name: flags.name, kind: 'API' };
  if (flags.namespace) input.namespace = flags.namespace;

  const entity = (await client.execute(
    'catalog:get-catalog-entity',
    input,
  )) as Record<string, unknown>;

  const spec = entity?.spec as Record<string, unknown> | undefined;
  const definition = spec?.definition;

  if (!definition) {
    throw new Error(
      `API "${flags.name}" has no spec.definition. Run "api list" to see available APIs.`,
    );
  }

  if (mode === 'json') {
    writeJson({ name: flags.name, type: spec?.type, definition });
  } else {
    process.stdout.write(
      `${
        typeof definition === 'string'
          ? definition
          : JSON.stringify(definition, null, 2)
      }\n`,
    );
  }
};

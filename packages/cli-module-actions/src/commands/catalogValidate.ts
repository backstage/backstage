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
import { writeJson } from '../lib/intentFormat';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      name: info.usage,
      flags: {
        entity: {
          type: String,
          description: 'Entity YAML content (required)',
        },
        location: { type: String, description: 'Location to validate' },
        instance: {
          type: String,
          description: 'Name of the instance to use',
        },
      },
    },
    undefined,
    args,
  );

  if (!flags.entity) {
    throw new Error(
      '--entity is required. Usage: catalog validate --entity "$(cat entity.yaml)"',
    );
  }

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = new ActionsClient(baseUrl, accessToken);

  const input: Record<string, unknown> = { entity: flags.entity };
  if (flags.location) input.location = flags.location;

  const result = await client.execute('catalog:validate-entity', input);
  writeJson(result);
};

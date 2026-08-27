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
import { ScaffolderClient } from '../lib/ScaffolderClient';
import { resolveAuth } from '../lib/resolveAuth';
import { writeJson } from '../lib/intentFormat';

export default async ({ args, info }: CliCommandContext) => {
  const { flags } = cli(
    {
      name: info.usage,
      flags: {
        'template-ref': {
          type: String,
          description:
            'Full template entity YAML content to validate (required)',
        },
        values: {
          type: String,
          description: 'Template input values (JSON string)',
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

  if (!flags['template-ref']) {
    throw new Error(
      '--template-ref is required. Usage: template dry-run --template-ref "$(cat template.yaml)"',
    );
  }

  let template: unknown;
  try {
    template = yaml.parse(flags['template-ref']);
  } catch (parseError: any) {
    writeJson({
      valid: false,
      message: 'Failed to parse YAML template',
      errors: [
        `YAML parsing error: ${parseError.message}`,
        parseError.linePos
          ? `At line ${parseError.linePos[0].line}, column ${parseError.linePos[0].col}`
          : '',
      ].filter(Boolean),
    });
    return;
  }

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = new ScaffolderClient(baseUrl, accessToken);

  const values = flags.values ? JSON.parse(flags.values) : {};
  const result = await client.dryRun({ template, values });

  writeJson({
    valid: true,
    message: 'Template validation successful',
    log: result.log?.map(entry => ({
      message: entry.body.message,
      stepId: entry.body.stepId,
      status: entry.body.status,
    })),
    output: result.output,
    steps: result.steps,
  });
};

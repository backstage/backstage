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

import chalk from 'chalk';
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
        'template-ref': {
          type: String,
          description:
            'Template entity ref, e.g. template:default/my-template (required)',
        },
        values: {
          type: String,
          description: 'Template input values (JSON string, required)',
        },
        secrets: {
          type: String,
          description: 'Template secrets (JSON string)',
        },
        confirm: {
          type: Boolean,
          description: 'Execute for real (default: dry-run only)',
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
      '--template-ref is required. Usage: template execute --template-ref template:default/my-template --values \'{"name":"my-app"}\'',
    );
  }

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = new ActionsClient(baseUrl, accessToken);

  if (!flags.confirm) {
    process.stderr.write(
      `${chalk.yellow(
        'Dry-run mode',
      )} — pass --confirm to execute for real.\n\n`,
    );

    const result = await client.execute('scaffolder:dry-run-template', {
      templateYaml: flags['template-ref'],
      values: flags.values ? JSON.parse(flags.values) : undefined,
    });
    writeJson(result);
  } else {
    if (!flags.values) {
      throw new Error(
        '--values is required for template execution. Usage: template execute --template-ref <ref> --values \'{"key":"value"}\' --confirm',
      );
    }

    const input: Record<string, unknown> = {
      templateRef: flags['template-ref'],
      values: JSON.parse(flags.values),
    };
    if (flags.secrets) input.secrets = JSON.parse(flags.secrets);

    const result = await client.execute('scaffolder:execute-template', input);
    writeJson(result);
  }
};

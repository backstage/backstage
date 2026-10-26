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
import {
  parseKeyValuePairs,
  type CliCommandContext,
} from '@backstage/cli-node';
import { ScaffolderClient } from '../lib/ScaffolderClient';
import { instanceFlag, resolveAuth } from '../lib/resolveAuth';
import { writeJson } from '../lib/intentFormat';
import { readFileOrStdin } from '../lib/input';

export default async ({ args, info }: CliCommandContext) => {
  const parsed = cli(
    {
      name: info.usage,
      strictFlags: true,
      parameters: ['<file>'],
      flags: {
        value: {
          type: [String] as const,
          description: 'Template input value, as key=value (repeatable)',
          default: [] as string[],
        },
        ...instanceFlag,
      },
    },
    undefined,
    args,
  );
  const { flags } = parsed;

  const templateYaml = await readFileOrStdin(parsed._.file);

  let template: unknown;
  try {
    template = yaml.parse(templateYaml);
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
    process.exitCode = 1;
    return;
  }

  const values = parseKeyValuePairs(flags.value) ?? {};

  const { accessToken, baseUrl } = await resolveAuth(flags.instance);
  const client = new ScaffolderClient(baseUrl, accessToken);

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

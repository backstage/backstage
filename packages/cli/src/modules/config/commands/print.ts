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

import { cli } from 'cleye';
import { stringify as stringifyYaml } from 'yaml';
import { AppConfig, ConfigReader } from '@backstage/config';
import { loadCliConfig } from '../lib/config';
import { ConfigSchema, ConfigVisibility } from '@backstage/config-loader';
import type { CommandContext } from '../../../wiring/types';

export default async ({ args, info }: CommandContext) => {
  const {
    flags: { config, lax, frontend, withSecrets, format, package: pkg },
  } = cli(
    {
      help: info,
      flags: {
        package: { type: String, description: 'Package to print config for' },
        lax: {
          type: Boolean,
          description: 'Do not require environment variables to be set',
        },
        frontend: { type: Boolean, description: 'Only print frontend config' },
        withSecrets: {
          type: Boolean,
          description: 'Include secrets in the output',
        },
        format: { type: String, description: 'Output format (yaml or json)' },
        config: {
          type: [String],
          description: 'Config files to load instead of app-config.yaml',
        },
      },
    },
    undefined,
    args,
  );

  const { schema, appConfigs } = await loadCliConfig({
    args: config,
    fromPackage: pkg,
    mockEnv: lax,
    fullVisibility: !frontend,
  });
  const visibility = getVisibilityOption(frontend, withSecrets);
  const data = serializeConfigData(appConfigs, schema, visibility);

  if (format === 'json') {
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
  } else {
    process.stdout.write(`${stringifyYaml(data)}\n`);
  }
};

function getVisibilityOption(
  frontend: boolean | undefined,
  withSecrets: boolean | undefined,
): ConfigVisibility {
  if (frontend && withSecrets) {
    throw new Error('Not allowed to combine frontend and secret config');
  }
  if (frontend) {
    return 'frontend';
  } else if (withSecrets) {
    return 'secret';
  }
  return 'backend';
}

function serializeConfigData(
  appConfigs: AppConfig[],
  schema: ConfigSchema,
  visibility: ConfigVisibility,
) {
  if (visibility === 'frontend') {
    const frontendConfigs = schema.process(appConfigs, {
      visibility: ['frontend'],
    });
    return ConfigReader.fromConfigs(frontendConfigs).get();
  } else if (visibility === 'secret') {
    return ConfigReader.fromConfigs(appConfigs).get();
  }

  const sanitizedConfigs = schema.process(appConfigs, {
    valueTransform: (value, context) =>
      context.visibility === 'secret' ? '<secret>' : value,
  });

  return ConfigReader.fromConfigs(sanitizedConfigs).get();
}

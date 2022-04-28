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

import { OptionValues } from 'commander';
import { stringify as stringifyYaml } from 'yaml';
import { AppConfig, ConfigReader } from '@backstage/config';
import { loadCliConfig } from '../../lib/config';
import { ConfigSchema, ConfigVisibility } from '@backstage/config-loader';

export default async (opts: OptionValues) => {
  const { schema, appConfigs } = await loadCliConfig({
    args: opts.config,
    fromPackage: opts.package,
    mockEnv: opts.lax,
    fullVisibility: !opts.frontend,
  });
  const visibility = getVisibilityOption(opts);
  const data = serializeConfigData(appConfigs, schema, visibility);

  if (opts.format === 'json') {
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
  } else {
    process.stdout.write(`${stringifyYaml(data)}\n`);
  }
};

function getVisibilityOption(opts: OptionValues): ConfigVisibility {
  if (opts.frontend && opts.withSecrets) {
    throw new Error('Not allowed to combine frontend and secret config');
  }
  if (opts.frontend) {
    return 'frontend';
  } else if (opts.withSecrets) {
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

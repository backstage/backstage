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
import { loadCliConfig } from '../lib/config';
import type { CommandContext } from '../../../wiring/types';

export default async ({ args, info }: CommandContext) => {
  const {
    flags: { config, lax, frontend, deprecated, strict, package: pkg },
  } = cli(
    {
      help: info,
      flags: {
        package: {
          type: String,
          description: 'Package to validate config for',
        },
        lax: {
          type: Boolean,
          description: 'Do not require environment variables to be set',
        },
        frontend: {
          type: Boolean,
          description: 'Only validate frontend config',
        },
        deprecated: { type: Boolean, description: 'Output deprecated keys' },
        strict: { type: Boolean, description: 'Enable strict validation' },
        config: {
          type: [String],
          description: 'Config files to load instead of app-config.yaml',
        },
      },
    },
    undefined,
    args,
  );

  await loadCliConfig({
    args: config,
    fromPackage: pkg,
    mockEnv: lax,
    fullVisibility: !frontend,
    withDeprecatedKeys: deprecated,
    strict,
  });
};

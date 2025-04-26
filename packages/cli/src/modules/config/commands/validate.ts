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
import { loadCliConfig } from '../lib/config';
import { Command, Option } from 'clipanion';

export default async (opts: OptionValues) => {
  await loadCliConfig({
    args: opts.config,
    fromPackage: opts.package,
    mockEnv: opts.lax,
    fullVisibility: !opts.frontend,
    withDeprecatedKeys: opts.deprecated,
    strict: opts.strict,
  });
};

export class ValidateCommand extends Command {
  package = Option.String('--package', {
    description: 'Only load config schema that applies to the given package',
  });
  lax = Option.Boolean('--lax', {
    description: 'Do not require environment variables to be set',
  });
  frontend = Option.Boolean('--frontend', {
    description: 'Only validate the frontend configuration',
  });
  deprecated = Option.Boolean('--deprecated', {
    description: 'Output deprecated configuration settings',
  });
  strict = Option.Boolean('--strict', {
    description:
      'Enable strict config validation, forbidding errors and unknown keys',
  });
  config = Option.Array('--config', {
    description: 'Config files to load instead of app-config.yaml',
  });

  async execute() {
    await loadCliConfig({
      args: this.config ?? [],
      fromPackage: this.package,
      mockEnv: this.lax,
      fullVisibility: !this.frontend,
      withDeprecatedKeys: this.deprecated,
      strict: this.strict,
    });
  }
}

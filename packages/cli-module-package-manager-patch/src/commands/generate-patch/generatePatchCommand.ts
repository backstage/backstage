/*
 * Copyright 2026 The Backstage Authors
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
import { InputError } from '@backstage/errors';
import type { CliCommandContext } from '@backstage/cli-node';
import generatePatch from './generate-patch';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { target, registryUrl, baseVersion, query, skipInstall },
    _: [packageArg],
  } = cli(
    {
      name: info.usage,
      parameters: ['<package>'],
      flags: {
        target: {
          type: String,
          description: 'The target repository to generate patches for',
        },
        registryUrl: {
          type: String,
          description:
            'The registry to use for downloading artifacts (default: https://registry.npmjs.org)',
        },
        baseVersion: {
          type: String,
          description:
            'Override the base version to generate the patch towards instead',
        },
        query: {
          type: String,
          description:
            'Only apply the patch for a specific version query in the target repository',
        },
        skipInstall: {
          type: Boolean,
          description:
            'Skip dependency installation in the target repository after applying the patch',
        },
      },
    },
    undefined,
    args,
  );

  if (!target) {
    throw new InputError('Missing required option --target <target-repo>');
  }

  await generatePatch(packageArg, {
    target,
    registryUrl,
    baseVersion,
    query,
    skipInstall,
  });
};

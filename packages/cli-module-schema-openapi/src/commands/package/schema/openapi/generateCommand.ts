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
import type { CliCommandContext } from '@backstage/cli-node';
import { command } from './generate';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: {
      clientPackage,
      server,
      clientAdditionalProperties,
      serverAdditionalProperties,
      watch,
    },
  } = cli(
    {
      name: info.usage,
      flags: {
        clientPackage: {
          type: String,
          description:
            'Top-level path to where the client should be generated, ie packages/catalog-client.',
        },
        server: {
          type: Boolean,
          description: 'Generate server stub',
        },
        clientAdditionalProperties: {
          type: String,
          description:
            'Additional properties that can be passed to @openapitools/openapi-generator-cli',
        },
        serverAdditionalProperties: {
          type: String,
          description:
            'Additional properties that can be passed to @openapitools/openapi-generator-cli',
        },
        watch: {
          type: Boolean,
          description:
            'Watch the OpenAPI spec for changes and regenerate on save.',
        },
      },
    },
    undefined,
    args,
  );

  await command({
    clientPackage,
    server,
    clientAdditionalProperties,
    serverAdditionalProperties,
    watch,
  });
};

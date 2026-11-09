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
import { buildApiReports } from './buildApiReports';

function splitList(values: string[]): string[] {
  return values.flatMap(value => value.split(','));
}

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: {
      ci,
      tsc,
      docs,
      sqlReports,
      include,
      exclude,
      allowWarnings,
      allowAllWarnings,
      omitMessages,
      validateReleaseTags,
    },
    _: paths,
  } = cli(
    {
      name: info.usage,
      parameters: ['[paths...]'],
      flags: {
        ci: {
          type: Boolean,
          description: 'CI run checks that there is no changes on API reports',
        },
        tsc: {
          type: Boolean,
          description:
            'executes the tsc compilation before extracting the APIs',
        },
        docs: {
          type: Boolean,
          description: 'generates the api documentation',
        },
        sqlReports: {
          type: Boolean,
          description: 'Also generate SQL reports from migration files',
        },
        include: {
          type: [String],
          description: 'Only include packages matching the provided patterns',
        },
        exclude: {
          type: [String],
          description: 'Exclude package matching the provided patterns',
        },
        allowWarnings: {
          type: String,
          alias: 'a',
          description:
            'continue processing packages after getting errors on selected packages Allows glob patterns and comma separated values (i.e. packages/core,plugins/core-*)',
        },
        allowAllWarnings: {
          type: Boolean,
          description:
            'continue processing packages after getting errors on all packages',
          default: false,
        },
        omitMessages: {
          type: String,
          alias: 'o',
          description:
            'select some message code to be omitted on the API Extractor (comma separated values i.e ae-cyclic-inherit-doc,ae-missing-getter )',
        },
        validateReleaseTags: {
          type: Boolean,
          description:
            'Turn on release tag validation for the public, beta, and alpha APIs',
        },
      },
    },
    undefined,
    args,
  );

  await buildApiReports(paths, {
    ci,
    tsc,
    docs,
    sqlReports,
    include: include.length > 0 ? splitList(include) : undefined,
    exclude: exclude.length > 0 ? splitList(exclude) : undefined,
    allowWarnings,
    allowAllWarnings,
    omitMessages,
    validateReleaseTags,
  });
};

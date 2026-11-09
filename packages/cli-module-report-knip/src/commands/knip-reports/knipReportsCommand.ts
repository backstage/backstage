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
import { buildKnipReports } from './knip-reports';

export default async ({ args, info }: CliCommandContext) => {
  const {
    flags: { ci },
    _: paths,
  } = cli(
    {
      name: info.usage,
      parameters: ['[paths...]'],
      flags: {
        ci: {
          type: Boolean,
          description: 'CI run checks that there is no changes on knip reports',
        },
      },
    },
    undefined,
    args,
  );

  await buildKnipReports(paths, { ci });
};

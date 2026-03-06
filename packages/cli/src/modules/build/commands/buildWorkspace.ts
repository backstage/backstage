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

import fs from 'fs-extra';
import { cli } from 'cleye';
import { createDistWorkspace } from '../lib/packager';
import type { CommandContext } from '../../../wiring/types';

export default async ({ args, info }: CommandContext) => {
  // Support legacy --alwaysYarnPack and --alwaysPack aliases (including =value form)
  const normalizedArgs = args.map(a => {
    for (const old of ['--alwaysYarnPack', '--alwaysPack']) {
      if (a === old || a.startsWith(`${old}=`)) {
        process.stderr.write(
          `DEPRECATION WARNING: ${old} has been renamed to --always-pack\n`,
        );
        return `--always-pack${a.substring(old.length)}`;
      }
    }
    return a;
  });

  const {
    flags: { alwaysPack },
    _: positionals,
  } = cli(
    {
      help: { ...info, usage: `${info.usage} <workspace-dir> [packages...]` },
      parameters: ['<workspace-dir>', '[packages...]'],
      flags: {
        alwaysPack: {
          type: Boolean,
          description:
            'Force workspace output to be a result of running `yarn pack` on each package (warning: very slow)',
        },
      },
    },
    undefined,
    normalizedArgs,
  );

  const [dir, ...packages] = positionals;

  if (!(await fs.pathExists(dir))) {
    throw new Error(`Target workspace directory doesn't exist, '${dir}'`);
  }

  await createDistWorkspace(packages, {
    targetDir: dir,
    alwaysPack,
    enableFeatureDetection: true,
  });
};

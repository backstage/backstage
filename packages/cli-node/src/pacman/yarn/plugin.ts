/*
 * Copyright 2024 The Backstage Authors
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
import { paths } from '../../util';
import fs from 'fs-extra';
import yaml from 'yaml';
import z from 'zod';

const yarnRcSchema = z.object({
  plugins: z
    .array(
      z.object({
        path: z.string(),
      }),
    )
    .optional(),
});

export async function getHasYarnPlugin() {
  const yarnRcPath = paths.resolveTargetRoot('.yarnrc.yml');
  const yarnRcContent: string = await fs
    .readFile(yarnRcPath, 'utf-8')
    .catch(e => {
      if (e.code === 'ENOENT') {
        // gracefully continue in case the file doesn't exist
        return '';
      }
      throw e;
    });

  if (!yarnRcContent) {
    return false;
  }

  const parseResult = yarnRcSchema.safeParse(yaml.parse(yarnRcContent));

  if (!parseResult.success) {
    throw new Error(
      `Unexpected content in .yarnrc.yml: ${parseResult.error.toString()}`,
    );
  }

  const yarnRc = parseResult.data;
  if (!yarnRc.plugins) {
    return false;
  }

  return yarnRc.plugins.some(
    plugin => plugin.path === '.yarn/plugins/@yarnpkg/plugin-backstage.cjs',
  );
}

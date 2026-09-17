/*
 * Copyright 2021 The Backstage Authors
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

import { JsonObject } from '@backstage/types';
import { fileURLToPath } from 'node:url';

export async function yeomanRun(
  workspace: string,
  namespace: string,
  args?: string[],
  opts?: JsonObject,
) {
  // Use dynamic import for yeoman-environment v4+ ESM compatibility
  const { createEnv, lookupGenerator } = await import('yeoman-environment');
  const env = createEnv({ cwd: workspace });
  const generatorResult = lookupGenerator(namespace);
  const generatorFile = Array.isArray(generatorResult)
    ? generatorResult[0]
    : generatorResult;

  if (!generatorFile) {
    throw new Error(`No Yeoman generator found for namespace "${namespace}"`);
  }

  // Convert file:// URL to absolute path if needed (v6 returns file:// URLs for absolute paths)
  const absoluteFile = generatorFile.startsWith('file://')
    ? fileURLToPath(generatorFile)
    : generatorFile;

  env.register(absoluteFile, { namespace });

  const yeomanArgs = [namespace, ...(args ?? [])];
  await env.run(yeomanArgs, opts);
}

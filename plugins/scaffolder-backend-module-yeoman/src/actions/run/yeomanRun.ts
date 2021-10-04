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

import { JsonObject } from '@backstage/config';

/*
 * This module should use '@types/yeoman-environment' eventually as soon as '@types/yeoman-environment' supports
 * the latest version of Yeoman -> 3.x. Then it will be possible to test this module with jest.
 */

export async function yeomanRun(
  workspace: string,
  namespace: string,
  args?: string[],
  opts?: JsonObject,
) {
  const yeoman = require('yeoman-environment');
  const generator = yeoman.lookupGenerator(namespace);
  const env = yeoman.createEnv(undefined, { cwd: workspace });
  env.register(generator, namespace);
  const yeomanArgs = [namespace, ...(args ?? [])];
  await env.run(yeomanArgs, opts);
}

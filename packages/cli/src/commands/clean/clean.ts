/*
 * Copyright 2020 Spotify AB
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
import { resolve as resolvePath, relative as relativePath } from 'path';
import { getDefaultCacheOptions } from 'commands/build-cache/options';
import { paths } from 'lib/paths';

export default async function clean() {
  const cacheOptions = getDefaultCacheOptions();
  const packagePath = getPackagePath(cacheOptions.cacheDir);
  await fs.remove(cacheOptions.output);
  await fs.remove(packagePath);
}

function getPackagePath(cacheDir: string) {
  const relativePackagePath = relativePath(paths.targetRoot, paths.targetDir);
  const packagePath = resolvePath(cacheDir, relativePackagePath);
  return packagePath;
}

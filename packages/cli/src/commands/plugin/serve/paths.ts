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

import { existsSync } from 'fs';
import { paths } from 'lib/paths';

export function getPaths() {
  const resolveTargetModule = (path: string) => {
    for (const ext of ['mjs', 'js', 'ts', 'tsx', 'jsx']) {
      const filePath = paths.resolveTarget(`${path}.${ext}`);
      if (existsSync(filePath)) {
        return filePath;
      }
    }
    return paths.resolveTarget(`${path}.js`);
  };

  let appHtml = paths.resolveTarget('dev/index.html');
  if (!existsSync(appHtml)) {
    appHtml = paths.resolveOwn('templates/serve_index.html');
  }

  return {
    appHtml,
    appPath: paths.resolveTarget('.'),
    appAssets: paths.resolveTarget('assets'),
    appSrc: paths.resolveTarget('src'),
    appDev: paths.resolveTarget('dev'),
    appDevEntry: resolveTargetModule('dev/index'),
    appTsConfig: paths.resolveTarget('tsconfig.json'),
    appNodeModules: paths.resolveTarget('node_modules'),
    appPackageJson: paths.resolveTarget('package.json'),
  };
}

export type Paths = ReturnType<typeof getPaths>;

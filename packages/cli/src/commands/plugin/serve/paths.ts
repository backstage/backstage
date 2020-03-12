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

import { resolve as resolvePath } from 'path';
import { existsSync, realpathSync } from 'fs';

export function getPaths() {
  const appDir = realpathSync(process.cwd());

  const resolveApp = (path: string) => resolvePath(appDir, path);
  const resolveOwn = (path: string) => resolvePath(__dirname, '..', path);
  const resolveAppModule = (path: string) => {
    for (const ext of ['mjs', 'js', 'ts', 'tsx', 'jsx']) {
      const filePath = resolveApp(`${path}.${ext}`);
      if (existsSync(filePath)) {
        return filePath;
      }
    }
    return resolveApp(`${path}.js`);
  };

  let appHtml = resolveApp('dev/index.html');
  if (!existsSync(appHtml)) {
    appHtml = resolveOwn('../../templates/serve_index.html');
  }

  return {
    appHtml,
    appPath: resolveApp('.'),
    appAssets: resolveApp('assets'),
    appSrc: resolveApp('src'),
    appDev: resolveApp('dev'),
    appDevEntry: resolveAppModule('dev/index'),
    appTsConfig: resolveApp('tsconfig.json'),
    appNodeModules: resolveApp('node_modules'),
    appPackageJson: resolveApp('package.json'),
  };
}

export type Paths = ReturnType<typeof getPaths>;

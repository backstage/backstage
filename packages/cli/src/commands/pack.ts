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
import { paths } from '../lib/paths';

export const pre = async () => {
  const pkgPath = paths.resolveTarget('package.json');

  const pkg = await fs.readJson(pkgPath);
  pkg.types = 'dist/index.d.ts';
  await fs.writeJson(pkgPath, pkg, { encoding: 'utf8', spaces: 2 });
};

export const post = async () => {
  const pkgPath = paths.resolveTarget('package.json');

  const pkg = await fs.readJson(pkgPath);
  pkg.types = 'src/index.ts';
  await fs.writeJson(pkgPath, pkg, { encoding: 'utf8', spaces: 2 });
};

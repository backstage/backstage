/*
 * Copyright 2022 The Backstage Authors
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

import { paths } from '../paths';
import fs from 'fs-extra';

export async function isMonoRepo(): Promise<boolean> {
  const rootPackageJsonPath = paths.resolveTargetRoot('package.json');
  try {
    const pkg = await fs.readJson(rootPackageJsonPath);
    return Boolean(pkg?.workspaces?.packages);
  } catch (error) {
    return false;
  }
}

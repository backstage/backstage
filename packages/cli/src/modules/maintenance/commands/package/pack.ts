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

import {
  productionPack,
  revertProductionPack,
} from '../../../../modules/build/lib/packager/productionPack';
import { paths } from '../../../../lib/paths';
import fs from 'fs-extra';
import { publishPreflightCheck } from '../../../../lib/publishing';
import { createTypeDistProject } from '../../../../lib/typeDistProject';

export const pre = async () => {
  publishPreflightCheck({
    dir: paths.targetDir,
    packageJson: await fs.readJson(paths.resolveTarget('package.json')),
  });

  await productionPack({
    packageDir: paths.targetDir,
    featureDetectionProject: await createTypeDistProject(),
  });
};

export const post = async () => {
  await revertProductionPack(paths.targetDir);
};

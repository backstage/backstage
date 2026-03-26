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

import { cli } from 'cleye';
import fs from 'fs-extra';
import { targetPaths } from '@backstage/cli-common';
import { productionPack } from '../../lib/packager/productionPack';
import { publishPreflightCheck } from '../../lib/publishing';
import { createTypeDistProject } from '../../lib/typeDistProject';
import type { CliCommandContext } from '@backstage/cli-node';

export default async ({ args, info }: CliCommandContext) => {
  cli({ help: info, booleanFlagNegation: true }, undefined, args);

  publishPreflightCheck({
    dir: targetPaths.dir,
    packageJson: await fs.readJson(targetPaths.resolve('package.json')),
  });

  await productionPack({
    packageDir: targetPaths.dir,
    featureDetectionProject: await createTypeDistProject(),
  });
};

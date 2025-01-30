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

import { Descriptor, Project, structUtils } from '@yarnpkg/core';
import { getPackageVersion } from '../util';
import { PROTOCOL } from '../constants';

export const reduceDependency = async (
  dependency: Descriptor,
  project: Project,
) => {
  const range = structUtils.parseRange(dependency.range);

  if (range.protocol === PROTOCOL) {
    return structUtils.makeDescriptor(
      dependency,
      `npm:^${await getPackageVersion(dependency, project.configuration)}`,
    );
  }

  return dependency;
};

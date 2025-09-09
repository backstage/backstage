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

import assert from 'assert';
import { valid as semverValid } from 'semver';
import { ppath, xfs } from '@yarnpkg/fslib';
import { BACKSTAGE_JSON } from '@backstage/cli-common';
import { ForwardedError } from '@backstage/errors';
import { memoize } from './memoize';
import { getWorkspaceRoot } from './getWorkspaceRoot';

export const getCurrentBackstageVersion = memoize(() => {
  const backstageJsonPath = ppath.join(getWorkspaceRoot(), BACKSTAGE_JSON);

  let backstageVersion: string | null = null;
  try {
    const backstageVersionRaw = xfs.readJsonSync(backstageJsonPath).version;
    assert(backstageVersionRaw !== undefined, 'Version field is missing');
    backstageVersion = semverValid(backstageVersionRaw);

    assert(backstageVersion !== null, 'Version exists but is not valid semver');
  } catch (err) {
    throw new ForwardedError(
      'Valid version string not found in backstage.json',
      err,
    );
  }

  return backstageVersion;
});

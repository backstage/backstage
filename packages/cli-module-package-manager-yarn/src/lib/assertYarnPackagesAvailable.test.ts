/*
 * Copyright 2026 The Backstage Authors
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

import { assertYarnPackagesAvailable } from './assertYarnPackagesAvailable';

describe('assertYarnPackagesAvailable', () => {
  it('passes when all packages can be resolved', () => {
    expect(() => assertYarnPackagesAvailable(name => name)).not.toThrow();
  });

  it('throws with the missing packages when some cannot be resolved', () => {
    expect(() =>
      assertYarnPackagesAvailable(name => {
        if (name === '@yarnpkg/core') {
          throw new Error('not found');
        }
        return name;
      }),
    ).toThrow(
      /requires these packages to be installed: @yarnpkg\/core\..*"@yarnpkg\/core\/got": "npm:\^11\.8\.6"/,
    );
  });
});

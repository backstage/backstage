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

import { execFileSync } from 'child_process';
import { resolve as resolvePath } from 'path';

const exportValues = {
  all: {
    namedA: 'a',
    namedB: 'b',
    namedC: 'c',
    defaultA: 'a',
    defaultB: 'b',
    defaultC: 'c',
  },
  commonJs: {
    namedA: 'a',
    namedC: 'c',
    defaultA: 'a',
    defaultC: 'c',
  },
};

const expectedExports = {
  commonJs: {
    ...exportValues.commonJs,
    dyn: exportValues.all,
    default: {
      ...exportValues.commonJs,
      dyn: exportValues.all,
    },
  },
  module: {
    ...exportValues.all,
    dyn: exportValues.all,
  },
};

function loadFixture(fixture: string) {
  return JSON.parse(
    execFileSync(
      'node',
      [
        '--import',
        '@backstage/cli/config/nodeTransform.cjs',
        resolvePath(__dirname, `__fixtures__/${fixture}`),
      ],
      { encoding: 'utf8' },
    ),
  );
}

describe('node runtime module transforms', () => {
  it('should load from commonjs format', async () => {
    expect(loadFixture('pkg-commonjs/main.ts')).toEqual({
      depCommonJs: expectedExports.commonJs,
      depDefault: expectedExports.commonJs,
      dynCommonJs: expectedExports.commonJs,
      dynDefault: expectedExports.commonJs,
      dynModule: expectedExports.module,
      dep: exportValues.commonJs,
      dyn: exportValues.all,
    });
  });

  it('should load from default format', async () => {
    expect(loadFixture('pkg-default/main.ts')).toEqual({
      depCommonJs: expectedExports.commonJs,
      depDefault: expectedExports.commonJs,
      dynCommonJs: expectedExports.commonJs,
      dynDefault: expectedExports.commonJs,
      dynModule: expectedExports.module,
      dep: exportValues.commonJs,
      dyn: exportValues.all,
    });
  });

  it('should load from module format', async () => {
    expect(loadFixture('pkg-module/main.ts')).toEqual({
      depCommonJs: expectedExports.commonJs,
      depDefault: expectedExports.commonJs,
      depModule: expectedExports.module,
      dynCommonJs: expectedExports.commonJs,
      dynDefault: expectedExports.commonJs,
      dynModule: expectedExports.module,
      dep: exportValues.all,
      dyn: exportValues.all,
    });
  });
});

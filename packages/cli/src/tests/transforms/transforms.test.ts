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
import { Output, buildPackage } from '../../modules/build/lib/builder';

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
  const output = execFileSync(
    'node',
    [
      '--import',
      '@backstage/cli/config/nodeTransform.cjs',
      resolvePath(__dirname, `__fixtures__/${fixture}`),
    ],
    { encoding: 'utf8' },
  );
  return JSON.parse(output);
}

describe('node runtime module transforms', () => {
  it('should load from commonjs format', async () => {
    expect(loadFixture('pkg-commonjs/print.ts')).toEqual({
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
    expect(loadFixture('pkg-default/print.ts')).toEqual({
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
    expect(loadFixture('pkg-module/print.ts')).toEqual({
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

describe('Jest runtime module transforms', () => {
  it('should load from commonjs format', async () => {
    const values = await import('./__fixtures__/pkg-commonjs/main').then(
      m => m.values,
    );
    expect(values).toEqual({
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
    const values = await import('./__fixtures__/pkg-default/main').then(
      m => m.values,
    );
    expect(values).toEqual({
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
    // This uses a separate entry point with an explicit .mts extension. This is
    // because we can't cleanly switch the Jest behavior based on type=module in
    // package.json for .ts files in Jest. If a module type is detected we
    // instead need to switch the transforms for the entire Jest project, which
    // we can't do for this test. We instead use the explicit .mts extension to
    // verify the transform behavior.

    // @ts-expect-error Cannot find module './__fixtures__/pkg-module/main-explicit' or its corresponding type declarations.
    const values = await import('./__fixtures__/pkg-module/main-explicit').then(
      m => m.values,
    );
    expect(values).toEqual({
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

describe('package build transforms', () => {
  it('should build and load from commonjs format', async () => {
    const pkgPath = resolvePath(__dirname, '__fixtures__/pkg-commonjs');

    await buildPackage({
      targetDir: pkgPath,
      outputs: new Set([Output.cjs]),
      workspacePackages: [],
    });
    const values = await import(resolvePath(pkgPath, 'dist/index.cjs.js')).then(
      m => m.values,
    );
    expect(values).toEqual({
      depCommonJs: expectedExports.commonJs,
      depDefault: expectedExports.commonJs,
      dynCommonJs: expectedExports.commonJs,
      dynDefault: expectedExports.commonJs,
      dynModule: expectedExports.module,
      dep: exportValues.commonJs,
      dyn: exportValues.all,
    });

    expect(loadFixture('pkg-commonjs/dist/print.cjs.js')).toEqual({
      depCommonJs: expectedExports.commonJs,
      depDefault: expectedExports.commonJs,
      dynCommonJs: expectedExports.commonJs,
      dynDefault: expectedExports.commonJs,
      dynModule: expectedExports.module,
      dep: exportValues.commonJs,
      dyn: exportValues.all,
    });
  });

  it('should build and load from default format', async () => {
    const pkgPath = resolvePath(__dirname, '__fixtures__/pkg-default');

    await buildPackage({
      targetDir: pkgPath,
      outputs: new Set([Output.cjs]),
      workspacePackages: [],
    });
    const values = await import(resolvePath(pkgPath, 'dist/index.cjs.js')).then(
      m => m.values,
    );
    expect(values).toEqual({
      depCommonJs: expectedExports.commonJs,
      depDefault: expectedExports.commonJs,
      dynCommonJs: expectedExports.commonJs,
      dynDefault: expectedExports.commonJs,
      dynModule: expectedExports.module,
      dep: exportValues.commonJs,
      dyn: exportValues.all,
    });

    expect(loadFixture('pkg-default/dist/print.cjs.js')).toEqual({
      depCommonJs: expectedExports.commonJs,
      depDefault: expectedExports.commonJs,
      dynCommonJs: expectedExports.commonJs,
      dynDefault: expectedExports.commonJs,
      dynModule: expectedExports.module,
      dep: exportValues.commonJs,
      dyn: exportValues.all,
    });
  });

  it('should build and load from module format', async () => {
    const pkgPath = resolvePath(__dirname, '__fixtures__/pkg-module');

    await buildPackage({
      targetDir: pkgPath,
      outputs: new Set([Output.cjs]),
      workspacePackages: [],
    });
    const values = await import(resolvePath(pkgPath, 'dist/index.mjs')).then(
      m => m.values,
    );
    expect(values).toEqual({
      depCommonJs: expectedExports.commonJs,
      depDefault: expectedExports.commonJs,
      depModule: expectedExports.module,
      dynCommonJs: expectedExports.commonJs,
      dynDefault: expectedExports.commonJs,
      dynModule: expectedExports.module,
      dep: exportValues.all,
      dyn: exportValues.all,
    });

    expect(loadFixture('pkg-module/dist/print.mjs')).toEqual({
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

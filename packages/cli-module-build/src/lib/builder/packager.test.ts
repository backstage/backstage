/*
 * Copyright 2021 The Backstage Authors
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

import { rollup } from 'rollup';
import { buildPackage, buildPackages, formatErrorMessage } from './packager';
import { Output } from './types';

const env = process.env as { NODE_ENV?: string };

jest.mock('rollup', () => ({
  rollup: jest.fn(async () => {
    // Like postcss-load-config, which package builds use to load PostCSS
    // configs
    (process.env as { NODE_ENV?: string }).NODE_ENV ||= 'development';
    return { generate: async () => {}, write: async () => {} };
  }),
}));

jest.mock('./config', () => ({
  makeRollupConfigs: async () => [{ output: { dir: 'dist' } }],
}));

jest.mock('fs-extra', () => ({
  ...jest.requireActual('fs-extra'),
  remove: async () => {},
}));

describe('package builds', () => {
  const nodeEnv = env.NODE_ENV;

  afterEach(() => {
    env.NODE_ENV = nodeEnv;
  });

  it('restore NODE_ENV when a build sets it', async () => {
    const options = {
      targetDir: '/package',
      outputs: new Set([Output.cjs]),
      workspacePackages: [],
    };
    delete env.NODE_ENV;

    await buildPackages([options]);
    expect(env.NODE_ENV).toBeUndefined();

    await buildPackage(options);
    expect(env.NODE_ENV).toBeUndefined();

    expect(rollup).toHaveBeenCalledTimes(2);
  });
});

describe('formatErrorMessage with esbuild plugin error', () => {
  it('given error with missing errors array then error message should be shown', () => {
    const msg = formatErrorMessage({
      code: 'PLUGIN_ERROR',
      plugin: 'esbuild',
      message: 'test',
    });
    expect(msg).toBe('test');
  });
  it('given error with errors array then error message should have new lines', () => {
    const msg = formatErrorMessage({
      code: 'PLUGIN_ERROR',
      plugin: 'esbuild',
      message: 'test',
      id: 'index.js',
      errors: [{ text: 'Sample', location: { line: 1, column: 1 } }],
    });
    expect(msg).toContain('test\n\n');
  });
});

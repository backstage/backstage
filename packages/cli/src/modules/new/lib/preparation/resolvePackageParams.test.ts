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
import { resolvePackageParams } from './resolvePackageParams';

describe.each([
  [
    { role: 'web-library', name: 'test' },
    {
      packageName: '@internal/test',
      packagePath: 'packages/test',
    },
  ],
  [
    { role: 'node-library', name: 'test' },
    {
      packageName: '@internal/test',
      packagePath: 'packages/test',
    },
  ],
  [
    { role: 'common-library', name: 'test' },
    {
      packageName: '@internal/test',
      packagePath: 'packages/test',
    },
  ],
  [
    { role: 'plugin-web-library', pluginId: 'test' },
    {
      packageName: '@internal/plugin-test-react',
      packagePath: 'plugins/test-react',
    },
  ],
  [
    { role: 'plugin-node-library', pluginId: 'test' },
    {
      packageName: '@internal/plugin-test-node',
      packagePath: 'plugins/test-node',
    },
  ],
  [
    { role: 'plugin-common-library', pluginId: 'test' },
    {
      packageName: '@internal/plugin-test-common',
      packagePath: 'plugins/test-common',
    },
  ],
  [
    { role: 'frontend-plugin', pluginId: 'test' },
    {
      packageName: '@internal/plugin-test',
      packagePath: 'plugins/test',
    },
  ],
  [
    { role: 'backend-plugin', pluginId: 'test' },
    {
      packageName: '@internal/plugin-test-backend',
      packagePath: 'plugins/test-backend',
    },
  ],
  [
    { role: 'frontend-plugin-module', pluginId: 'test1', moduleId: 'test2' },
    {
      packageName: '@internal/plugin-test1-module-test2',
      packagePath: 'plugins/test1-module-test2',
    },
  ],
  [
    { role: 'backend-plugin-module', pluginId: 'test1', moduleId: 'test2' },
    {
      packageName: '@internal/plugin-test1-backend-module-test2',
      packagePath: 'plugins/test1-backend-module-test2',
    },
  ],
] as const)('resolvePackageInfo', (roleParams, packageInfo) => {
  it(`should generate correct info with default config for ${roleParams.role}`, () => {
    expect(
      resolvePackageParams({
        roleParams,
        packagePrefix: '@internal/',
        pluginInfix: 'plugin-',
      }),
    ).toEqual(packageInfo);
  });
});

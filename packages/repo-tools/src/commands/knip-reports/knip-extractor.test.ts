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

import { BackstagePackage, PackageRole } from '@backstage/cli-node';
import { findDiscoveredDependencies } from './knip-extractor';

const pkg = (
  name: string,
  role: PackageRole,
  dependencies: string[] = [],
  devDependencies: string[] = [],
): BackstagePackage => ({
  dir: name,
  packageJson: {
    name,
    version: '1.0.0',
    backstage: { role },
    dependencies: Object.fromEntries(dependencies.map(d => [d, '*'])),
    devDependencies: Object.fromEntries(devDependencies.map(d => [d, '*'])),
  },
});

describe('findDiscoveredDependencies', () => {
  it('should only include frontend plugins and modules that an app depends on', () => {
    expect(
      findDiscoveredDependencies([
        pkg(
          'app',
          'frontend',
          ['plugin-a', 'module-a', 'lib-react', 'react'],
          ['plugin-dev'],
        ),
        pkg('empty-app', 'frontend', ['lib-react']),
        pkg('plugin-a', 'frontend-plugin', ['plugin-b']),
        pkg('module-a', 'frontend-plugin-module'),
        pkg('lib-react', 'web-library'),
        pkg('plugin-b', 'frontend-plugin'),
        pkg('plugin-dev', 'frontend-plugin'),
      ]),
    ).toEqual({ app: ['plugin-a', 'module-a'] });
  });
});

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

import fs from 'fs-extra';
import { sep } from 'path';
import { Task } from '../../tasks';
import { FactoryRegistry } from '../FactoryRegistry';
import {
  createMockOutputStream,
  expectLogsToMatch,
  mockPaths,
} from './common/testUtils';
import { catalogEntityProviderModule } from './catalogEntityProviderModule';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('catalogEntityProviderModule factory', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    mockPaths({
      targetRoot: mockDir.path,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a catalog backend module package', async () => {
    mockDir.setContent({
      plugins: {},
    });

    const options = await FactoryRegistry.populateOptions(
      catalogEntityProviderModule,
      {
        id: 'test',
      },
    );

    let modified = false;

    const [output, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);
    jest.spyOn(Task, 'forCommand').mockResolvedValue();

    await catalogEntityProviderModule.create(options, {
      private: true,
      isMonoRepo: true,
      defaultVersion: '1.0.0',
      markAsModified: () => {
        modified = true;
      },
      createTemporaryDirectory: (name: string) => fs.mkdtemp(name),
      license: 'Apache-2.0',
    });

    expect(modified).toBe(true);

    expectLogsToMatch(output, [
      'Creating module backstage-plugin-catalog-backend-entity-provider-module-test',
      'Checking Prerequisites:',
      `availability  plugins${sep}catalog-backend-entity-provider-module-test`,
      'creating      temp dir',
      'Executing Template:',
      'templating    README.md.hbs',
      'templating    config.d.ts.hbs',
      'templating    .eslintrc.js.hbs',
      'templating    package.json.hbs',
      'templating    EntityProvider.ts.hbs',
      'templating    index.ts.hbs',
      'templating    module.ts.hbs',
      'Installing:',
      `moving        plugins${sep}catalog-backend-entity-provider-module-test`,
    ]);

    await expect(
      fs.readJson(
        mockDir.resolve(
          'plugins/catalog-backend-entity-provider-module-test/package.json',
        ),
      ),
    ).resolves.toEqual(
      expect.objectContaining({
        name: 'backstage-plugin-catalog-backend-entity-provider-module-test',
        description: 'The test module for @backstage/plugin-catalog-backend',
        private: true,
        version: '1.0.0',
      }),
    );

    expect(Task.forCommand).toHaveBeenCalledTimes(2);
    expect(Task.forCommand).toHaveBeenCalledWith('yarn install', {
      cwd: mockDir.resolve(
        'plugins/catalog-backend-entity-provider-module-test',
      ),
      optional: true,
    });
    expect(Task.forCommand).toHaveBeenCalledWith('yarn lint --fix', {
      cwd: mockDir.resolve(
        'plugins/catalog-backend-entity-provider-module-test',
      ),
      optional: true,
    });
  });
});

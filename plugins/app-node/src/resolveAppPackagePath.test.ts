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

import { overridePackagePathResolution } from '@backstage/backend-plugin-api/testUtils';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path';
import { resolveAppPackagePath } from './resolveAppPackagePath';

// Package names that are not installed anywhere in this repository
const appPackageName = 'resolve-app-package-path-test-app';
const missingAppPackageName = 'resolve-app-package-path-missing-app';

describe('resolveAppPackagePath', () => {
  const mockDir = createMockDirectory({
    content: {
      // A backend package that has the app package in its own node_modules
      [`project/packages/backend/node_modules/${appPackageName}/package.json`]:
        JSON.stringify({ name: appPackageName }),
      // A copy outside of the project, which must not be used
      [`outside/node_modules/${missingAppPackageName}/package.json`]:
        JSON.stringify({ name: missingAppPackageName }),
    },
  });
  const rootDir = mockDir.resolve('project');
  const backendDir = mockDir.resolve('project/packages/backend');
  const expectedAppDir = fs.realpathSync(
    resolvePath(backendDir, 'node_modules', appPackageName),
  );

  let argv: string[];

  beforeEach(() => {
    argv = process.argv;
    overrideTargetPaths({ dir: backendDir, rootDir });
    jest.spyOn(process, 'cwd').mockReturnValue(backendDir);
  });

  afterEach(() => {
    process.argv = argv;
    jest.restoreAllMocks();
  });

  it('uses the regular package path resolution first', () => {
    // Wins over the copy that the backend package has
    const override = overridePackagePathResolution({
      packageName: appPackageName,
      path: '/mocked/app',
    });
    try {
      expect(resolveAppPackagePath(appPackageName, 'dist')).toBe(
        resolvePath('/mocked/app', 'dist'),
      );
    } finally {
      override.restore();
    }

    // Errors other than a missing package are not hidden by the fallback
    const failing = overridePackagePathResolution({
      packageName: appPackageName,
      paths: {
        dist: () => {
          throw new Error('Unexpected failure');
        },
      },
    });
    try {
      expect(() => resolveAppPackagePath(appPackageName, 'dist')).toThrow(
        'Unexpected failure',
      );
    } finally {
      failing.restore();
    }
  });

  it('resolves the app package from the backend package when the regular resolution cannot find it', () => {
    // From the working directory
    expect(resolveAppPackagePath(appPackageName, 'dist')).toBe(
      resolvePath(expectedAppDir, 'dist'),
    );

    // From the script path, which is the only way to find the backend
    // package when the entry point is an ES module
    jest.spyOn(process, 'cwd').mockReturnValue(rootDir);
    process.argv = [argv[0], resolvePath(backendDir, 'index.mjs')];
    expect(resolveAppPackagePath(appPackageName, 'dist')).toBe(
      resolvePath(expectedAppDir, 'dist'),
    );

    // Copies outside of the project root are not used, and the original error
    // is thrown and says where else it looked
    jest.spyOn(process, 'cwd').mockReturnValue(mockDir.resolve('outside'));
    expect(() => resolveAppPackagePath(missingAppPackageName, 'dist')).toThrow(
      expect.objectContaining({
        code: 'MODULE_NOT_FOUND',
        message: expect.stringContaining(
          `The app package was also not found from`,
        ),
      }),
    );
    expect(() => resolveAppPackagePath(missingAppPackageName, 'dist')).toThrow(
      `within ${rootDir}`,
    );
  });
});

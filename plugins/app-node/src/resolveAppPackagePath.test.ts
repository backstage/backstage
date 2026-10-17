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
import fs from 'fs-extra';
import { tmpdir } from 'node:os';
import { join as joinPath, resolve as resolvePath } from 'node:path';
import { resolveAppPackagePath } from './resolveAppPackagePath';

// Package names that are not installed anywhere in this repository
const appPackageName = 'resolve-app-package-path-test-app';
const missingAppPackageName = 'resolve-app-package-path-missing-app';

describe('resolveAppPackagePath', () => {
  let rootDir: string;
  let backendDir: string;

  beforeAll(async () => {
    // A backend package that has the app package in its own node_modules
    rootDir = await fs.realpath(
      await fs.mkdtemp(joinPath(tmpdir(), 'resolve-app-package-path-')),
    );
    backendDir = joinPath(rootDir, 'packages', 'backend');
    await fs.outputJson(
      joinPath(backendDir, 'node_modules', appPackageName, 'package.json'),
      { name: appPackageName },
    );
  });

  afterAll(async () => {
    await fs.remove(rootDir);
  });

  beforeEach(() => {
    jest.spyOn(process, 'cwd').mockReturnValue(backendDir);
  });

  afterEach(() => {
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
    expect(resolveAppPackagePath(appPackageName, 'dist')).toBe(
      joinPath(backendDir, 'node_modules', appPackageName, 'dist'),
    );

    // When the backend package does not have it either, the original error is
    // thrown and says where else it looked
    expect(() => resolveAppPackagePath(missingAppPackageName, 'dist')).toThrow(
      expect.objectContaining({
        code: 'MODULE_NOT_FOUND',
        message: expect.stringContaining(
          `The app package was also not found from`,
        ),
      }),
    );
    expect(() => resolveAppPackagePath(missingAppPackageName, 'dist')).toThrow(
      backendDir,
    );
  });
});

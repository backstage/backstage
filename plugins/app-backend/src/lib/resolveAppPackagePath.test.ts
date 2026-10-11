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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { overridePackagePathResolution } from '@backstage/backend-plugin-api/testUtils';
import { realpathSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { resolveAppPackagePath } from './resolveAppPackagePath';

// Names that are not resolvable from anywhere in this repository. Each test
// uses its own, since module resolution results are cached between tests.
const appPackageName = 'resolve-app-package-path-test-app';
const missingAppPackageName = 'resolve-app-package-path-missing-app';

describe('resolveAppPackagePath', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('prefers the regular package path resolution', () => {
    const override = overridePackagePathResolution({
      packageName: appPackageName,
      path: '/mocked/app',
    });
    try {
      expect(resolveAppPackagePath(appPackageName, 'dist')).toBe(
        '/mocked/app/dist',
      );
    } finally {
      override.restore();
    }
  });

  it('resolves the app package from the backend package when it is not visible from the root', () => {
    mockDir.setContent({
      'packages/backend/node_modules': {
        [appPackageName]: {
          'package.json': JSON.stringify({ name: appPackageName }),
        },
      },
    });
    jest
      .spyOn(process, 'cwd')
      .mockReturnValue(mockDir.resolve('packages/backend'));

    expect(resolveAppPackagePath(appPackageName, 'dist')).toBe(
      resolvePath(
        realpathSync(mockDir.path),
        `packages/backend/node_modules/${appPackageName}/dist`,
      ),
    );
  });

  it('throws the original error when the app package cannot be found anywhere', () => {
    mockDir.setContent({ 'packages/backend/package.json': '{}' });
    jest
      .spyOn(process, 'cwd')
      .mockReturnValue(mockDir.resolve('packages/backend'));

    expect(() => resolveAppPackagePath(missingAppPackageName, 'dist')).toThrow(
      expect.objectContaining({
        code: 'MODULE_NOT_FOUND',
        message: expect.stringContaining(missingAppPackageName),
      }),
    );
  });

  it('does not retry when the regular resolution fails for another reason', () => {
    const override = overridePackagePathResolution({
      packageName: appPackageName,
      paths: {
        dist: () => {
          throw new Error('Unexpected failure');
        },
      },
    });
    const cwdSpy = jest.spyOn(process, 'cwd');
    try {
      expect(() => resolveAppPackagePath(appPackageName, 'dist')).toThrow(
        'Unexpected failure',
      );
      expect(cwdSpy).not.toHaveBeenCalled();
    } finally {
      override.restore();
    }
  });
});

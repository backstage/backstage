/*
 * Copyright 2023 The Backstage Authors
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
import { resolve as resolvePath } from 'node:path';
import { PlaywrightTestConfig } from '@playwright/test';
import { getPackagesSync } from '@manypkg/get-packages';
import type { BackstagePackage } from '@backstage/cli-node';
import { resolvePackagePath } from '@backstage/backend-plugin-api';

const DEFAULT_STORAGE_STATE_PATH = '.auth/user.json';

/**
 * Generates a list of playwright projects by scanning the monorepo for packages with an `e2e-tests/` folder.
 *
 * @public
 *
 * @param options - Optional configuration for the generated Playwright projects.
 *   When provided, `options.channel` controls the browser channel used for tests.
 *   Valid values are listed in the [Playwright documentation](https://playwright.dev/docs/api/class-testoptions#test-options-channel).
 */
export function generateProjects(options?: {
  channel?: string;
}): PlaywrightTestConfig['projects'] {
  // TODO(Rugvip): Switch this over to use @backstage/cli-node once released, and support SINCE=origin/main
  const { root, packages } = getPackagesSync(process.cwd());
  const e2eTestPackages = [...(root ? [root] : []), ...packages].filter(pkg => {
    return fs.pathExistsSync(resolvePath(pkg.dir, 'e2e-tests'));
  }) as BackstagePackage[];

  return e2eTestPackages.map(pkg => ({
    name: pkg.packageJson.name,
    testDir: resolvePath(pkg.dir, 'e2e-tests'),
    use: {
      channel: options?.channel ?? 'chrome',
    },
  }));
}

/**
 * @public
 */
export interface AuthSetupOptions {
  /**
   * Path to store the authentication state file.
   * This file will be automatically created and shared across test projects.
   *
   * @defaultValue '.auth/user.json'
   */
  storageStatePath?: string;
  /**
   * Pattern to match setup test files. If not provided, uses the default
   * authentication setup file provided by this package.
   *
   * @example /.*\.setup\.ts/
   */
  setupTestMatch?: string | RegExp;
}

/**
 * Generates a list of playwright projects with automatic authentication setup.
 *
 * This function scans the monorepo for packages with `e2e-tests/` folders and configures
 * them to use shared authentication state. Authentication is handled automatically using
 * a default guest authentication setup.
 *
 * @param options - Configuration options including storage state path
 * @returns Array of Playwright project configurations with auth dependencies
 *
 * @example
 * Basic usage with default auth:
 * ```ts
 * // playwright.config.ts
 * export default defineConfig({
 *   projects: generateProjectsWithAuthSetup(),
 * });
 * ```
 *
 * @public
 */
export function generateProjectsWithAuthSetup(
  options: AuthSetupOptions = {},
): PlaywrightTestConfig['projects'] {
  const { storageStatePath = DEFAULT_STORAGE_STATE_PATH, setupTestMatch } =
    options;
  const baseProjects = generateProjects();

  // Use the default auth setup file provided by this package if no custom pattern is provided
  const defaultAuthSetupPath = resolvePackagePath(
    '@backstage/e2e-test-utils',
    'playwright/auth.setup.ts',
  );
  const testMatch = setupTestMatch ?? defaultAuthSetupPath;

  return [
    {
      name: 'setup',
      testMatch,
    },
    ...(baseProjects ?? []).map(project => ({
      ...project,
      use: {
        ...project.use,
        channel: process.env.CI ? undefined : 'chrome', // Avoid specifying channel in CI to use default one
        storageState: storageStatePath,
      },
      dependencies: ['setup'],
    })),
  ];
}

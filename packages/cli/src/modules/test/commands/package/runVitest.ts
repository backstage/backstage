/*
 * Copyright 2025 The Backstage Authors
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

import { paths } from '../../../../lib/paths';

const FRONTEND_ROLES = [
  'frontend',
  'web-library',
  'common-library',
  'frontend-plugin',
  'frontend-plugin-module',
];

export async function runVitest(args: string[]): Promise<void> {
  // Check if vitest is installed
  try {
    require.resolve('vitest');
  } catch {
    console.error(
      [
        'Vitest is not installed.',
        '',
        'To use --experimental-vitest, add vitest to your workspace root:',
        '  yarn add -D vitest',
      ].join('\n'),
    );
    process.exit(1);
  }

  // Set up environment
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'test';
  }
  if (!process.env.TZ) {
    process.env.TZ = 'UTC';
  }

  // Determine environment based on package role
  const pkgJsonPath = paths.resolveTarget('package.json');
  const pkgJson = require(pkgJsonPath);
  const role = pkgJson.backstage?.role;
  const environment = FRONTEND_ROLES.includes(role) ? 'jsdom' : 'node';

  // Build vitest config
  const vitestConfig = {
    root: paths.targetDir,
    include: ['src/**/*.test.{ts,tsx,js,jsx}'],
    globals: true,
    environment,
    passWithNoTests: true,
    // Setup file that provides Jest compatibility (jest global as alias for vi)
    setupFiles: [paths.resolveOwn('config/vitestSetup.js')],
  };

  // Filter out args that don't apply to vitest
  const vitestArgs = args.filter(arg => arg !== '--experimental-vitest');

  // Check for watch mode - vitest defaults to watch in non-CI
  const hasWatchFlag = vitestArgs.some(
    arg =>
      arg === '--watch' || arg === '--no-watch' || arg.startsWith('--watch='),
  );

  if (!hasWatchFlag && process.env.CI) {
    vitestArgs.push('--run'); // --run disables watch mode in vitest
  }

  // Import and run vitest
  const { startVitest } = await import('vitest/node');

  const vitest = await startVitest('test', vitestArgs, {
    ...vitestConfig,
  });

  if (vitest) {
    await vitest.close();
  }
}

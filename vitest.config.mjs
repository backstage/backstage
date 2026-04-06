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

import { defineConfig } from 'vitest/config';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const SRC_EXTS = 'ts,js,tsx,jsx,mts,cts,mjs,cjs';

const FRONTEND_ROLES = new Set([
  'frontend',
  'web-library',
  'common-library',
  'frontend-plugin',
  'frontend-plugin-module',
]);

function resolveSetupFiles(targetPath, role) {
  const setupFiles = [];
  try {
    setupFiles.push(
      require.resolve(
        '@backstage/cli-module-vitest/config/vitestJestCompat.js',
      ),
    );
  } catch {
    /* not available */
  }
  const rootPkg = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'),
  );
  if (rootPkg.jest?.rejectFrontendNetworkRequests && FRONTEND_ROLES.has(role)) {
    try {
      setupFiles.push(
        require.resolve(
          '@backstage/cli-module-vitest/config/vitestRejectNetworkRequests.js',
        ),
      );
    } catch {
      /* not available */
    }
  }
  for (const ext of SRC_EXTS.split(',')) {
    const setup = path.resolve(targetPath, `src/setupTests.${ext}`);
    if (fs.existsSync(setup)) {
      setupFiles.push(setup);
      break;
    }
  }
  return setupFiles;
}

async function getProjects() {
  const rootPkg = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'),
  );
  const ws = rootPkg.workspaces;
  const patterns = Array.isArray(ws) ? ws : ws?.packages ?? [];

  const dirs = (
    await Promise.all(
      patterns.map(p =>
        glob(path.join(__dirname, p), { windowsPathsNoEscape: true }),
      ),
    )
  ).flat();

  const projects = [];
  for (const dir of dirs) {
    const pkgPath = path.resolve(dir, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      continue;
    }
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const testScript = pkg.scripts?.test;
    if (
      !testScript?.includes('backstage-cli test') &&
      !testScript?.includes('backstage-cli package test')
    ) {
      continue;
    }
    const role = pkg.backstage?.role ?? 'node-library';
    const environment = FRONTEND_ROLES.has(role) ? 'jsdom' : 'node';
    projects.push({
      test: {
        name: pkg.name,
        root: path.resolve(dir, 'src'),
        globals: true,
        environment,
        include: [`**/*.test.{${SRC_EXTS}}`],
        css: { modules: { classNameStrategy: 'non-scoped' } },
        setupFiles: resolveSetupFiles(dir, role),
      },
    });
  }
  return projects;
}

export default defineConfig(async () => ({
  test: {
    coverage: {
      provider: 'v8',
      include: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
      exclude: ['**/*.d.ts'],
    },
    projects: await getProjects(),
  },
}));

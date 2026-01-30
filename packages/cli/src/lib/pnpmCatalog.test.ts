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

import { createMockDirectory } from '@backstage/backend-test-utils';
import fs from 'fs-extra';
import {
  getHasPnpm,
  updatePnpmCatalog,
  getPnpmCatalogPackages,
} from './pnpmCatalog';
import { ReleaseManifest } from '@backstage/release-manifests';

const mockDir = createMockDirectory();

jest.mock('./paths', () => ({
  paths: {
    resolveTargetRoot(filename: string) {
      return mockDir.resolve(filename);
    },
  },
}));

describe('getHasPnpm', () => {
  beforeEach(() => {
    mockDir.clear();
  });

  it('should return false when no pnpm files exist', () => {
    mockDir.setContent({});

    const result = getHasPnpm();
    expect(result).toBe(false);
  });

  it('should return true when pnpm-workspace.yaml exists', () => {
    mockDir.setContent({
      'pnpm-workspace.yaml': 'packages:\n  - "packages/*"',
    });

    const result = getHasPnpm();
    expect(result).toBe(true);
  });

  it('should return true when pnpm-lock.yaml exists', () => {
    mockDir.setContent({
      'pnpm-lock.yaml': 'lockfileVersion: 9.0',
    });

    const result = getHasPnpm();
    expect(result).toBe(true);
  });

  it('should return true when both files exist', () => {
    mockDir.setContent({
      'pnpm-workspace.yaml': 'packages:\n  - "packages/*"',
      'pnpm-lock.yaml': 'lockfileVersion: 9.0',
    });

    const result = getHasPnpm();
    expect(result).toBe(true);
  });
});

describe('updatePnpmCatalog', () => {
  beforeEach(() => {
    mockDir.clear();
  });

  const createManifest = (
    packages: Array<{ name: string; version: string }>,
  ): ReleaseManifest => ({
    releaseVersion: '1.0.0',
    packages,
  });

  it('should create catalog when pnpm-workspace.yaml does not exist', async () => {
    mockDir.setContent({});

    const manifest = createManifest([
      { name: '@backstage/core-plugin-api', version: '1.10.0' },
    ]);

    const result = await updatePnpmCatalog(
      manifest,
      new Set(['@backstage/core-plugin-api']),
    );

    expect(result).toBe(true);
    const content = await fs.readFile(
      mockDir.resolve('pnpm-workspace.yaml'),
      'utf-8',
    );
    expect(content).toContain('@backstage/core-plugin-api');
    expect(content).toContain('^1.10.0');
  });

  it('should update existing catalog entries', async () => {
    mockDir.setContent({
      'pnpm-workspace.yaml': `packages:
  - "packages/*"
catalog:
  "@backstage/core-plugin-api": "^1.9.0"
`,
    });

    const manifest = createManifest([
      { name: '@backstage/core-plugin-api', version: '1.10.0' },
    ]);

    const result = await updatePnpmCatalog(manifest, new Set());

    expect(result).toBe(true);
    const content = await fs.readFile(
      mockDir.resolve('pnpm-workspace.yaml'),
      'utf-8',
    );
    expect(content).toContain('^1.10.0');
    expect(content).not.toContain('^1.9.0');
  });

  it('should add new packages that are used in the workspace', async () => {
    mockDir.setContent({
      'pnpm-workspace.yaml': `packages:
  - "packages/*"
catalog:
  "@backstage/core-plugin-api": "^1.10.0"
`,
    });

    const manifest = createManifest([
      { name: '@backstage/core-plugin-api', version: '1.10.0' },
      { name: '@backstage/backend-plugin-api', version: '1.1.0' },
    ]);

    const result = await updatePnpmCatalog(
      manifest,
      new Set(['@backstage/backend-plugin-api']),
    );

    expect(result).toBe(true);
    const content = await fs.readFile(
      mockDir.resolve('pnpm-workspace.yaml'),
      'utf-8',
    );
    expect(content).toContain('@backstage/core-plugin-api');
    expect(content).toContain('@backstage/backend-plugin-api');
    expect(content).toContain('^1.1.0');
  });

  it('should preserve non-Backstage packages in catalog', async () => {
    mockDir.setContent({
      'pnpm-workspace.yaml': `packages:
  - "packages/*"
catalog:
  "@backstage/core-plugin-api": "^1.9.0"
  "react": "^18.0.0"
`,
    });

    const manifest = createManifest([
      { name: '@backstage/core-plugin-api', version: '1.10.0' },
    ]);

    const result = await updatePnpmCatalog(manifest, new Set());

    expect(result).toBe(true);
    const content = await fs.readFile(
      mockDir.resolve('pnpm-workspace.yaml'),
      'utf-8',
    );
    expect(content).toContain('react');
    expect(content).toContain('^18.0.0');
  });

  it('should return false when no changes are needed', async () => {
    mockDir.setContent({
      'pnpm-workspace.yaml': `packages:
  - "packages/*"
catalog:
  "@backstage/core-plugin-api": "^1.10.0"
`,
    });

    const manifest = createManifest([
      { name: '@backstage/core-plugin-api', version: '1.10.0' },
    ]);

    const result = await updatePnpmCatalog(manifest, new Set());

    expect(result).toBe(false);
  });

  it('should sort catalog entries alphabetically', async () => {
    mockDir.setContent({
      'pnpm-workspace.yaml': `packages:
  - "packages/*"
`,
    });

    const manifest = createManifest([
      { name: '@backstage/plugin-catalog', version: '1.0.0' },
      { name: '@backstage/backend-plugin-api', version: '1.0.0' },
      { name: '@backstage/core-plugin-api', version: '1.0.0' },
    ]);

    const result = await updatePnpmCatalog(
      manifest,
      new Set([
        '@backstage/plugin-catalog',
        '@backstage/backend-plugin-api',
        '@backstage/core-plugin-api',
      ]),
    );

    expect(result).toBe(true);
    const content = await fs.readFile(
      mockDir.resolve('pnpm-workspace.yaml'),
      'utf-8',
    );

    // Check that packages are in alphabetical order
    const backendIndex = content.indexOf('@backstage/backend-plugin-api');
    const coreIndex = content.indexOf('@backstage/core-plugin-api');
    const catalogIndex = content.indexOf('@backstage/plugin-catalog');

    expect(backendIndex).toBeLessThan(coreIndex);
    expect(coreIndex).toBeLessThan(catalogIndex);
  });

  it('should preserve other fields in pnpm-workspace.yaml', async () => {
    mockDir.setContent({
      'pnpm-workspace.yaml': `packages:
  - "packages/*"
  - "plugins/*"
catalog:
  "@backstage/core-plugin-api": "^1.9.0"
`,
    });

    const manifest = createManifest([
      { name: '@backstage/core-plugin-api', version: '1.10.0' },
    ]);

    const result = await updatePnpmCatalog(manifest, new Set());

    expect(result).toBe(true);
    const content = await fs.readFile(
      mockDir.resolve('pnpm-workspace.yaml'),
      'utf-8',
    );
    expect(content).toContain('packages/*');
    expect(content).toContain('plugins/*');
  });
});

describe('getPnpmCatalogPackages', () => {
  beforeEach(() => {
    mockDir.clear();
  });

  it('should return empty set when no catalog exists', async () => {
    mockDir.setContent({
      'pnpm-workspace.yaml': `packages:
  - "packages/*"
`,
    });

    const result = await getPnpmCatalogPackages();
    expect(result.size).toBe(0);
  });

  it('should return empty set when file does not exist', async () => {
    mockDir.setContent({});

    const result = await getPnpmCatalogPackages();
    expect(result.size).toBe(0);
  });

  it('should return package names from catalog', async () => {
    mockDir.setContent({
      'pnpm-workspace.yaml': `packages:
  - "packages/*"
catalog:
  "@backstage/core-plugin-api": "^1.10.0"
  "@backstage/backend-plugin-api": "^1.1.0"
`,
    });

    const result = await getPnpmCatalogPackages();
    expect(result.size).toBe(2);
    expect(result.has('@backstage/core-plugin-api')).toBe(true);
    expect(result.has('@backstage/backend-plugin-api')).toBe(true);
  });
});

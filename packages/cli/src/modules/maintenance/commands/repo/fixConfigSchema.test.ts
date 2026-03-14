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
import { BackstagePackageJson } from '@backstage/cli-node';
import { fixConfigSchema } from './fixConfigSchema';
import { FixablePackage } from './fix';

function createFixablePackage(
  dir: string,
  packageJson: Partial<BackstagePackageJson>,
): FixablePackage {
  return {
    dir,
    packageJson: {
      name: 'test-package',
      version: '0.0.0',
      ...packageJson,
    } as BackstagePackageJson,
    changed: false,
  };
}

describe('fixConfigSchema', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    mockDir.clear();
  });

  it('should do nothing if config.d.ts does not exist', () => {
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'test', version: '0.0.0' }),
    });

    const pkg = createFixablePackage(mockDir.path, {});
    fixConfigSchema(pkg);
    expect(pkg.changed).toBe(false);
  });

  it('should add configSchema and files entry when config.d.ts exists but is not referenced', () => {
    mockDir.setContent({
      'config.d.ts': 'export interface Config {}',
      'package.json': JSON.stringify({ name: 'test', version: '0.0.0' }),
    });

    const pkg = createFixablePackage(mockDir.path, {});
    fixConfigSchema(pkg);
    expect(pkg.changed).toBe(true);
    expect((pkg.packageJson as any).configSchema).toBe('config.d.ts');
    expect(pkg.packageJson.files).toContain('config.d.ts');
  });

  it('should add config.d.ts to files array when configSchema is correct but files is missing it', () => {
    mockDir.setContent({
      'config.d.ts': 'export interface Config {}',
      'package.json': JSON.stringify({
        name: 'test',
        version: '0.0.0',
        configSchema: 'config.d.ts',
        files: ['dist'],
      }),
    });

    const pkg = createFixablePackage(mockDir.path, {
      configSchema: 'config.d.ts',
      files: ['dist'],
    });
    fixConfigSchema(pkg);
    expect(pkg.changed).toBe(true);
    expect(pkg.packageJson.files).toContain('config.d.ts');
    expect(pkg.packageJson.files).toContain('dist');
  });

  it('should not mark changed if everything is already correct', () => {
    mockDir.setContent({
      'config.d.ts': 'export interface Config {}',
      'package.json': JSON.stringify({
        name: 'test',
        version: '0.0.0',
        configSchema: 'config.d.ts',
        files: ['dist', 'config.d.ts'],
      }),
    });

    const pkg = createFixablePackage(mockDir.path, {
      configSchema: 'config.d.ts',
      files: ['dist', 'config.d.ts'],
    });
    fixConfigSchema(pkg);
    expect(pkg.changed).toBe(false);
  });

  it('should skip validation when configSchema is an inline object', () => {
    mockDir.setContent({
      'config.d.ts': 'export interface Config {}',
      'package.json': JSON.stringify({
        name: 'test',
        version: '0.0.0',
        configSchema: { type: 'object' },
      }),
    });

    const pkg = createFixablePackage(mockDir.path, {
      configSchema: { type: 'object' } as any,
    });
    fixConfigSchema(pkg);
    expect(pkg.changed).toBe(false);
  });

  it('should fix configSchema when it points to a wrong path', () => {
    mockDir.setContent({
      'config.d.ts': 'export interface Config {}',
      'package.json': JSON.stringify({
        name: 'test',
        version: '0.0.0',
        configSchema: 'wrong-config.d.ts',
        files: ['dist'],
      }),
    });

    const pkg = createFixablePackage(mockDir.path, {
      configSchema: 'wrong-config.d.ts',
      files: ['dist'],
    });
    fixConfigSchema(pkg);
    expect(pkg.changed).toBe(true);
    expect((pkg.packageJson as any).configSchema).toBe('config.d.ts');
    expect(pkg.packageJson.files).toContain('config.d.ts');
  });
});

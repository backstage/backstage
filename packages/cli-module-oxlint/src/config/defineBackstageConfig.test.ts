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

import { defineBackstageConfig } from '../../config/defineBackstageConfig';

describe('defineBackstageConfig', () => {
  it('returns a valid config with all 7 Backstage rules enabled', async () => {
    const config = await defineBackstageConfig();

    expect(config.rules).toMatchObject({
      'backstage/no-forbidden-package-imports': 'error',
      'backstage/no-mixed-plugin-imports': 'error',
      'backstage/no-relative-monorepo-imports': 'error',
      'backstage/no-self-package-imports': 'error',
      'backstage/no-top-level-material-ui-4-imports': 'warn',
      'backstage/no-ui-css-imports-in-non-frontend': 'error',
      'backstage/no-undeclared-imports': 'error',
    });

    // Bundled plugin should be auto-included
    expect(config.jsPlugins).toBeDefined();
    expect(config.jsPlugins!.length).toBeGreaterThanOrEqual(1);
    expect(config.jsPlugins![0]).toMatch(/index\.js$/);

    expect(config.overrides).toEqual([]);
  });

  it('allows overriding base rules via rules option', async () => {
    const config = await defineBackstageConfig({
      rules: {
        'backstage/no-forbidden-package-imports': 'warn',
        'custom/my-rule': 'error',
      },
    });

    expect(config.rules!['backstage/no-forbidden-package-imports']).toBe(
      'warn',
    );
    expect(config.rules!['custom/my-rule']).toBe('error');
    expect(config.rules!['backstage/no-undeclared-imports']).toBe('error');
  });

  it('includes user jsPlugins after the bundled plugin', async () => {
    const config = await defineBackstageConfig({
      jsPlugins: ['./my-custom-plugin.js'],
    });

    expect(config.jsPlugins!.length).toBe(2);
    expect(config.jsPlugins![0]).toMatch(/index\.js$/);
    expect(config.jsPlugins![1]).toBe('./my-custom-plugin.js');
  });

  it('always includes the bundled plugin even when jsPlugins is empty', async () => {
    const config = await defineBackstageConfig({ jsPlugins: [] });
    expect(config.jsPlugins!.length).toBe(1);
    expect(config.jsPlugins![0]).toMatch(/index\.js$/);
  });

  it('includes ignorePatterns when provided', async () => {
    const config = await defineBackstageConfig({
      ignorePatterns: ['**/dist/**', '**/node_modules/**'],
    });

    expect(config.ignorePatterns).toEqual(['**/dist/**', '**/node_modules/**']);
  });

  it('passes through overrides directly', async () => {
    const userOverride = {
      files: ['**/*.stories.tsx'],
      rules: { 'no-console': 'off' as const },
    };

    const config = await defineBackstageConfig({
      overrides: [userOverride],
    });

    expect(config.overrides).toEqual([userOverride]);
  });

  it('supports all options simultaneously', async () => {
    const config = await defineBackstageConfig({
      jsPlugins: ['./my-plugin.js'],
      ignorePatterns: ['**/dist/**'],
      rules: { 'custom/extra': 'error' },
      overrides: [
        {
          files: ['**/*.test.ts'],
          rules: { 'no-console': 'off' },
        },
      ],
    });

    expect(config.jsPlugins!.length).toBe(2);
    expect(config.jsPlugins![0]).toMatch(/index\.js$/);
    expect(config.jsPlugins![1]).toBe('./my-plugin.js');
    expect(config.ignorePatterns).toEqual(['**/dist/**']);
    expect(config.rules!['backstage/no-undeclared-imports']).toBe('error');
    expect(config.rules!['custom/extra']).toBe('error');
    expect(config.overrides).toEqual([
      { files: ['**/*.test.ts'], rules: { 'no-console': 'off' } },
    ]);
  });
});

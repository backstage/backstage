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

import { join } from 'node:path';
import { resolveOxlintBin, resolveOxlintConfig } from '../../lib/oxlint';

describe('package lint command', () => {
  describe('resolveOxlintBin', () => {
    it('resolves to the oxlint binary', () => {
      const binPath = resolveOxlintBin();
      expect(binPath).toBeDefined();
      expect(binPath).toMatch(/oxlint/);
    });
  });

  describe('resolveOxlintConfig', () => {
    it('resolves the root config when starting from the repo root', () => {
      const configPath = resolveOxlintConfig();
      expect(configPath).toBeDefined();
      expect(configPath).toMatch(/oxlint\.config\.mts$/);
    });

    it('finds a per-package config before the root config', () => {
      const cliDir = join(process.cwd(), 'packages', 'cli');
      const configPath = resolveOxlintConfig(cliDir);
      expect(configPath).toBeDefined();
      expect(configPath).toMatch(/packages[\\/]cli[\\/]oxlint\.config\.mts$/);
    });

    it('walks up to the root config when no local config exists', () => {
      const appDir = join(process.cwd(), 'packages', 'app');
      const configPath = resolveOxlintConfig(appDir);
      expect(configPath).toBeDefined();
      // Should find the root config, not a per-package one
      expect(configPath).not.toContain('packages');
      expect(configPath).toMatch(/oxlint\.config\.mts$/);
    });
  });
});

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

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
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
    it('resolves the nearest config and falls back to a parent config', () => {
      const rootDir = mkdtempSync(join(tmpdir(), 'oxlint-config-hierarchy-'));
      const packageDir = join(rootDir, 'packages', 'example');
      const sourceDir = join(packageDir, 'src');
      const rootConfig = join(rootDir, '.oxlintrc.js');
      const packageConfig = join(packageDir, '.oxlintrc.js');
      try {
        mkdirSync(sourceDir, { recursive: true });
        writeFileSync(rootConfig, 'module.exports = {};');
        expect(resolveOxlintConfig(rootDir)).toBe(rootConfig);
        expect(resolveOxlintConfig(packageDir)).toBe(rootConfig);

        writeFileSync(packageConfig, 'module.exports = {};');
        expect(resolveOxlintConfig(packageDir)).toBe(packageConfig);
        expect(resolveOxlintConfig(sourceDir)).toBe(packageConfig);

        rmSync(packageConfig);
        expect(resolveOxlintConfig(sourceDir)).toBe(rootConfig);
      } finally {
        rmSync(rootDir, { recursive: true, force: true });
      }
    });

    it.each([
      '.oxlintrc.js',
      '.oxlintrc.json',
      '.oxlintrc.jsonc',
      'oxlint.config.ts',
      'oxlint.config.mts',
    ])('discovers %s for an explicit --config path', name => {
      const tempDir = mkdtempSync(join(tmpdir(), 'oxlint-config-discovery-'));
      try {
        writeFileSync(join(tempDir, name), '{}');
        expect(resolveOxlintConfig(tempDir)).toBe(join(tempDir, name));
      } finally {
        rmSync(tempDir, { recursive: true, force: true });
      }
    });

    it('rejects ambiguous configs in one directory', () => {
      const tempDir = mkdtempSync(join(tmpdir(), 'oxlint-config-ambiguous-'));
      try {
        writeFileSync(join(tempDir, '.oxlintrc.js'), 'module.exports = {};');
        writeFileSync(join(tempDir, 'oxlint.config.mts'), 'export default {};');
        expect(() => resolveOxlintConfig(tempDir)).toThrow(
          /Multiple Oxlint config files found.*\.oxlintrc\.js.*oxlint\.config\.mts/,
        );
      } finally {
        rmSync(tempDir, { recursive: true, force: true });
      }
    });
  });
});

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
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { tmpdir } from 'node:os';
import { resolve, join, dirname } from 'node:path';
import Module from 'node:module';

export const BACKEND_ROLES = new Set([
  'backend',
  'backend-plugin',
  'backend-plugin-module',
  'cli',
  'node-library',
]);

export const VALID_ENGINES = new Set(['eslint', 'oxlint']);

export function resolveOxlintBin(): string {
  let oxlintMain: string;
  try {
    oxlintMain = require.resolve('oxlint');
  } catch {
    throw new Error(
      "oxlint is not installed. Install it with 'yarn add --dev oxlint oxlint-tsgolint' or remove --engine oxlint from your lint scripts.",
    );
  }
  return resolve(dirname(oxlintMain), '../bin/oxlint');
}

export function resolveConfigDir(): string {
  // Use require.resolve to respect workspace resolution
  const configPath = require.resolve('@backstage/cli/config/oxlint.json');
  return dirname(configPath);
}

export function loadAndAdjustConfig(
  role: string | undefined,
  overrideConfigDir?: string,
): {
  config: Record<string, any>;
  configDir: string;
} {
  const configDir = overrideConfigDir ?? resolveConfigDir();
  const configPath = join(configDir, 'oxlint.json');
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));

  // Resolve JS plugin paths to absolute (they're relative to config dir)
  if (config.jsPlugins) {
    config.jsPlugins = config.jsPlugins.map((p: string) =>
      resolve(configDir, p),
    );
  }

  // Inject Node.js builtin modules into no-restricted-imports
  // (frontend needs these blocked, backend role adjustment strips them)
  const builtins: readonly string[] = Module.builtinModules;
  const restricted = config.rules?.['no-restricted-imports'];
  if (Array.isArray(restricted)) {
    const [severity, opts] = restricted;
    if (opts?.paths) {
      for (const mod of builtins) {
        if (!mod.startsWith('_')) {
          opts.paths.push(mod);
        }
      }
    }
    config.rules['no-restricted-imports'] = [severity, opts];
  }

  // Role-based adjustments
  config.rules = config.rules ?? {};
  if (role && BACKEND_ROLES.has(role)) {
    // Backend: allow console
    config.rules['eslint/no-console'] = 'off';
    // Backend: enable new-cap with capIsNew: false (Express Router)
    config.rules['eslint/new-cap'] = ['error', { capIsNew: false }];
    // Backend: enable backend-specific syntax rules
    config.rules['restricted-syntax/no-winston-default-import'] = 'error';
    config.rules['restricted-syntax/no-dirname-in-src'] = 'error';
    // Backend: remove Node.js builtin restrictions
    const restrictedImports = config.rules['no-restricted-imports'];
    if (Array.isArray(restrictedImports)) {
      const [sev, importOpts] = restrictedImports;
      if (importOpts?.paths) {
        importOpts.paths = importOpts.paths.filter(
          (p: string | { name: string }) => {
            const name = typeof p === 'string' ? p : p.name;
            return !name.startsWith('node:') && !builtins.includes(name);
          },
        );
      }
      config.rules['no-restricted-imports'] = [sev, importOpts];
    }
  }

  return { config, configDir };
}

export function mergeLocalOverrides(
  config: Record<string, any>,
  packageDir: string,
): Record<string, any> {
  const localPath = join(packageDir, '.oxlintrc.json');
  let content: string;
  try {
    content = readFileSync(localPath, 'utf-8');
  } catch {
    return config;
  }

  const local = JSON.parse(content);

  for (const key of Object.keys(local)) {
    if (
      (key === 'ignorePatterns' || key === 'overrides') &&
      Array.isArray(local[key])
    ) {
      config[key] = [...(config[key] ?? []), ...local[key]];
    } else if (
      typeof local[key] === 'object' &&
      local[key] !== null &&
      !Array.isArray(local[key]) &&
      typeof config[key] === 'object' &&
      config[key] !== null
    ) {
      config[key] = { ...config[key], ...local[key] };
    } else {
      config[key] = local[key];
    }
  }

  return config;
}

export function buildOxlintConfig(
  configDir: string,
  role: string | undefined,
  packageDir: string,
): string {
  const { config } = loadAndAdjustConfig(role, configDir);
  mergeLocalOverrides(config, packageDir);
  return JSON.stringify(config);
}

export function loadAndFinalizeConfig(
  role: string | undefined,
  packageDir: string,
): string {
  return buildOxlintConfig(resolveConfigDir(), role, packageDir);
}

export function writeTempConfig(configJson: string): string {
  const tmpDir = join(tmpdir(), 'backstage-oxlint');
  mkdirSync(tmpDir, { recursive: true });
  const tmpPath = join(tmpDir, `oxlint-${randomBytes(6).toString('hex')}.json`);
  writeFileSync(tmpPath, configJson);
  return tmpPath;
}

export function cleanupTempConfig(tmpPath: string): void {
  try {
    unlinkSync(tmpPath);
  } catch {
    /* ignore */
  }
}

export function isTypeAwareAvailable(): boolean {
  try {
    require.resolve('oxlint-tsgolint');
    return true;
  } catch {
    return false;
  }
}

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

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import type { PackageLintOptions } from './lint';

import {
  loadAndFinalizeConfig,
  resolveOxlintBin,
  writeTempConfig,
  cleanupTempConfig,
  isTypeAwareAvailable,
} from '../../lib/oxlintConfig';

export default async (opts: PackageLintOptions): Promise<boolean> => {
  const { fix, outputFile, maxWarnings, directories } = opts;
  const format = opts.format ?? 'default';

  const packageJsonPath = join(targetPaths.dir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const role: string | undefined = packageJson?.backstage?.role;

  const configJson = loadAndFinalizeConfig(role, targetPaths.dir);
  const tmpPath = writeTempConfig(configJson);

  try {
    const oxlintBin = resolveOxlintBin();

    const oxlintArgs = [oxlintBin, '--config', tmpPath];

    if (isTypeAwareAvailable()) {
      oxlintArgs.push('--type-aware', '--type-check');
    }

    if (fix) {
      oxlintArgs.push('--fix');
    }

    oxlintArgs.push('--format', format);

    if (maxWarnings !== undefined && maxWarnings !== '-1') {
      oxlintArgs.push('--max-warnings', maxWarnings);
    }

    if (directories.length) {
      oxlintArgs.push(...directories);
    } else {
      oxlintArgs.push('.');
    }

    if (outputFile) {
      const result = spawnSync(process.execPath, oxlintArgs, {
        cwd: targetPaths.dir,
        encoding: 'utf-8',
        stdio: ['inherit', 'pipe', 'inherit'],
        env: { ...process.env, NO_COLOR: '1' },
      });

      const output = result.stdout || '';
      if (output) {
        writeFileSync(targetPaths.resolve(outputFile), output);
      }

      return result.status === 0;
    }

    const result = spawnSync(process.execPath, oxlintArgs, {
      cwd: targetPaths.dir,
      stdio: 'inherit',
      env: {
        ...process.env,
        FORCE_COLOR: '1',
      },
    });

    return result.status === 0;
  } finally {
    cleanupTempConfig(tmpPath);
  }
};

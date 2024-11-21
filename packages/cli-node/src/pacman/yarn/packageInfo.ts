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
import { NotFoundError } from '@backstage/errors';
import { YarnVersion } from './types';
import { execFile } from '../../util';
import { PackageInfo } from '../PackageManager';

// Possible `yarn info` output
type YarnInfo = {
  type: 'inspect';
  data: PackageInfo | { type: string; data: unknown };
};

export async function fetchPackageInfo(
  name: string,
  yarnVersion: YarnVersion,
): Promise<PackageInfo> {
  const cmd = yarnVersion.codename === 'classic' ? ['info'] : ['npm', 'info'];
  try {
    const { stdout: output } = await execFile(
      'yarn',
      [...cmd, '--json', name],
      { shell: true },
    );

    if (!output) {
      throw new NotFoundError(
        `No package information found for package ${name}`,
      );
    }

    if (yarnVersion.codename === 'berry') {
      return JSON.parse(output) as PackageInfo;
    }

    const info = JSON.parse(output) as YarnInfo;
    if (info.type !== 'inspect') {
      throw new Error(`Received unknown yarn info for ${name}, ${output}`);
    }

    return info.data as PackageInfo;
  } catch (error) {
    if (yarnVersion.codename === 'classic') {
      throw error;
    }

    if (error?.stdout.includes('Response Code: 404')) {
      throw new NotFoundError(
        `No package information found for package ${name}`,
      );
    }

    throw error;
  }
}

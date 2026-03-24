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

import fs from 'fs-extra';
import { BACKSTAGE_JSON, targetPaths } from '@backstage/cli-common';

export interface VersionResult {
  version: string | null;
  error?: string;
}

/**
 * Detect the Backstage release version from backstage.json in the project root.
 */
export async function detectBackstageVersion(): Promise<VersionResult> {
  const backstageJsonPath = targetPaths.resolveRoot(BACKSTAGE_JSON);

  if (!(await fs.pathExists(backstageJsonPath))) {
    return {
      version: null,
      error: `${BACKSTAGE_JSON} not found. Use --release to specify a Backstage release version.`,
    };
  }

  try {
    const backstageJson = await fs.readJSON(backstageJsonPath);
    const version = backstageJson?.version;

    if (!version || typeof version !== 'string') {
      return {
        version: null,
        error: `No version field found in ${BACKSTAGE_JSON}. Use --release to specify a Backstage release version.`,
      };
    }

    return { version };
  } catch (error) {
    return {
      version: null,
      error: `Failed to read ${BACKSTAGE_JSON}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

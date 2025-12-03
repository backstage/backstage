/*
 * Copyright 2022 The Backstage Authors
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

import { CustomErrorBase } from '@backstage/errors';
import { BackendStartupResult } from './types';

function formatMessage(startupResult: BackendStartupResult): string {
  const parts: string[] = [
    'Backend startup failed due to the following errors:',
  ];
  const failures: string[] = [];

  for (const plugin of startupResult.plugins) {
    if (plugin.failure && !plugin.failure.allowed) {
      failures.push(
        `  Plugin '${plugin.pluginId}' startup failed; caused by ${plugin.failure.error}`,
      );
    }

    for (const mod of plugin.modules) {
      if (mod.failure && !mod.failure.allowed) {
        failures.push(
          `  Module '${mod.moduleId}' for plugin '${plugin.pluginId}' startup failed; caused by ${mod.failure.error}`,
        );
      }
    }
  }

  if (failures.length > 0) {
    parts.push(...failures);
  }

  return parts.join('\n');
}

/**
 * Error thrown when backend startup fails.
 * Includes detailed startup results for all plugins and modules.
 *
 * @public
 */
export class BackendStartupError extends CustomErrorBase {
  name = 'BackendStartupError' as const;

  /**
   * The startup results for all plugins and modules.
   */
  readonly #startupResult: BackendStartupResult;

  constructor(startupResult: BackendStartupResult) {
    super(formatMessage(startupResult));
    this.#startupResult = startupResult;
  }

  get result(): BackendStartupResult {
    return this.#startupResult;
  }
}

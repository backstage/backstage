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

import { RootLoggerService } from '@backstage/backend-plugin-api';

const LOGGER_INTERVAL_MAX = 60_000;

function joinIds(ids: Iterable<string>): string {
  return [...ids].map(id => `'${id}'`).join(', ');
}

export function createInitializationLogger(
  pluginIds: string[],
  rootLogger?: RootLoggerService,
): {
  onPluginStarted(pluginId: string): void;
  onPluginFailed(pluginId: string): void;
  onAllStarted(): void;
} {
  const logger = rootLogger?.child({ type: 'initialization' });
  const starting = new Set(pluginIds);
  const started = new Set<string>();

  logger?.info(`Plugin initialization started: ${joinIds(pluginIds)}`);

  const getInitStatus = () => {
    let status = '';
    if (started.size > 0) {
      status = `, newly initialized: ${joinIds(started)}`;
      started.clear();
    }
    if (starting.size > 0) {
      status += `, still initializing: ${joinIds(starting)}`;
    }
    return status;
  };

  // Periodically log the initialization status with a fibonacci backoff
  let interval = 1000;
  let prevInterval = 0;
  let timeout: NodeJS.Timeout | undefined;
  const onTimeout = () => {
    logger?.info(`Plugin initialization in progress${getInitStatus()}`);

    const nextInterval = Math.min(interval + prevInterval, LOGGER_INTERVAL_MAX);
    prevInterval = interval;
    interval = nextInterval;

    timeout = setTimeout(onTimeout, nextInterval);
  };
  timeout = setTimeout(onTimeout, interval);

  return {
    onPluginStarted(pluginId: string) {
      starting.delete(pluginId);
      started.add(pluginId);
    },
    onPluginFailed(pluginId: string) {
      starting.delete(pluginId);
      const status =
        starting.size > 0
          ? `, waiting for ${starting.size} other plugins to finish before shutting down the process`
          : '';
      logger?.error(
        `Plugin '${pluginId}' threw an error during startup${status}`,
      );
    },
    onAllStarted() {
      logger?.info(`Plugin initialization complete${getInitStatus()}`);

      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }
    },
  };
}

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

/**
 * Utility functions for creating consistent metric names across the Backstage backend.
 */

export interface MetricNameOptions {
  serviceName: string;
  scope: 'core' | 'plugin';
  pluginId?: string;
}

/**
 * Creates a prefixed metric name following Backstage conventions.
 *
 * @param baseName - The base metric name
 * @param options - Configuration for the metric name
 * @returns The fully qualified metric name
 */
export function createMetricName(
  baseName: string,
  options: MetricNameOptions,
): string {
  const { serviceName, scope, pluginId } = options;

  if (scope === 'plugin' && !pluginId) {
    throw new Error('Plugin ID is required for plugin-scoped metrics');
  }

  const scopePrefix = scope === 'plugin' ? `plugin.${pluginId}` : 'core';
  return `${serviceName}.${scopePrefix}.${baseName}`;
}

/**
 * Creates a metric name prefixer function for a specific service and scope.
 *
 * @param options - Configuration for the metric naming
 * @returns A function that prefixes metric names
 */
export function createMetricNamePrefixer(options: MetricNameOptions) {
  return (name: string): string => createMetricName(name, options);
}

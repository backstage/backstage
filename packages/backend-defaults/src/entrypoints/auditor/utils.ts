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

import type { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { z } from 'zod/v4';

const CONFIG_ROOT_KEY = 'backend.auditor';

const logLevel = z.enum(['debug', 'info', 'warn', 'error']);

const severityLogLevelMappingsSchema = z.object({
  low: logLevel.default('debug'),
  medium: logLevel.default('info'),
  high: logLevel.default('info'),
  critical: logLevel.default('info'),
});

type SeverityLogLevelMappings = z.infer<typeof severityLogLevelMappingsSchema>;

/**
 * Gets the `backend.auditor.severityLogLevelMappings` configuration.
 *
 * @param config - The root Backstage {@link @backstage/config#Config} object.
 * @returns The validated severity-to-log-level mappings.
 * @throws error - {@link @backstage/errors#InputError} if the mapping configuration is invalid.
 */
export function getSeverityLogLevelMappings(
  config: Config,
): SeverityLogLevelMappings {
  const auditorConfig = config.getOptionalConfig(CONFIG_ROOT_KEY);

  const input = {
    low: auditorConfig?.getOptionalString('severityLogLevelMappings.low'),
    medium: auditorConfig?.getOptionalString('severityLogLevelMappings.medium'),
    high: auditorConfig?.getOptionalString('severityLogLevelMappings.high'),
    critical: auditorConfig?.getOptionalString(
      'severityLogLevelMappings.critical',
    ),
  };

  const parsed = severityLogLevelMappingsSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const key = issue.path[0] as keyof typeof input;
    const receivedValue = input[key];
    throw new InputError(
      `The configuration value for '${CONFIG_ROOT_KEY}.severityLogLevelMappings.${key}' was given an invalid value: '${receivedValue}'. Expected one of the following valid values: '${logLevel.options.join(
        ', ',
      )}'.`,
    );
  }

  return parsed.data;
}

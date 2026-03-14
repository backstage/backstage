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
import { z } from 'zod/v3';
import { CONFIG_ROOT_KEY, severityLogLevelMappingsSchema } from './types';

/**
 * Gets the `backend.auditor.severityLogLevelMappings` configuration.
 *
 * @param config - The root Backstage {@link @backstage/config#Config} object.
 * @returns The validated severity-to-log-level mappings.
 * @throws error - {@link @backstage/errors#InputError} if the mapping configuration is invalid.
 */
export function getSeverityLogLevelMappings(config: Config) {
  const auditorConfig = config.getOptionalConfig(CONFIG_ROOT_KEY);

  const severityLogLevelMappings = {
    low:
      auditorConfig?.getOptionalString('severityLogLevelMappings.low') ??
      'debug',
    medium:
      auditorConfig?.getOptionalString('severityLogLevelMappings.medium') ??
      'info',
    high:
      auditorConfig?.getOptionalString('severityLogLevelMappings.high') ??
      'info',
    critical:
      auditorConfig?.getOptionalString('severityLogLevelMappings.critical') ??
      'info',
  } as Required<z.infer<typeof severityLogLevelMappingsSchema>>;

  const res = severityLogLevelMappingsSchema.safeParse(
    severityLogLevelMappings,
  );
  if (!res.success) {
    const key = res.error.issues.at(0)?.path.at(0) as string;
    const value = (
      res.error.issues.at(0) as unknown as Record<PropertyKey, unknown>
    ).received as string;
    const validKeys = (
      res.error.issues.at(0) as unknown as Record<PropertyKey, unknown>
    ).options as string[];
    throw new InputError(
      `The configuration value for 'backend.auditor.severityLogLevelMappings.${key}' was given an invalid value: '${value}'. Expected one of the following valid values: '${validKeys.join(
        ', ',
      )}'.`,
    );
  }

  return severityLogLevelMappings;
}

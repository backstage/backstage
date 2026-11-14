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

/**
 * The default value for {@link getMaxMetaStringLength}.
 */
export const DEFAULT_MAX_META_STRING_LENGTH = 4096;

/**
 * The default keys that are redacted from audit event metadata by
 * {@link getRedactMetaKeys}.
 */
export const DEFAULT_REDACT_META_KEYS = [
  'token',
  'password',
  'secret',
  'authorization',
  'cookie',
];

const logLevel = z.enum(['debug', 'info', 'warn', 'error']);

const severityLogLevelMappingsSchema = z.object({
  low: logLevel.default('debug'),
  medium: logLevel.default('info'),
  high: logLevel.default('info'),
  critical: logLevel.default('info'),
});

const maxMetaStringLength = z.number().int().gte(-1);

const probability = z.number().gte(0).lte(1);

const samplingSchema = z.object({
  low: probability.optional(),
  medium: probability.optional(),
  high: probability.optional(),
  // Silently dropping every critical audit event is a footgun, so a
  // probability of exactly zero is rejected for the critical severity.
  critical: probability
    .optional()
    .refine(value => value === undefined || value > 0),
});

export type SeverityLogLevelMappings = z.infer<
  typeof severityLogLevelMappingsSchema
>;

type Sampling = z.infer<typeof samplingSchema>;

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

/**
 * Gets the `backend.auditor.sanitizeRequestQuery` configuration.
 *
 * @param config - The root Backstage {@link @backstage/config#Config} object.
 * @returns Whether query strings are stripped from request URLs before
 *          emitting audit events. Defaults to `true`.
 */
export function getSanitizeRequestQuery(config: Config): boolean {
  return (
    config
      .getOptionalConfig(CONFIG_ROOT_KEY)
      ?.getOptionalBoolean('sanitizeRequestQuery') ?? true
  );
}

/**
 * Gets the `backend.auditor.maxMetaStringLength` configuration.
 *
 * @param config - The root Backstage {@link @backstage/config#Config} object.
 * @returns The maximum length of strings in audit event metadata, where `-1`
 *          disables truncation. Defaults to `4096`.
 * @throws error - {@link @backstage/errors#InputError} if the configuration
 *                 value is invalid.
 */
export function getMaxMetaStringLength(config: Config): number {
  const receivedValue = config
    .getOptionalConfig(CONFIG_ROOT_KEY)
    ?.getOptionalNumber('maxMetaStringLength');

  const parsed = maxMetaStringLength.safeParse(
    receivedValue ?? DEFAULT_MAX_META_STRING_LENGTH,
  );

  if (!parsed.success) {
    throw new InputError(
      `The configuration value for '${CONFIG_ROOT_KEY}.maxMetaStringLength' was given an invalid value: '${receivedValue}'. Expected an integer greater than or equal to -1, where -1 disables truncation.`,
    );
  }

  return parsed.data;
}

/**
 * Gets the `backend.auditor.redactMetaKeys` configuration.
 *
 * @param config - The root Backstage {@link @backstage/config#Config} object.
 * @returns The metadata keys whose values are redacted before emitting audit
 *          events. Configured keys extend the default denylist, and an empty
 *          array disables redaction entirely. Defaults to
 *          `['token', 'password', 'secret', 'authorization', 'cookie']`.
 */
export function getRedactMetaKeys(config: Config): string[] {
  const keys = config
    .getOptionalConfig(CONFIG_ROOT_KEY)
    ?.getOptionalStringArray('redactMetaKeys');

  if (keys === undefined) {
    return DEFAULT_REDACT_META_KEYS;
  }
  if (keys.length === 0) {
    return [];
  }
  return [...DEFAULT_REDACT_META_KEYS, ...keys];
}

/**
 * Gets the `backend.auditor.sampling` configuration.
 *
 * @param config - The root Backstage {@link @backstage/config#Config} object.
 * @returns The optional sampling probability (a number between 0 and 1) per
 *          severity level. Severity levels without a probability are always
 *          emitted.
 * @throws error - {@link @backstage/errors#InputError} if a sampling
 *                 probability is invalid.
 */
export function getAuditorSampling(config: Config): Sampling {
  const auditorConfig = config.getOptionalConfig(CONFIG_ROOT_KEY);

  const input = {
    low: auditorConfig?.getOptionalNumber('sampling.low'),
    medium: auditorConfig?.getOptionalNumber('sampling.medium'),
    high: auditorConfig?.getOptionalNumber('sampling.high'),
    critical: auditorConfig?.getOptionalNumber('sampling.critical'),
  };

  const parsed = samplingSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const key = issue.path[0] as keyof typeof input;
    throw new InputError(
      `The configuration value for '${CONFIG_ROOT_KEY}.sampling.${key}' was given an invalid value: '${
        input[key]
      }'. Expected a number between 0 and 1${
        key === 'critical' ? ', and greater than 0 for critical events' : ''
      }.`,
    );
  }

  return parsed.data;
}

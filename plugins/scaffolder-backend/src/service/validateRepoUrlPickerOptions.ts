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

import { ScmIntegrationRegistry } from '@backstage/integration';
import { parseRepoUrl } from '@backstage/plugin-scaffolder-node';

/**
 * Errors produced by {@link validateRepoUrlPickerOptions}. The shape mirrors
 * the `ValidationError` declared in the scaffolder OpenAPI schema so that
 * the existing `{ errors: [...] }` 400 response envelope can be reused.
 */
export type RepoUrlPickerValidationError = {
  path: Array<string | number>;
  property: string;
  message: string;
  schema: Record<string, unknown>;
  instance: Record<string, unknown>;
  name: string;
  argument: string | number | boolean | Record<string, unknown>;
  stack: string;
};

type JsonRecord = { [key: string]: unknown };

const REPO_URL_PICKER_FIELD = 'RepoUrlPicker';

const ALLOWED_OPTION_TO_PARSED_FIELD = {
  allowedHosts: 'host',
  allowedOwners: 'owner',
  allowedRepos: 'repo',
  allowedOrganizations: 'organization',
  allowedProjects: 'project',
} as const;

type AllowedOption = keyof typeof ALLOWED_OPTION_TO_PARSED_FIELD;

const ALLOWED_OPTIONS: AllowedOption[] = Object.keys(
  ALLOWED_OPTION_TO_PARSED_FIELD,
) as AllowedOption[];

/**
 * Server-side enforcement of `RepoUrlPicker` `ui:options` allowlists declared
 * in a template's `spec.parameters` JSON Schema.
 *
 * These constraints (`allowedHosts`, `allowedOwners`, `allowedRepos`,
 * `allowedOrganizations`, `allowedProjects`) are filtered into UI controls by
 * the React `RepoUrlPicker` field extension, but the standard JSON Schema
 * validator the scaffolder backend runs against incoming `values` ignores
 * them. Without this check, a caller that posts directly to
 * `POST /api/scaffolder/v2/tasks` can submit any `repoUrl` they want and the
 * backend will execute the template's actions against it using its configured
 * SCM integration credentials.
 *
 * @param values - The submitted form values (the `values` field of the
 *   `POST /v2/tasks` request body).
 * @param parameters - One of the entries in `template.spec.parameters` — i.e.
 *   either a single schema object or one wizard step's schema.
 * @param integrations - The plugin's SCM integration registry, used to parse
 *   `repoUrl` strings into `{ host, owner, repo, ... }` the same way the
 *   downstream actions will.
 *
 * @returns The list of validation errors, one per disallowed value. Empty
 *   when the values comply with the template's declared allowlists (or when
 *   the template does not use `RepoUrlPicker`).
 */
export function validateRepoUrlPickerOptions(
  values: unknown,
  parameters: unknown,
  integrations: ScmIntegrationRegistry,
): RepoUrlPickerValidationError[] {
  if (!isJsonRecord(values) || !isJsonRecord(parameters)) {
    return [];
  }
  const errors: RepoUrlPickerValidationError[] = [];
  walkSchema(parameters, values, 'instance', integrations, errors);
  return errors;
}

function walkSchema(
  schema: JsonRecord,
  value: unknown,
  path: string,
  integrations: ScmIntegrationRegistry,
  errors: RepoUrlPickerValidationError[],
): void {
  // Composition keywords - walk each sub-schema against the same value.
  for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
    const subs = schema[key];
    if (Array.isArray(subs)) {
      for (const sub of subs) {
        if (isJsonRecord(sub)) {
          walkSchema(sub, value, path, integrations, errors);
        }
      }
    }
  }

  if (
    schema['ui:field'] === REPO_URL_PICKER_FIELD &&
    typeof value === 'string'
  ) {
    validateRepoUrlValue(
      value,
      schema['ui:options'],
      path,
      integrations,
      errors,
    );
    // A RepoUrlPicker terminal field is always a string; no need to recurse.
    return;
  }

  const properties = schema.properties;
  if (isJsonRecord(properties) && isJsonRecord(value)) {
    for (const [propName, propSchema] of Object.entries(properties)) {
      if (!isJsonRecord(propSchema)) {
        continue;
      }
      if (Object.prototype.hasOwnProperty.call(value, propName)) {
        walkSchema(
          propSchema,
          value[propName],
          `${path}.${propName}`,
          integrations,
          errors,
        );
      }
    }
  }
}

function validateRepoUrlValue(
  value: string,
  rawOptions: unknown,
  path: string,
  integrations: ScmIntegrationRegistry,
  errors: RepoUrlPickerValidationError[],
): void {
  // No allowlist on the field means nothing to enforce.
  const options = isJsonRecord(rawOptions) ? rawOptions : {};
  const allowlists: Partial<Record<AllowedOption, string[]>> = {};
  let hasAnyAllowlist = false;
  for (const option of ALLOWED_OPTIONS) {
    const entries = options[option];
    if (Array.isArray(entries) && entries.length > 0) {
      const stringEntries = entries.filter(
        (e): e is string => typeof e === 'string',
      );
      if (stringEntries.length > 0) {
        allowlists[option] = stringEntries;
        hasAnyAllowlist = true;
      }
    }
  }
  if (!hasAnyAllowlist) {
    return;
  }

  let parsed: ReturnType<typeof parseRepoUrl>;
  try {
    parsed = parseRepoUrl(value, integrations);
  } catch (err) {
    // Surface the parse error against this field rather than 500ing the
    // request - the JSON Schema validator only enforces `type: string`, so a
    // malformed value can legitimately reach this point.
    const message = `is not a valid repository URL: ${
      err instanceof Error ? err.message : String(err)
    }`;
    errors.push(
      buildError({
        path,
        message,
        name: 'repoUrl',
        argument: value,
      }),
    );
    return;
  }

  for (const option of ALLOWED_OPTIONS) {
    const allowed = allowlists[option];
    if (!allowed) {
      continue;
    }
    const parsedField = ALLOWED_OPTION_TO_PARSED_FIELD[option];
    const actual = parsed[parsedField];
    // Skip fields the picker didn't fill in for this integration type - if
    // the value is required for the downstream action, parseRepoUrl will
    // have already thrown above.
    if (actual === undefined || actual === '') {
      continue;
    }
    if (!allowed.includes(actual)) {
      const message =
        `${parsedField} '${actual}' is not in the allowed list for this ` +
        `field (${option}: ${JSON.stringify(allowed)}). The template ` +
        'restricts which values may be submitted for this RepoUrlPicker.';
      errors.push(
        buildError({
          path,
          message,
          name: option,
          argument: allowed,
        }),
      );
    }
  }
}

function buildError(args: {
  path: string;
  message: string;
  name: string;
  argument: unknown;
}): RepoUrlPickerValidationError {
  const { path, message, name, argument } = args;
  // The scaffolder OpenAPI ValidationError schema requires `argument` to be
  // one of boolean / number / object / string - never an array - so wrap
  // arrays in a `{ allowed: [...] }` object for transport.
  const normalisedArgument: RepoUrlPickerValidationError['argument'] =
    Array.isArray(argument)
      ? { allowed: argument }
      : (argument as RepoUrlPickerValidationError['argument']);
  return {
    path: [],
    property: path,
    message,
    schema: {},
    instance: {},
    name,
    argument: normalisedArgument,
    stack: `${path} ${message}`,
  };
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

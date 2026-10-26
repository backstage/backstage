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

import { InputError } from '@backstage/errors';
import { isPromise } from '@internal/backend';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { z } from 'zod/v3';
import zodToJsonSchema from 'zod-to-json-schema';

type RuleWithParamsSchema = {
  name: string;
  paramsSchema?: unknown;
};

type StandardSchemaWithJsonSchemaInput = StandardSchemaV1 & {
  '~standard': {
    jsonSchema: {
      input(options: { target: 'draft-07' }): Record<string, unknown>;
    };
  };
};

function supportsJsonSchema(
  schema: unknown,
): schema is StandardSchemaWithJsonSchemaInput {
  const standard = (schema as StandardSchemaV1 | undefined)?.[
    '~standard'
  ] as unknown as
    | {
        validate?: unknown;
        jsonSchema?: { input?: unknown };
      }
    | undefined;
  return (
    typeof standard?.validate === 'function' &&
    typeof standard.jsonSchema?.input === 'function'
  );
}

function isZodSchema(schema: unknown): schema is z.ZodSchema<any> {
  return (
    typeof schema === 'object' &&
    schema !== null &&
    '_def' in schema &&
    typeof (schema as { _parse?: unknown })._parse === 'function' &&
    typeof (schema as { safeParse?: unknown }).safeParse === 'function'
  );
}

/** Ensures that a rule parameter schema can be serialized as permission metadata. */
export function assertPermissionRuleParamsSchema(
  rule: RuleWithParamsSchema,
): void {
  if (
    rule.paramsSchema &&
    !supportsJsonSchema(rule.paramsSchema) &&
    !isZodSchema(rule.paramsSchema)
  ) {
    throw new Error(
      `Permission rule '${rule.name}' parameter schema does not support JSON Schema conversion`,
    );
  }
}

/**
 * Validates rule parameters using either the Standard Schema or legacy Zod schema.
 * Standard Schema validation must be synchronous because rule evaluation is synchronous.
 */
export function validatePermissionRuleParams(
  rule: RuleWithParamsSchema,
  params: unknown,
): void {
  if (supportsJsonSchema(rule.paramsSchema)) {
    const result = rule.paramsSchema['~standard'].validate(params);
    if (isPromise(result)) {
      throw new Error(
        `Permission rule '${rule.name}' parameter schema returned a Promise; async schemas are not supported`,
      );
    }
    if (result.issues) {
      throw new InputError(
        'Parameters to rule are invalid',
        new Error(result.issues.map(issue => issue.message).join('; ')),
      );
    }
    return;
  }

  if (isZodSchema(rule.paramsSchema)) {
    const result = rule.paramsSchema.safeParse(params);
    if (!result.success) {
      throw new InputError('Parameters to rule are invalid', result.error);
    }
  } else if (rule.paramsSchema) {
    assertPermissionRuleParamsSchema(rule);
  }
}

/** Converts a rule parameter schema to JSON Schema for permission metadata. */
export function permissionRuleParamsToJsonSchema(
  rule: RuleWithParamsSchema,
): ReturnType<typeof zodToJsonSchema> {
  if (supportsJsonSchema(rule.paramsSchema)) {
    return rule.paramsSchema['~standard'].jsonSchema.input({
      target: 'draft-07',
    }) as ReturnType<typeof zodToJsonSchema>;
  }

  if (isZodSchema(rule.paramsSchema)) {
    return zodToJsonSchema(rule.paramsSchema);
  }

  assertPermissionRuleParamsSchema(rule);
  return zodToJsonSchema(z.object({}));
}

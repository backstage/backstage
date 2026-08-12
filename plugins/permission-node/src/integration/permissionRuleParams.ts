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
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { z } from 'zod/v3';
import zodToJsonSchema from 'zod-to-json-schema';

type RuleWithParamsSchema = {
  name: string;
  params?: { schema: StandardSchemaV1 };
  paramsSchema?: z.ZodSchema<any>;
};

type StandardSchemaWithJsonSchemaInput = StandardSchemaV1 & {
  '~standard': {
    jsonSchema: {
      input(options: { target: 'draft-07' }): Record<string, unknown>;
    };
  };
};

function supportsJsonSchema(
  schema: StandardSchemaV1,
): schema is StandardSchemaWithJsonSchemaInput {
  const standard = schema['~standard'] as unknown as {
    jsonSchema?: { input?: unknown };
  };
  return typeof standard.jsonSchema?.input === 'function';
}

/** Ensures that a rule parameter schema can be serialized as permission metadata. */
export function assertPermissionRuleParamsSchema(
  rule: RuleWithParamsSchema,
): asserts rule is RuleWithParamsSchema & {
  params?: { schema: StandardSchemaWithJsonSchemaInput };
} {
  if (rule.params?.schema && !supportsJsonSchema(rule.params.schema)) {
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
  if (rule.params?.schema) {
    const result = rule.params.schema['~standard'].validate(params);
    if (result instanceof Promise) {
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

  const result = rule.paramsSchema?.safeParse(params);
  if (result && !result.success) {
    throw new InputError('Parameters to rule are invalid', result.error);
  }
}

/** Converts a rule parameter schema to JSON Schema for permission metadata. */
export function permissionRuleParamsToJsonSchema(
  rule: RuleWithParamsSchema,
): ReturnType<typeof zodToJsonSchema> {
  if (rule.params?.schema) {
    assertPermissionRuleParamsSchema(rule);
    return rule.params.schema['~standard'].jsonSchema.input({
      target: 'draft-07',
    }) as ReturnType<typeof zodToJsonSchema>;
  }

  return zodToJsonSchema(rule.paramsSchema ?? z.object({}));
}

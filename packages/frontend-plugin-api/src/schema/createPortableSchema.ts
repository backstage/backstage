/*
 * Copyright 2023 The Backstage Authors
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

import { JsonObject } from '@backstage/types';
import { z as zodV3, type ZodType } from 'zod/v3';
import zodToJsonSchema from 'zod-to-json-schema';
import { PortableSchema } from './types';

/**
 * The Standard Schema interface.
 * @public
 */
export type { StandardSchemaV1 } from '@standard-schema/spec';
import { type StandardSchemaV1 } from '@standard-schema/spec';

/** @internal */
export function createDeprecatedConfigSchema(
  fields: Record<string, (zImpl: typeof zodV3) => ZodType>,
): MergeablePortableSchema {
  const resolved: Record<string, ResolvedField> = {};

  for (const [key, field] of Object.entries(fields)) {
    resolved[key] = resolveZodField(key, field(zodV3));
  }

  return buildPortableSchema(resolved);
}

/**
 * Per-field resolved schema — validation is eager, JSON Schema is lazy.
 * @internal
 */
interface ResolvedField {
  validate(value: unknown): { value: unknown } | { errors: string[] };
  toJsonSchema(): JsonObject;
  required: boolean;
}

/**
 * Internal representation that carries per-field resolvers alongside the
 * public PortableSchema surface, enabling schema merging.
 * @internal
 */
export interface MergeablePortableSchema<TOutput = any, TInput = any>
  extends PortableSchema<TOutput, TInput> {
  /** @internal */
  readonly _fields: Record<string, ResolvedField>;
}

/**
 * Resolves each field, eagerly validates JSON Schema support, and returns
 * a PortableSchema whose JSON Schema conversion is lazy.
 * @internal
 */
export function createConfigSchema(
  fields: Record<string, StandardSchemaV1>,
): MergeablePortableSchema {
  const resolved: Record<string, ResolvedField> = {};

  for (const [key, field] of Object.entries(fields)) {
    resolved[key] = resolveField(key, field);
  }

  return buildPortableSchema(resolved);
}

/**
 * Combines schemas from different sources for blueprint + override
 * composition. Each source may use a completely different schema library.
 * Because we track per-field resolvers, merging is just combining the
 * field maps.
 * @internal
 */
export function mergePortableSchemas<A, B>(
  a: MergeablePortableSchema<A> | undefined,
  b: MergeablePortableSchema<B> | undefined,
): MergeablePortableSchema<A & B> | undefined {
  if (!a && !b) {
    return undefined;
  }
  if (!a) {
    return b as MergeablePortableSchema<A & B>;
  }
  if (!b) {
    return a as MergeablePortableSchema<A & B>;
  }

  return buildPortableSchema<A & B>({
    ...a._fields,
    ...b._fields,
  });
}

/**
 * Assembles resolved fields into a PortableSchema with per-field
 * validation (eager) and lazy JSON Schema generation.
 */
function buildPortableSchema<TOutput = unknown>(
  fields: Record<string, ResolvedField>,
): MergeablePortableSchema<TOutput> {
  function parse(input: unknown) {
    if (
      input !== undefined &&
      input !== null &&
      (typeof input !== 'object' || Array.isArray(input))
    ) {
      throw new Error(
        `Invalid config input, expected object but got ${
          Array.isArray(input) ? 'array' : typeof input
        }`,
      );
    }
    const inputObj = (input ?? {}) as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    const errors: string[] = [];

    for (const [key, field] of Object.entries(fields)) {
      const validated = field.validate(inputObj[key]);
      if ('errors' in validated) {
        errors.push(...validated.errors);
      } else if (validated.value !== undefined || key in inputObj) {
        result[key] = validated.value;
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }

    return result as TOutput;
  }

  let cached: { schema: JsonObject } | undefined;

  const result: MergeablePortableSchema<TOutput> = {
    parse,
    schema() {
      if (!cached) {
        cached = { schema: buildObjectJsonSchema(fields) };
      }
      return cached;
    },
  } as MergeablePortableSchema<TOutput>;

  Object.defineProperty(result, '_fields', {
    value: fields,
    enumerable: false,
  });

  return result;
}

/**
 * Wraps a single schema into a ResolvedField. Eagerly validates that
 * JSON Schema conversion will be possible, but defers the actual
 * conversion until toJsonSchema() is called.
 */
function resolveField(key: string, schema: unknown): ResolvedField {
  if (isZodV3Type(schema)) {
    throw new Error(
      `Config schema for field '${key}' uses a Zod v3 schema, which is ` +
        `not supported by the \`configSchema\` option. Upgrade to the ` +
        `\`zod\` v4 package (\`zod@^4.0.0\`). Note that the \`zod/v4\` ` +
        `subpath export from the zod v3 package is also not supported, ` +
        `as it does not include JSON Schema conversion.`,
    );
  }
  if (isStandardSchema(schema)) {
    if (!hasJsonSchemaConverter(schema)) {
      throw new Error(
        `Config schema for field '${key}' does not support JSON Schema ` +
          `conversion. Use a schema library that implements the Standard ` +
          `JSON Schema interface (like zod v4+).`,
      );
    }
    return resolveStandardField(key, schema);
  }
  throw new Error(
    `Config schema for field '${key}' is not a valid Standard Schema`,
  );
}

function resolveZodField(key: string, schema: ZodType): ResolvedField {
  const wrapper = zodV3.object({ [key]: schema });

  return {
    validate(value) {
      const result = wrapper.safeParse({ [key]: value });
      if (result.success) {
        return { value: result.data[key] };
      }
      return { errors: result.error.issues.map(formatZodIssue) };
    },
    toJsonSchema() {
      const wholeJsonSchema = zodToJsonSchema(wrapper) as Record<string, any>;
      return (wholeJsonSchema.properties?.[key] ?? {}) as JsonObject;
    },
    required: !schema.isOptional(),
  };
}

function resolveStandardField(
  key: string,
  schema: StandardSchemaV1 & {
    '~standard': { jsonSchema: { input: Function } };
  },
): ResolvedField {
  const required = isFieldRequired(schema);

  return {
    validate(value) {
      const result = schema['~standard'].validate(value);
      if (result instanceof Promise) {
        throw new Error(
          `Config schema for '${key}' returned a Promise — async schemas are not supported`,
        );
      }
      if (result.issues) {
        return {
          errors: Array.from(result.issues).map(issue =>
            formatStandardIssue(key, issue),
          ),
        };
      }
      return { value: result.value };
    },
    toJsonSchema() {
      const raw = schema['~standard'].jsonSchema.input({ target: 'draft-07' });
      const { $schema: _, ...rest } = raw;
      return rest as JsonObject;
    },
    required,
  };
}

/** Assembles per-field JSON Schemas into a single object-level JSON Schema. */
function buildObjectJsonSchema(
  fields: Record<string, ResolvedField>,
): JsonObject {
  const properties: Record<string, JsonObject> = {};
  const required: string[] = [];

  for (const [key, field] of Object.entries(fields)) {
    properties[key] = field.toJsonSchema();
    if (field.required) {
      required.push(key);
    }
  }

  const schema: Record<string, unknown> = {
    type: 'object',
    properties,
    additionalProperties: false,
  };

  if (required.length > 0) {
    schema.required = required;
  }

  return schema as JsonObject;
}

function isZodV3Type(value: unknown): value is ZodType {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as any)._parse === 'function' &&
    '_def' in value
  );
}

function isStandardSchema(value: unknown): value is StandardSchemaV1 {
  return (
    typeof value === 'object' &&
    value !== null &&
    '~standard' in value &&
    typeof (value as any)['~standard']?.validate === 'function'
  );
}

function hasJsonSchemaConverter(
  schema: StandardSchemaV1,
): schema is StandardSchemaV1 & {
  '~standard': { jsonSchema: { input: Function } };
} {
  const std = schema['~standard'] as any;
  return typeof std?.jsonSchema?.input === 'function';
}

function isFieldRequired(schema: StandardSchemaV1): boolean {
  const result = schema['~standard'].validate(undefined);
  if (result instanceof Promise) {
    return true;
  }
  return (result.issues?.length ?? 0) > 0;
}

function formatZodIssue(issue: {
  code: string;
  message: string;
  path: Array<string | number>;
  unionErrors?: Array<{ issues: Array<any> }>;
}): string {
  if (issue.code === 'invalid_union' && issue.unionErrors?.[0]?.issues?.[0]) {
    return formatZodIssue(issue.unionErrors[0].issues[0]);
  }
  let message = issue.message;
  if (message === 'Required') {
    message = 'Missing required value';
  }
  if (issue.path.length) {
    message += ` at '${issue.path.join('.')}'`;
  }
  return message;
}

function formatStandardIssue(
  fieldKey: string,
  issue: StandardSchemaV1.Issue,
): string {
  let message = issue.message;
  if (message === 'Required') {
    message = 'Missing required value';
  }
  const path = issue.path?.length
    ? `${fieldKey}.${issue.path
        .map((p: PropertyKey | StandardSchemaV1.PathSegment) =>
          typeof p === 'object' ? p.key : p,
        )
        .join('.')}`
    : fieldKey;
  return `${message} at '${path}'`;
}

/** @internal */
export function warnConfigSchemaPropDeprecation(callSite: string) {
  // eslint-disable-next-line no-console
  console.warn(
    `DEPRECATION WARNING: The \`config.schema\` option for extension config is deprecated. ` +
      `Use the \`configSchema\` option instead with Standard Schema values, for example ` +
      `\`configSchema: { title: z.string() }\` using the \`zod\` v4 package ` +
      `(\`zod@^4.0.0\`). Declared at ${callSite}`,
  );
}

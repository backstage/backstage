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

import { OutputUnit, Schema, Validator } from '@cfworker/json-schema';
import draft07MetaSchema from '../../schema/meta/json-schema-draft-07.json';
import { SchemaEngine, SchemaValidationError } from './types';

// Keywords that cfworker reports a summary error for whenever one of their
// subschemas fails. These only repeat the more specific errors beneath them.
const SUMMARY_KEYWORDS = new Set([
  '$ref',
  'additionalItems',
  'additionalProperties',
  'allOf',
  'dependencies',
  'dependentSchemas',
  'items',
  'patternProperties',
  'prefixItems',
  'properties',
  'unevaluatedItems',
  'unevaluatedProperties',
]);

// Keywords whose errors only say that none of the alternatives matched. The
// errors from within the alternatives are usually more useful, so they are
// placed last, which also matches the order that ajv reports errors in.
const ALTERNATIVE_KEYWORDS = new Set(['anyOf', 'oneOf']);

function convertErrors(errors: OutputUnit[]): SchemaValidationError[] {
  // A `false` schema (such as `additionalProperties: false`) produces an error
  // for the subschema itself, beneath the error for the keyword that holds it.
  // The keyword error is the more descriptive one, so keep only that.
  const relevant = errors.filter(e => e.keyword !== 'false');

  return relevant
    .filter(
      error =>
        !SUMMARY_KEYWORDS.has(error.keyword) ||
        !relevant.some(other =>
          other.keywordLocation.startsWith(`${error.keywordLocation}/`),
        ),
    )
    .sort(
      (a, b) =>
        Number(ALTERNATIVE_KEYWORDS.has(a.keyword)) -
        Number(ALTERNATIVE_KEYWORDS.has(b.keyword)),
    )
    .map(error => ({
      instancePath: decodeURI(error.instanceLocation.replace(/^#/, '')),
      keyword: error.keyword,
      message: error.error,
    }));
}

function containsUndefined(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }
  if (typeof value === 'object' && value !== null) {
    for (const item of Object.values(value)) {
      if (containsUndefined(item)) {
        return true;
      }
    }
  }
  return false;
}

// The engine refuses to process `undefined` values, which can not be
// represented in JSON. Treat them the way ajv does: object properties that
// are `undefined` are considered absent, while `undefined` array items are
// invalid regardless of the schema. The paths of the latter are collected in
// `invalidPaths`.
function normalizeUndefined(
  value: unknown,
  path: string,
  invalidPaths: string[],
): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (item === undefined) {
        invalidPaths.push(`${path}/${index}`);
        return null;
      }
      return normalizeUndefined(item, `${path}/${index}`, invalidPaths);
    });
  }
  if (typeof value === 'object' && value !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      if (item !== undefined) {
        // Plain assignment would treat a `__proto__` key as a prototype change
        Object.defineProperty(result, key, {
          value: normalizeUndefined(
            item,
            `${path}/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`,
            invalidPaths,
          ),
          enumerable: true,
          writable: true,
          configurable: true,
        });
      }
    }
    return result;
  }
  return value;
}

/**
 * A schema engine based on `@cfworker/json-schema`, which interprets schemas
 * instead of generating code.
 */
export const cfworkerSchemaEngine: SchemaEngine = {
  compile({ schema, extraSchemas, allErrors }) {
    // The engine annotates schemas while resolving references, so we make
    // sure to not touch the originals
    const validator = new Validator(
      structuredClone(schema) as Schema,
      '7',
      !allErrors,
    );
    for (const extraSchema of extraSchemas) {
      const clone = structuredClone(extraSchema) as Schema;
      validator.addSchema(clone, clone.$id);
    }

    return data => {
      let input = data;
      if (containsUndefined(data)) {
        const invalidPaths = new Array<string>();
        input = normalizeUndefined(data, '', invalidPaths);
        if (invalidPaths.length) {
          return invalidPaths.map(instancePath => ({
            instancePath,
            keyword: 'type',
            message: 'Array items must not be undefined',
          }));
        }
      }

      let result;
      try {
        result = validator.validate(input);
      } catch (error) {
        // The engine throws for values that can not be represented in JSON,
        // such as functions; report those as a regular validation error
        return [
          {
            instancePath: '',
            keyword: 'type',
            message: error instanceof Error ? error.message : String(error),
          },
        ];
      }
      return result.valid ? undefined : convertErrors(result.errors);
    };
  },
};

let metaSchemaValidator: Validator | undefined;

/**
 * Validates a schema against the JSON Schema draft-07 meta schema, returning
 * the first error if any.
 */
export function validateAgainstMetaSchema(
  schema: object,
): SchemaValidationError | undefined {
  if (!metaSchemaValidator) {
    metaSchemaValidator = new Validator(
      structuredClone(draft07MetaSchema) as Schema,
      '7',
      false,
    );
  }
  const result = metaSchemaValidator.validate(schema);
  return result.valid ? undefined : convertErrors(result.errors)[0];
}

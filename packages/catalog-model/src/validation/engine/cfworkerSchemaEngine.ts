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
// subschemas fails
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

// Keywords whose failures ajv reports for the parent instance, rather than
// for the subschema that failed
const PARENT_REPORTED_KEYWORDS = new Set([
  'additionalItems',
  'additionalProperties',
  'unevaluatedItems',
  'unevaluatedProperties',
]);

function encodePointerSegment(segment: string) {
  return encodeURI(segment.replace(/~/g, '~0').replace(/\//g, '~1'));
}

// The instance location that a summary error is about, ending with a slash
// when it covers several children
function summaryChildLocation(error: OutputUnit) {
  const property = error.error.match(
    /^Property "(.*)" (does not|matches)/,
  )?.[1];
  if (property !== undefined) {
    return `${error.instanceLocation}/${encodePointerSegment(property)}`;
  }
  if (error.error.startsWith('Items did not match')) {
    return `${error.instanceLocation}/`;
  }
  return error.instanceLocation;
}

function isWithin(instanceLocation: string, location: string) {
  return location.endsWith('/')
    ? instanceLocation.startsWith(location)
    : instanceLocation === location ||
        instanceLocation.startsWith(`${location}/`);
}

// The engine reports a summary error for keywords such as `properties`
// whenever one of their subschemas fails, which only repeat the errors
// beneath them. A `false` subschema also reports an error of its own. This
// removes the redundant ones, keeping the same errors that ajv would report.
function removeRedundantErrors(errors: OutputUnit[]): OutputUnit[] {
  const summaryLocation = (error: OutputUnit) => {
    if (
      error.keyword !== 'dependencies' &&
      error.keyword !== 'dependentSchemas'
    ) {
      return error.keywordLocation;
    }
    // These keywords also report direct failures, such as a missing
    // dependent property, and only summarize the errors of a dependent schema
    const key = error.error.match(
      /^Instance has "(.*)" but does not match dependant schema\.$/,
    )?.[1];
    return key === undefined
      ? undefined
      : `${error.keywordLocation}/${encodePointerSegment(key)}`;
  };

  const summaries = errors.filter(error => {
    if (!SUMMARY_KEYWORDS.has(error.keyword)) {
      return false;
    }
    const location = summaryLocation(error);
    if (location === undefined) {
      return false;
    }
    const child = summaryChildLocation(error);
    return errors.some(
      other =>
        other !== error &&
        isWithin(other.instanceLocation, child) &&
        // The location of `false` errors is an instance location
        (other.keyword === 'false'
          ? !PARENT_REPORTED_KEYWORDS.has(error.keyword)
          : other.keywordLocation.startsWith(`${location}/`)),
    );
  });

  const parentReported = errors.filter(
    error =>
      PARENT_REPORTED_KEYWORDS.has(error.keyword) && !summaries.includes(error),
  );
  return errors.filter(
    error =>
      !summaries.includes(error) &&
      !(
        error.keyword === 'false' &&
        parentReported.some(parent =>
          isWithin(error.instanceLocation, summaryChildLocation(parent)),
        )
      ),
  );
}

function convertErrors(errors: OutputUnit[]): SchemaValidationError[] {
  return removeRedundantErrors(errors)
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

// Throws for circular references, which can not be represented in JSON
function checkCycle(value: object, ancestors: Set<object>) {
  if (ancestors.has(value)) {
    throw new TypeError('Instance contains a circular reference');
  }
}

function containsUndefined(
  value: unknown,
  ancestors: Set<object> = new Set(),
): boolean {
  if (value === undefined) {
    return true;
  }
  if (typeof value === 'object' && value !== null) {
    checkCycle(value, ancestors);
    ancestors.add(value);
    try {
      for (const item of Object.values(value)) {
        if (containsUndefined(item, ancestors)) {
          return true;
        }
      }
    } finally {
      ancestors.delete(value);
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
  ancestors: Set<object> = new Set(),
): unknown {
  if (typeof value !== 'object' || value === null) {
    return value;
  }
  checkCycle(value, ancestors);
  ancestors.add(value);
  try {
    return normalizeObject(value, path, invalidPaths, ancestors);
  } finally {
    ancestors.delete(value);
  }
}

function normalizeObject(
  value: object,
  path: string,
  invalidPaths: string[],
  ancestors: Set<object>,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (item === undefined) {
        invalidPaths.push(`${path}/${index}`);
        return null;
      }
      return normalizeUndefined(
        item,
        `${path}/${index}`,
        invalidPaths,
        ancestors,
      );
    });
  }
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (item !== undefined) {
      // Plain assignment would treat a `__proto__` key as a prototype change
      Object.defineProperty(result, key, {
        value: normalizeUndefined(
          item,
          `${path}/${key.replace(/~/g, '~0').replace(/\//g, '~1')}`,
          invalidPaths,
          ancestors,
        ),
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
  }
  return result;
}

// Copies a schema, translating any `nullable` keywords
function withoutNullable(schema: object): Schema {
  const clone = cloneJson(schema);
  translateNullable(clone);
  return clone as Schema;
}

// Schemas are plain JSON, so this works without relying on `structuredClone`
function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Throws if the schema declares a `$schema` other than draft-07, which is the
 * only dialect supported by the schema engines.
 */
export function checkSchemaDialect(schema: object) {
  const declared = (schema as { $schema?: unknown }).$schema;
  if (
    declared !== undefined &&
    !/^http:\/\/json-schema\.org\/draft-07\/schema#?$/.test(String(declared))
  ) {
    throw new TypeError(
      `Invalid JSON schema: unsupported $schema ${JSON.stringify(
        declared,
      )}, only http://json-schema.org/draft-07/schema# is supported`,
    );
  }
}

// The keywords that ajv knows about for draft-07, plus annotations
const KNOWN_KEYWORDS = new Set([
  '$comment',
  '$defs',
  '$id',
  '$ref',
  '$schema',
  'additionalItems',
  'additionalProperties',
  'allOf',
  'anyOf',
  'const',
  'contains',
  'contentEncoding',
  'contentMediaType',
  'default',
  'definitions',
  'dependencies',
  'deprecated',
  'description',
  'else',
  'enum',
  'examples',
  'exclusiveMaximum',
  'exclusiveMinimum',
  'format',
  'if',
  'items',
  'maxItems',
  'maxLength',
  'maxProperties',
  'maximum',
  'minItems',
  'minLength',
  'minProperties',
  'minimum',
  'multipleOf',
  'not',
  'nullable',
  'oneOf',
  'pattern',
  'patternProperties',
  'properties',
  'propertyNames',
  'readOnly',
  'required',
  'then',
  'title',
  'type',
  'uniqueItems',
  'writeOnly',
]);

// Keywords whose values are subschemas, or maps or arrays of subschemas
const SUBSCHEMA_KEYWORDS = new Set([
  'additionalItems',
  'additionalProperties',
  'contains',
  'else',
  'if',
  'items',
  'not',
  'propertyNames',
  'then',
]);
const SUBSCHEMA_LIST_KEYWORDS = new Set(['allOf', 'anyOf', 'oneOf']);
const SUBSCHEMA_MAP_KEYWORDS = new Set([
  '$defs',
  'definitions',
  'dependencies',
  'patternProperties',
  'properties',
]);

/**
 * Throws for unknown keywords, which the engine would silently ignore. This
 * matches the strict mode of ajv, which catches misspelled keywords.
 */
function checkKnownKeywords(schema: unknown, path: string = '') {
  if (Array.isArray(schema)) {
    schema.forEach((item, index) =>
      checkKnownKeywords(item, `${path}/${index}`),
    );
    return;
  }
  if (!schema || typeof schema !== 'object') {
    return;
  }
  for (const [keyword, value] of Object.entries(schema)) {
    if (!KNOWN_KEYWORDS.has(keyword)) {
      throw new TypeError(
        `Invalid JSON schema: unknown keyword "${keyword}" at path ${
          path || '<root>'
        }`,
      );
    }
    if (
      SUBSCHEMA_KEYWORDS.has(keyword) ||
      SUBSCHEMA_LIST_KEYWORDS.has(keyword)
    ) {
      checkKnownKeywords(value, `${path}/${keyword}`);
    } else if (
      SUBSCHEMA_MAP_KEYWORDS.has(keyword) &&
      value &&
      typeof value === 'object'
    ) {
      for (const [name, subschema] of Object.entries(value)) {
        // Property dependencies are lists of names rather than schemas
        if (!Array.isArray(subschema)) {
          checkKnownKeywords(subschema, `${path}/${keyword}/${name}`);
        }
      }
    }
  }
}

/**
 * Replaces the `nullable` keyword, which ajv supports as an OpenAPI extension,
 * with the equivalent standard keywords. Modifies the schema in place.
 */
function translateNullable(schema: unknown) {
  if (Array.isArray(schema)) {
    schema.forEach(translateNullable);
    return;
  }
  if (!schema || typeof schema !== 'object') {
    return;
  }
  const node = schema as Record<string, unknown>;
  if ('nullable' in node) {
    if (node.nullable === true) {
      if (typeof node.type === 'string') {
        node.type = [node.type, 'null'];
      } else if (Array.isArray(node.type) && !node.type.includes('null')) {
        node.type = [...node.type, 'null'];
      }
      if ('const' in node) {
        node.enum = [node.const, null];
        delete node.const;
      } else if (Array.isArray(node.enum) && !node.enum.includes(null)) {
        node.enum = [...node.enum, null];
      }
    }
    delete node.nullable;
  }
  for (const [keyword, value] of Object.entries(node)) {
    if (
      SUBSCHEMA_KEYWORDS.has(keyword) ||
      SUBSCHEMA_LIST_KEYWORDS.has(keyword)
    ) {
      translateNullable(value);
    } else if (
      SUBSCHEMA_MAP_KEYWORDS.has(keyword) &&
      value &&
      typeof value === 'object'
    ) {
      for (const subschema of Object.values(value)) {
        if (!Array.isArray(subschema)) {
          translateNullable(subschema);
        }
      }
    }
  }
}

/**
 * A schema engine based on `@cfworker/json-schema`, which interprets schemas
 * instead of generating code.
 */
export const cfworkerSchemaEngine: SchemaEngine = {
  compile({ schema, extraSchemas, allErrors }) {
    // The engine does not check schemas by itself, so reject malformed ones
    // up front, like ajv does
    checkSchemaDialect(schema);
    checkKnownKeywords(schema);
    const schemaError = validateAgainstMetaSchema(schema);
    if (schemaError) {
      throw new TypeError(
        `Invalid JSON schema, error at path ${
          schemaError.instancePath || '<root>'
        }: ${schemaError.message}`,
      );
    }

    // The engine annotates schemas while resolving references, so we make
    // sure to not touch the originals
    const validator = new Validator(withoutNullable(schema), '7', !allErrors);
    for (const extraSchema of extraSchemas) {
      const clone = withoutNullable(extraSchema);
      validator.addSchema(clone, clone.$id);
    }

    return data => {
      const invalidPaths = new Array<string>();
      let result;
      try {
        const input = containsUndefined(data)
          ? normalizeUndefined(data, '', invalidPaths)
          : data;
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

      // Undefined array items are validated as null, which the schema may
      // allow, so they are always reported on top of any schema errors
      const errors = result.valid ? [] : convertErrors(result.errors);
      for (const instancePath of invalidPaths) {
        if (!errors.some(e => e.instancePath === instancePath)) {
          errors.push({
            instancePath,
            keyword: 'type',
            message: 'Array items must not be undefined',
          });
        }
      }
      if (!result.valid && !errors.length) {
        // Such as for a `false` root schema
        errors.push({
          instancePath: '',
          keyword: 'false',
          message: 'Instance does not match the schema',
        });
      }
      return errors.length ? errors : undefined;
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
      cloneJson(draft07MetaSchema) as Schema,
      '7',
      false,
    );
  }
  const result = metaSchemaValidator.validate(schema);
  return result.valid ? undefined : convertErrors(result.errors)[0];
}

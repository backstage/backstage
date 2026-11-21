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

export const MAX_CONFIG_SCHEMA_BYTES = 64 * 1024;
export const MAX_CONFIG_SCHEMA_DEPTH = 32;
// Upper bound on the number of schema nodes a form can expand to once every
// `$ref` is followed, which stops reference fan-out from exploding.
export const MAX_CONFIG_SCHEMA_EXPANDED_NODES = 5000;

export class ConfigSchemaLimitError extends Error {
  constructor(
    readonly reason:
      | 'config-schema-too-large'
      | 'config-schema-too-deep'
      | 'config-schema-invalid',
    message: string,
  ) {
    super(message);
    this.name = 'ConfigSchemaLimitError';
  }
}

// The sanitizer is an allowlist: a keyword survives only if it is listed
// here, and sub-schemas are only visited at the positions listed below.
// Everything else, including every keyword that can run a regular expression,
// load another document or add conditional logic, is dropped together with
// anything nested under it.

const TYPE_NAMES = new Set([
  'string',
  'number',
  'integer',
  'boolean',
  'object',
  'array',
  'null',
]);

const STRING_KEYWORDS = new Set(['title', 'description']);
const BOOLEAN_KEYWORDS = new Set([
  'uniqueItems',
  'readOnly',
  'writeOnly',
  'deprecated',
]);
const NUMBER_KEYWORDS = new Set([
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'multipleOf',
  'minLength',
  'maxLength',
  'minItems',
  'maxItems',
  'minProperties',
  'maxProperties',
]);
// Values that are data, not schemas. They are copied but never interpreted.
const DATA_KEYWORDS = new Set(['default', 'const']);

// Maps from a user-chosen name to a sub-schema.
const SCHEMA_MAP_KEYWORDS = new Set(['properties', 'definitions', '$defs']);
const SCHEMA_ARRAY_KEYWORDS = new Set(['allOf', 'anyOf', 'oneOf']);

const REF_PREFIXES = ['#/definitions/', '#/$defs/'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function checkDepth(depth: number) {
  if (depth > MAX_CONFIG_SCHEMA_DEPTH) {
    throw new ConfigSchemaLimitError(
      'config-schema-too-deep',
      `Config schema is nested deeper than ${MAX_CONFIG_SCHEMA_DEPTH} levels`,
    );
  }
}

// Copies plain data (defaults, enums, constants) without interpreting it.
// Object.fromEntries defines own properties, so a "__proto__" key stays data.
function copyData(value: unknown, depth: number): unknown {
  checkDepth(depth);
  if (Array.isArray(value)) {
    return value.map(item => copyData(item, depth + 1));
  }
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        copyData(item, depth + 1),
      ]),
    );
  }
  return value;
}

/** The definition name a local `$ref` points to, if it has the allowed shape. */
function refTarget(
  ref: string,
): { prefix: (typeof REF_PREFIXES)[number]; name: string } | undefined {
  const prefix = REF_PREFIXES.find(candidate => ref.startsWith(candidate));
  if (!prefix) {
    return undefined;
  }
  const segment = ref.slice(prefix.length);
  if (segment.length === 0 || segment.includes('/')) {
    return undefined;
  }
  try {
    return {
      prefix,
      name: decodeURIComponent(segment).replace(/~1/g, '/').replace(/~0/g, '~'),
    };
  } catch {
    return undefined;
  }
}

function normalizedRef(ref: string): string {
  const target = refTarget(ref);
  return target ? `${target.prefix}${target.name}` : ref;
}

interface Context {
  // Names of the sanitized `definitions` and `$defs` entries a `$ref` may use.
  definitions: Set<string>;
  defs: Set<string>;
}

function sanitizeSchema(
  value: unknown,
  depth: number,
  context: Context,
): unknown {
  checkDepth(depth);
  if (typeof value === 'boolean') {
    return value;
  }
  if (!isRecord(value)) {
    return undefined;
  }

  const entries: [string, unknown][] = [];
  for (const [key, item] of Object.entries(value)) {
    if (key === 'type') {
      if (typeof item === 'string' && TYPE_NAMES.has(item)) {
        entries.push([key, item]);
      } else if (
        Array.isArray(item) &&
        item.every(name => typeof name === 'string' && TYPE_NAMES.has(name))
      ) {
        entries.push([key, [...item]]);
      }
    } else if (STRING_KEYWORDS.has(key)) {
      if (typeof item === 'string') {
        entries.push([key, item]);
      }
    } else if (BOOLEAN_KEYWORDS.has(key)) {
      if (typeof item === 'boolean') {
        entries.push([key, item]);
      }
    } else if (NUMBER_KEYWORDS.has(key)) {
      if (typeof item === 'number' && Number.isFinite(item)) {
        entries.push([key, item]);
      }
    } else if (key === 'required') {
      if (isStringArray(item)) {
        entries.push([key, [...item]]);
      }
    } else if (key === 'enum') {
      if (Array.isArray(item)) {
        entries.push([key, copyData(item, depth + 1)]);
      }
    } else if (DATA_KEYWORDS.has(key)) {
      entries.push([key, copyData(item, depth + 1)]);
    } else if (key === '$ref') {
      const target = typeof item === 'string' ? refTarget(item) : undefined;
      const known =
        target?.prefix === '#/definitions/'
          ? context.definitions
          : context.defs;
      if (typeof item === 'string' && target && known.has(target.name)) {
        entries.push([key, item]);
      }
    } else if (SCHEMA_MAP_KEYWORDS.has(key)) {
      if (isRecord(item)) {
        entries.push([
          key,
          Object.fromEntries(
            Object.entries(item).flatMap(([name, schema]) => {
              const sanitized = sanitizeSchema(schema, depth + 2, context);
              return sanitized === undefined ? [] : [[name, sanitized]];
            }),
          ),
        ]);
      }
    } else if (SCHEMA_ARRAY_KEYWORDS.has(key)) {
      if (Array.isArray(item)) {
        entries.push([
          key,
          item.flatMap(schema => {
            const sanitized = sanitizeSchema(schema, depth + 2, context);
            return sanitized === undefined ? [] : [sanitized];
          }),
        ]);
      }
    } else if (key === 'items') {
      if (Array.isArray(item)) {
        entries.push([
          key,
          item.flatMap(schema => {
            const sanitized = sanitizeSchema(schema, depth + 2, context);
            return sanitized === undefined ? [] : [sanitized];
          }),
        ]);
      } else {
        const sanitized = sanitizeSchema(item, depth + 1, context);
        if (sanitized !== undefined) {
          entries.push([key, sanitized]);
        }
      }
    } else if (key === 'additionalProperties') {
      const sanitized = sanitizeSchema(item, depth + 1, context);
      if (sanitized !== undefined) {
        entries.push([key, sanitized]);
      }
    }
    // Any other keyword is dropped.
  }

  return Object.fromEntries(entries);
}

/** The sub-schemas of an already sanitized schema node. */
function childSchemas(node: Record<string, unknown>): unknown[] {
  const children: unknown[] = [];
  for (const [key, value] of Object.entries(node)) {
    if (SCHEMA_MAP_KEYWORDS.has(key) && isRecord(value)) {
      if (key === 'properties') {
        children.push(...Object.values(value));
      }
    } else if (SCHEMA_ARRAY_KEYWORDS.has(key) && Array.isArray(value)) {
      children.push(...value);
    } else if (key === 'items') {
      children.push(...(Array.isArray(value) ? value : [value]));
    } else if (key === 'additionalProperties') {
      children.push(value);
    }
  }
  return children.filter(isRecord);
}

interface Counts {
  nodes: number;
  refs: string[];
}

function countNode(node: Record<string, unknown>, counts: Counts) {
  counts.nodes += 1;
  if (typeof node.$ref === 'string') {
    counts.refs.push(node.$ref);
  }
  for (const child of childSchemas(node)) {
    countNode(child as Record<string, unknown>, counts);
  }
}

function definitionEntries(
  schema: Record<string, unknown>,
): [string, Record<string, unknown>][] {
  return (['definitions', '$defs'] as const).flatMap(key => {
    const map = schema[key];
    const prefix = key === 'definitions' ? REF_PREFIXES[0] : REF_PREFIXES[1];
    return isRecord(map)
      ? Object.entries(map)
          .filter(([, value]) => isRecord(value))
          .map(([name, value]) => [
            `${prefix}${name}`,
            value as Record<string, unknown>,
          ])
      : [];
  }) as [string, Record<string, unknown>][];
}

// Rejects reference cycles and reference fan-out that would make a form
// expand without bound, by walking the schema with every `$ref` followed.
function checkReferenceExpansion(schema: Record<string, unknown>) {
  const byRef = new Map<string, Counts>();
  for (const [ref, definition] of definitionEntries(schema)) {
    const counts: Counts = { nodes: 0, refs: [] };
    countNode(definition, counts);
    byRef.set(ref, counts);
  }

  const expanded = new Map<string, number>();
  const visiting = new Set<string>();
  function expandedSize(rawRef: string): number {
    const ref = normalizedRef(rawRef);
    const cached = expanded.get(ref);
    if (cached !== undefined) {
      return cached;
    }
    if (visiting.has(ref)) {
      throw new ConfigSchemaLimitError(
        'config-schema-invalid',
        'Config schema contains a recursive $ref',
      );
    }
    const counts = byRef.get(ref);
    if (!counts) {
      return 0;
    }
    visiting.add(ref);
    let total = counts.nodes;
    for (const inner of counts.refs) {
      total += expandedSize(inner);
      if (total > MAX_CONFIG_SCHEMA_EXPANDED_NODES) {
        throw new ConfigSchemaLimitError(
          'config-schema-too-large',
          'Config schema expands to too many nodes once references are resolved',
        );
      }
    }
    visiting.delete(ref);
    expanded.set(ref, total);
    return total;
  }

  const root: Counts = { nodes: 0, refs: [] };
  countNode(schema, root);
  let total = root.nodes;
  for (const ref of root.refs) {
    total += expandedSize(ref);
  }
  for (const ref of byRef.keys()) {
    expandedSize(ref);
  }
  if (total > MAX_CONFIG_SCHEMA_EXPANDED_NODES) {
    throw new ConfigSchemaLimitError(
      'config-schema-too-large',
      'Config schema expands to too many nodes once references are resolved',
    );
  }
}

/**
 * Reduces a package-supplied JSON Schema to the keywords the plugin directory
 * renders as a configuration form. Only allowlisted keywords are kept, and
 * only inside allowlisted sub-schema positions. A `$ref` survives only when it
 * is `#/definitions/<name>` or `#/$defs/<name>` and names a definition kept in
 * the output. Recursive references, schemas that are too deeply nested or too
 * large, and non-object input are rejected. Property names are never treated
 * as keywords.
 */
export function sanitizeConfigSchema(schema: unknown): Record<string, unknown> {
  if (!isRecord(schema)) {
    throw new TypeError('Config schema must be a JSON object');
  }

  const names = (key: 'definitions' | '$defs') => {
    const map = schema[key];
    return new Set(
      isRecord(map)
        ? Object.entries(map)
            .filter(
              ([, value]) => isRecord(value) || typeof value === 'boolean',
            )
            .map(([name]) => name)
        : [],
    );
  };
  const sanitized = sanitizeSchema(schema, 0, {
    definitions: names('definitions'),
    defs: names('$defs'),
  }) as Record<string, unknown>;

  const size = Buffer.byteLength(JSON.stringify(sanitized), 'utf8');
  if (size > MAX_CONFIG_SCHEMA_BYTES) {
    throw new ConfigSchemaLimitError(
      'config-schema-too-large',
      `Config schema is ${size} bytes, over the ${MAX_CONFIG_SCHEMA_BYTES} byte limit`,
    );
  }
  checkReferenceExpansion(sanitized);
  return sanitized;
}

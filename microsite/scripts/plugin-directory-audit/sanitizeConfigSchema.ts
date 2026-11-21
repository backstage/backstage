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

export class ConfigSchemaLimitError extends Error {
  constructor(
    readonly reason: 'config-schema-too-large' | 'config-schema-too-deep',
    message: string,
  ) {
    super(message);
    this.name = 'ConfigSchemaLimitError';
  }
}

// Keywords that make a validator run attacker-chosen regular expressions or
// resolve identifiers, none of which the plugin directory needs to render a
// configuration form.
const DROPPED_KEYWORDS = new Set([
  'pattern',
  'patternProperties',
  'format',
  '$id',
]);

// Keywords whose value is a map from a user-chosen name to a sub-schema. The
// names are data and must never be treated as keywords.
const SCHEMA_MAP_KEYWORDS = new Set(['properties', 'definitions', '$defs']);

// Keywords whose value is a single sub-schema or an array of sub-schemas.
const SCHEMA_KEYWORDS = new Set([
  'items',
  'additionalItems',
  'additionalProperties',
  'contains',
  'propertyNames',
  'not',
  'if',
  'then',
  'else',
]);

const SCHEMA_ARRAY_KEYWORDS = new Set(['allOf', 'anyOf', 'oneOf']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function checkDepth(depth: number) {
  if (depth > MAX_CONFIG_SCHEMA_DEPTH) {
    throw new ConfigSchemaLimitError(
      'config-schema-too-deep',
      `Config schema is nested deeper than ${MAX_CONFIG_SCHEMA_DEPTH} levels`,
    );
  }
}

// Copies plain data (defaults, enums, examples) without interpreting it.
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

function sanitizeSchemaOrBoolean(value: unknown, depth: number): unknown {
  return isRecord(value) ? sanitizeNode(value, depth) : copyData(value, depth);
}

function sanitizeNode(
  node: Record<string, unknown>,
  depth: number,
): Record<string, unknown> {
  checkDepth(depth);
  const entries: [string, unknown][] = [];

  for (const [key, value] of Object.entries(node)) {
    if (DROPPED_KEYWORDS.has(key)) {
      continue;
    }

    if (key === '$ref') {
      // Only references within this document are allowed.
      if (typeof value === 'string' && value.startsWith('#/')) {
        entries.push([key, value]);
      }
    } else if (SCHEMA_MAP_KEYWORDS.has(key) && isRecord(value)) {
      entries.push([
        key,
        Object.fromEntries(
          Object.entries(value).map(([name, schema]) => [
            name,
            sanitizeSchemaOrBoolean(schema, depth + 2),
          ]),
        ),
      ]);
    } else if (SCHEMA_KEYWORDS.has(key)) {
      entries.push([
        key,
        Array.isArray(value)
          ? value.map(item => sanitizeSchemaOrBoolean(item, depth + 2))
          : sanitizeSchemaOrBoolean(value, depth + 1),
      ]);
    } else if (SCHEMA_ARRAY_KEYWORDS.has(key) && Array.isArray(value)) {
      entries.push([
        key,
        value.map(item => sanitizeSchemaOrBoolean(item, depth + 2)),
      ]);
    } else {
      entries.push([key, copyData(value, depth + 1)]);
    }
  }

  return Object.fromEntries(entries);
}

/**
 * Reduces a package-supplied JSON Schema to what the plugin directory is
 * willing to store and render. It removes `pattern`, `patternProperties`,
 * `format`, `$id`, and any `$ref` that does not point inside the document,
 * and throws a {@link ConfigSchemaLimitError} when the schema is too deeply
 * nested or too large. Property names are never treated as keywords.
 */
export function sanitizeConfigSchema(schema: unknown): Record<string, unknown> {
  if (!isRecord(schema)) {
    throw new TypeError('Config schema must be a JSON object');
  }

  const sanitized = sanitizeNode(schema, 0);
  const size = Buffer.byteLength(JSON.stringify(sanitized), 'utf8');
  if (size > MAX_CONFIG_SCHEMA_BYTES) {
    throw new ConfigSchemaLimitError(
      'config-schema-too-large',
      `Config schema is ${size} bytes, over the ${MAX_CONFIG_SCHEMA_BYTES} byte limit`,
    );
  }
  return sanitized;
}

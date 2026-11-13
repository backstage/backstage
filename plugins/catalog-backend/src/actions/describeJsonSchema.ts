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

type Schema = Record<string, any>;

/**
 * A field of a JSON schema: its dot path, the facts known about it, and its
 * description. It is rendered as one markdown list item.
 */
export type JsonSchemaField = {
  path: string;
  parts: string[];
  description?: string;
};

/**
 * Renders a field as one markdown list item.
 */
export function renderJsonSchemaField(entry: JsonSchemaField): string {
  return `* "${entry.path}" (${entry.parts.join(', ')})${
    entry.description ? `: ${entry.description}` : ''
  }`;
}

// Keywords that combine or condition schemas. They are not expanded; the field
// is marked instead, so that a reader knows the listing is partial.
const CONDITIONAL_KEYWORDS = [
  // TODO: Support merging the entries of allOf, so that their constraints are
  // listed as part of the field instead of only being marked
  'allOf',
  'anyOf',
  'oneOf',
  'if',
  'then',
  'else',
  'not',
  'dependencies',
  'dependentRequired',
  'dependentSchemas',
];

function isObject(value: unknown): value is Schema {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toArray(value: unknown): unknown[] {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

// Serializes a JSON value with sorted object keys, so that equal values always
// produce the same string regardless of key order
function canonical(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonical).join(',')}]`;
  }
  if (isObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .map(key => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

// The values present in both lists, compared deeply and in a stable order
function intersect(a: unknown[], b: unknown[]): unknown[] {
  const inB = new Set(b.map(canonical));
  const result = new Map<string, unknown>();
  for (const value of a) {
    const key = canonical(value);
    if (inB.has(key)) {
      result.set(key, value);
    }
  }
  return [...result.keys()].sort().map(key => result.get(key));
}

// The values allowed by enum and const together, or undefined if unrestricted
function allowedValuesOf(schema: Schema): unknown[] | undefined {
  const fromEnum = Array.isArray(schema.enum) ? schema.enum : undefined;
  const fromConst = 'const' in schema ? [schema.const] : undefined;
  if (fromEnum && fromConst) {
    return intersect(fromConst, fromEnum);
  }
  return fromEnum ?? fromConst;
}

function hasProperties(schema: Schema): boolean {
  return (
    isObject(schema.properties) && Object.keys(schema.properties).length > 0
  );
}

// The item schemas of a tuple, from prefixItems or an items list
function tupleItemsOf(schema: Schema): unknown[] | undefined {
  if (Array.isArray(schema.prefixItems)) {
    return schema.prefixItems;
  }
  return Array.isArray(schema.items) ? schema.items : undefined;
}

// The schema for items after the tuple ones, if any
function restItemsOf(schema: Schema): unknown {
  return Array.isArray(schema.prefixItems)
    ? schema.items
    : schema.additionalItems;
}

/**
 * Options for {@link describeJsonSchemaFields}.
 */
export type DescribeJsonSchemaFieldsOptions = {
  /** How many levels of nested properties to list, counting the root ones */
  maxDepth: number;
  /** Names of root properties to leave out */
  omitRootProperties?: ReadonlySet<string>;
};

/**
 * Lists the properties of a JSON schema as fields, addressed by dot paths.
 * Properties of array items are listed under the path of the array.
 */
export function describeJsonSchemaFields(
  schema: Schema,
  options: DescribeJsonSchemaFieldsOptions,
): JsonSchemaField[] {
  return collectFields(schema, '', 0, options);
}

function collectFields(
  schema: Schema,
  prefix: string,
  depth: number,
  options: DescribeJsonSchemaFieldsOptions,
): JsonSchemaField[] {
  const required = new Set(toArray(schema.required));
  const entries: JsonSchemaField[] = [];
  for (const [name, field] of Object.entries(
    isObject(schema.properties) ? schema.properties : {},
  )) {
    if (!prefix && options.omitRootProperties?.has(name)) {
      continue;
    }
    const path = prefix ? `${prefix}.${name}` : name;
    if (typeof field === 'boolean') {
      entries.push({
        path,
        parts: [
          field ? 'any value' : 'not allowed',
          ...(required.has(name) ? ['required'] : []),
        ],
      });
      continue;
    }
    if (!isObject(field)) {
      continue;
    }
    const entry = describeField(path, field, required.has(name));
    entries.push(entry);

    // Fields of array items are listed under the path of the array, but only
    // one array level deep and down to a maximum depth
    let nested = field;
    let arrayLevels = 0;
    while (!tupleItemsOf(nested) && isObject(nested.items)) {
      nested = nested.items;
      arrayLevels += 1;
    }
    // Tuple items are not listed field by field
    const tuple = tupleItemsOf(nested);
    const unlisted = tuple
      ? [...tuple, restItemsOf(nested)].filter(isObject)
      : [];
    if (!tuple && arrayLevels <= 1 && depth + 1 < options.maxDepth) {
      entries.push(...collectFields(nested, path, depth + 1, options));
    } else if ([nested, ...unlisted].some(hasProperties)) {
      entry.parts.push('has nested fields not listed here');
    }
  }
  return entries;
}

function describeType(schema: Schema): string {
  const parts: string[] = [];
  if (schema.type !== undefined) {
    const types = toArray(schema.type).filter(t => typeof t === 'string');
    if (types.length === 1 && types[0] === 'array') {
      parts.push(describeArray(schema));
    } else {
      // Declarations whose types do not overlap leave no valid type
      parts.push(types.length ? types.join(' | ') : 'no valid type');
    }
  }
  // Referenced definitions are not resolved, but the field must still show
  if (typeof schema.$ref === 'string') {
    parts.push(`reference to "${schema.$ref}"`);
  }
  return parts.length ? parts.join(', ') : 'unknown';
}

function describeArray(schema: Schema): string {
  const tuple = tupleItemsOf(schema);
  if (tuple) {
    const rest = restItemsOf(schema);
    let text = `tuple of [${tuple.map(describeItem).join(', ')}]`;
    if (rest === false) {
      text += ' with no further items';
    } else if (isObject(rest)) {
      text += ` followed by ${describeItem(rest)}`;
    }
    return text;
  }
  if (schema.items === false) {
    return 'empty array';
  }
  return isObject(schema.items)
    ? `array of ${describeItem(schema.items)}`
    : 'array';
}

function describeItem(value: unknown): string {
  if (typeof value === 'boolean') {
    return value ? 'any value' : 'nothing';
  }
  if (!isObject(value)) {
    return 'unknown';
  }
  const values = describeAllowedValues(value);
  return `${describeType(value)}${values ? ` [${values}]` : ''}`;
}

function describeAllowedValues(schema: Schema): string | undefined {
  const values = allowedValuesOf(schema);
  if (!values) {
    return undefined;
  }
  if (!values.length) {
    return 'no allowed values';
  }
  if (values.length === 1 && 'const' in schema) {
    return `const ${canonical(values[0])}`;
  }
  return `one of ${values.map(canonical).join(', ')}`;
}

// Short wording for bounds, as [keyword, label, unit]. Units are pluralized
// when the bound is not 1.
const BOUND_LABELS: Array<[string, string, string?]> = [
  ['minimum', 'min'],
  ['exclusiveMinimum', 'over'],
  ['maximum', 'max'],
  ['exclusiveMaximum', 'under'],
  ['minLength', 'min length'],
  ['maxLength', 'max length'],
  ['minItems', 'at least', 'item'],
  ['maxItems', 'at most', 'item'],
  ['minProperties', 'at least', 'key'],
  ['maxProperties', 'at most', 'key'],
];

// Bounds, formats, patterns and the default value of a schema
function describeConstraints(schema: Schema): string[] {
  const parts: string[] = [];
  for (const [keyword, label, unit] of BOUND_LABELS) {
    const bound = schema[keyword];
    // A minimum length of 1 only rules out empty strings, which is implied
    if (
      typeof bound === 'number' &&
      !(keyword === 'minLength' && bound === 1)
    ) {
      const suffix = unit ? ` ${unit}${bound === 1 ? '' : 's'}` : '';
      parts.push(`${label} ${bound}${suffix}`);
    }
  }
  if (typeof schema.format === 'string') {
    parts.push(`format: ${schema.format}`);
  }
  if (typeof schema.pattern === 'string') {
    parts.push(`pattern: ${JSON.stringify(schema.pattern)}`);
  }
  if ('default' in schema) {
    parts.push(`default ${canonical(schema.default)}`);
  }
  return parts;
}

function describeField(
  path: string,
  schema: Schema,
  required: boolean,
): JsonSchemaField {
  const parts = [describeType(schema)];
  if (required) {
    parts.push('required');
  }
  const values = describeAllowedValues(schema);
  if (values) {
    parts.push(values);
  }
  parts.push(...describeConstraints(schema));
  if (schema.additionalProperties === false) {
    parts.push('no other keys');
  } else if (isObject(schema.additionalProperties)) {
    parts.push(`other keys: ${describeItem(schema.additionalProperties)}`);
  }
  if (
    isObject(schema.patternProperties) &&
    Object.keys(schema.patternProperties).length
  ) {
    parts.push('has pattern-matched keys not listed here');
  }
  if (CONDITIONAL_KEYWORDS.some(k => k in schema)) {
    parts.push('has conditional constraints not listed here');
  }
  // Each field is a single list item, so line breaks are collapsed
  const description =
    typeof schema.description === 'string'
      ? schema.description.replace(/\s+/g, ' ').trim()
      : '';
  return { path, parts, description: description || undefined };
}

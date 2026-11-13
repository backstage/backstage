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

// Keywords whose constraints apply only in some cases. They are not expanded;
// the field is marked instead, so that a reader knows the listing is partial.
const CONDITIONAL_KEYWORDS = [
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

// The distinct values of a keyword across two schemas, in a stable order
function union(a: unknown, b: unknown): unknown[] {
  const result = new Map<string, unknown>();
  for (const value of [...toArray(a), ...toArray(b)]) {
    result.set(canonical(value), value);
  }
  return [...result.keys()].sort().map(key => result.get(key));
}

// Like intersect, but aware that every integer is also a number
function intersectTypes(a: unknown[], b: unknown[]): unknown[] {
  const result = new Set<unknown>();
  for (const x of a) {
    for (const y of b) {
      if (x === y) {
        result.add(x);
      } else if (
        (x === 'integer' && y === 'number') ||
        (x === 'number' && y === 'integer')
      ) {
        result.add('integer');
      }
    }
  }
  return [...result].sort();
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

// Folds inline allOf entries into the schema. Every entry applies, so they are
// combined without regard to their order (see combine), and properties
// declared more than once are folded the same way when visited. A folded
// schema is only used for rendering, so keywords such as $ref and description
// may hold a list of values.
function foldAllOf(schema: Schema): Schema {
  if (!Array.isArray(schema.allOf)) {
    return schema;
  }
  const { allOf, ...rest } = schema;
  return allOf
    .map(toSchema)
    .filter(isObject)
    .map(foldAllOf)
    .reduce(combine, rest);
}

// Boolean schemas allow anything (true) or nothing (false)
function toSchema(value: unknown): Schema | undefined {
  if (typeof value === 'boolean') {
    return value ? {} : { enum: [] };
  }
  return isObject(value) ? value : undefined;
}

function hasProperties(schema: Schema): boolean {
  return (
    isObject(schema.properties) && Object.keys(schema.properties).length > 0
  );
}

// Lower bounds narrow by taking the largest value, upper bounds the smallest
const LOWER_BOUNDS = [
  'minimum',
  'exclusiveMinimum',
  'minLength',
  'minItems',
  'minProperties',
  'minContains',
];
const UPPER_BOUNDS = [
  'maximum',
  'exclusiveMaximum',
  'maxLength',
  'maxItems',
  'maxProperties',
  'maxContains',
];

// Marks a default that entries disagree on, so that later entries cannot
// bring one back
const CONFLICTING_DEFAULT = Symbol('conflicting default');

// Combines two schemas that both apply. The result does not depend on which of
// them comes first, and no constraint of either is lost.
function combine(a: Schema, b: Schema): Schema {
  const result: Schema = { ...b, ...a };
  if (a.type !== undefined && b.type !== undefined) {
    result.type = intersectTypes(toArray(a.type), toArray(b.type));
  }
  const aValues = allowedValuesOf(a);
  const bValues = allowedValuesOf(b);
  if (aValues && bValues) {
    const values = intersect(aValues, bValues);
    delete result.enum;
    delete result.const;
    if (values.length === 1 && ('const' in a || 'const' in b)) {
      result.const = values[0];
    } else {
      result.enum = values;
    }
  }
  // Every one of these applies, so all distinct values are kept
  for (const key of ['$ref', 'description', 'format', 'pattern', 'required']) {
    if (a[key] !== undefined && b[key] !== undefined) {
      const values = union(a[key], b[key]);
      result[key] =
        values.length === 1 && key !== 'required' ? values[0] : values;
    }
  }
  for (const key of LOWER_BOUNDS) {
    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
      result[key] = Math.max(a[key], b[key]);
    }
  }
  for (const key of UPPER_BOUNDS) {
    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
      result[key] = Math.min(a[key], b[key]);
    }
  }
  if (
    'default' in a &&
    'default' in b &&
    (a.default === CONFLICTING_DEFAULT ||
      b.default === CONFLICTING_DEFAULT ||
      canonical(a.default) !== canonical(b.default))
  ) {
    result.default = CONFLICTING_DEFAULT;
  }
  if (isObject(a.properties) && isObject(b.properties)) {
    // Fields declared across entries are listed by name, independent of order
    const names = [
      ...new Set([...Object.keys(a.properties), ...Object.keys(b.properties)]),
    ].sort();
    result.properties = Object.fromEntries(
      names.map(name => [name, bothOf(a.properties[name], b.properties[name])]),
    );
  }
  combineItems(a, b, result);
  const aExtra = a.additionalProperties;
  const bExtra = b.additionalProperties;
  if (aExtra !== undefined && bExtra !== undefined) {
    result.additionalProperties = bothOf(aExtra, bExtra);
  }
  return result;
}

// A schema that requires both of two, possibly missing or boolean, schemas
function bothOf(a: unknown, b: unknown): unknown {
  if (a === undefined || a === true) {
    return b;
  }
  if (b === undefined || b === true) {
    return a;
  }
  if (a === false || b === false) {
    return false;
  }
  return { allOf: [a, b] };
}

// Combines the item schemas of two arrays. A tuple item applies together with
// the other side's item at the same position, or its schema for all items.
function combineItems(a: Schema, b: Schema, result: Schema) {
  const aTuple = tupleItemsOf(a);
  const bTuple = tupleItemsOf(b);
  const aRest = aTuple ? restItemsOf(a) : a.items;
  const bRest = bTuple ? restItemsOf(b) : b.items;
  if (!aTuple && !bTuple) {
    if (aRest !== undefined && bRest !== undefined) {
      result.items = bothOf(aRest, bRest);
    }
    return;
  }
  const length = Math.max(aTuple?.length ?? 0, bTuple?.length ?? 0);
  const itemAt = (tuple: unknown[] | undefined, rest: unknown, i: number) =>
    tuple && i < tuple.length ? tuple[i] : rest;
  result.prefixItems = Array.from(
    { length },
    (_, i) =>
      bothOf(itemAt(aTuple, aRest, i), itemAt(bTuple, bRest, i)) ?? true,
  );
  delete result.additionalItems;
  const rest = bothOf(aRest, bRest);
  if (rest === undefined) {
    delete result.items;
  } else {
    result.items = rest;
  }
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
  const node = foldAllOf(schema);
  const required = new Set(toArray(node.required));
  const entries: JsonSchemaField[] = [];
  for (const [name, raw] of Object.entries(
    isObject(node.properties) ? node.properties : {},
  )) {
    if (!prefix && options.omitRootProperties?.has(name)) {
      continue;
    }
    const path = prefix ? `${prefix}.${name}` : name;
    if (typeof raw === 'boolean') {
      entries.push({
        path,
        parts: [
          raw ? 'any value' : 'not allowed',
          ...(required.has(name) ? ['required'] : []),
        ],
      });
      continue;
    }
    if (!isObject(raw)) {
      continue;
    }
    const field = foldAllOf(raw);
    const entry = describeField(path, field, required.has(name));
    entries.push(entry);

    // Fields of array items are listed under the path of the array, but only
    // one array level deep and down to a maximum depth
    let nested = field;
    let arrayLevels = 0;
    while (!tupleItemsOf(nested) && isObject(nested.items)) {
      nested = foldAllOf(nested.items);
      arrayLevels += 1;
    }
    // Tuple items are not listed field by field
    const tuple = tupleItemsOf(nested);
    const unlisted = tuple
      ? [...tuple, restItemsOf(nested)].map(toSchema).filter(isObject)
      : [];
    if (!tuple && arrayLevels <= 1 && depth + 1 < options.maxDepth) {
      entries.push(...collectFields(nested, path, depth + 1, options));
    } else if ([nested, ...unlisted].some(s => hasProperties(foldAllOf(s)))) {
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
  const refs = toArray(schema.$ref).filter(r => typeof r === 'string');
  if (refs.length) {
    parts.push(refs.map(r => `reference to "${r}"`).join(' and '));
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
  const schema = foldAllOf(value);
  const values = describeAllowedValues(schema);
  return `${describeType(schema)}${values ? ` [${values}]` : ''}`;
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
  const formats = toArray(schema.format).filter(f => typeof f === 'string');
  if (formats.length) {
    parts.push(`format: ${formats.join(' and ')}`);
  }
  const patterns = toArray(schema.pattern).filter(p => typeof p === 'string');
  if (patterns.length) {
    parts.push(
      `pattern: ${patterns.map(p => JSON.stringify(p)).join(' and ')}`,
    );
  }
  if ('default' in schema && schema.default !== CONFLICTING_DEFAULT) {
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
  const description = toArray(schema.description)
    .filter((d): d is string => typeof d === 'string')
    .map(d => d.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(' ');
  return { path, parts, description: description || undefined };
}

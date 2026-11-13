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

import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import {
  CatalogModel,
  CatalogModelKind,
  CatalogModelAnnotationSummary,
  CatalogModelKindSummary,
  CatalogModelLabelSummary,
  CatalogModelRelationSummary,
  CatalogModelTagSummary,
  compileCatalogModel,
  defaultCatalogEntityModel,
} from '@backstage/catalog-model/alpha';
import { ModelHolder } from '../model/ModelHolder';

const PREAMBLE = `# Catalog Model

The software catalog contains a few key concepts:

* Entities
  * rich objects with various kinds, with different schemas
  * can have relations between each other
* Locations
  * registered as type/target pairs
  * typically in the form of URLs that the catalog has been tasked with keeping track of

## Entities

The catalog contains entities of different kinds. Every entity is an object with
fields "kind", "apiVersion", "metadata", and optionally "spec" and "relations".

When querying the catalog you use dot path notation to address fields, e.g. "metadata.name".
When querying for entity relationships, prefer using relations over spec fields, e.g. the
special syntax "relations.ownedBy" instead of "spec.owner".

The unique identifying key for an entity is its so called entity reference (or entity ref
for short), on the form of "kind:namespace/name", e.g. "component:default/my-service".
These are always uniformly lowercased in the "en-US" locale.

`;

const METADATA_SECTION = `## Entity Metadata field

The "metadata" object field on all entities has the same static schema. Some common fields
there are:

* "name": The name of the entity. Must be unique within the catalog at any given point in time, for any given namespace + kind pair. This value is part of the technical identifier of the entity, and as such it will appear in URLs, database tables, entity references, and similar. It is subject to restrictions regarding what characters are allowed. If you want to use a different, more human readable string with fewer restrictions on it in user interfaces, see the "title" field below.
* "namespace" (default value: "default"): The namespace that the entity belongs to.
* "uid": A globally unique ID for the entity. This field can not be set by the user at creation time, and the server will reject an attempt to do so. The field will be populated in read operations. The field can (optionally) be specified when performing update or delete operations, but the server is free to reject requests that do so in such a way that it breaks semantics.
* "etag": An opaque string that changes for each update operation to any part of the entity, including metadata. This field can not be set by the user at creation time, and the server will reject an attempt to do so. The field will be populated in read operations. The field can (optionally) be specified when performing update or delete operations, and the server will then reject the operation if it does not match the current stored value.
* "title": A display name of the entity, to be presented in user interfaces instead of the name property, when available. This field is sometimes useful when the name is cumbersome or ends up being perceived as overly technical. The title generally does not have as stringent format requirements on it, so it may contain special characters and be more explanatory. Do keep it very short though, and avoid situations where a title can be confused with the name of another entity, or where two entities share a title. Note that this is only for display purposes, and may be ignored by some parts of the code. Entity references still always make use of the name property, not the title.
* "description": A short (typically relatively few words, on one line) description of the entity.
* "annotations": A map of annotations on the entity.
* "labels": A map of labels on the entity.
* "tags": A list of tags on the entity.
* "links": A list of links on the entity.
`;

/**
 * Lets users fetch a markdown formatted description of the catalog model. This
 * is useful for informing LLMs how to properly work with it.
 */
export const createGetCatalogModelDescriptionAction = ({
  modelHolder,
  actionsRegistry,
}: {
  modelHolder: ModelHolder | undefined;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'get-catalog-model-description',
    title: 'Get a Catalog Model Description',
    description:
      'Returns a markdown formatted description of the current catalog model, including all registered entity kinds and their fields, annotations, labels, tags, and relations.',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    schema: {
      input: z => z.object({}),
      output: z =>
        z.object({
          description: z
            .string()
            .describe(
              'Markdown description of the catalog model including entity kinds, spec fields, and relations.',
            ),
        }),
    },
    action: async () => {
      return {
        output: {
          description: describeCatalogModel(modelHolder?.model),
        },
      };
    },
  });
};

const MAX_FIELD_DEPTH = 3;

// Fields shared by all entities, which are described separately
const BASE_FIELDS = new Set(['apiVersion', 'kind', 'metadata']);

// Compile the default model once (if needed) and cache it
let defaultModel: CatalogModel | undefined;

function getDefaultModel(): CatalogModel {
  if (!defaultModel) {
    defaultModel = compileCatalogModel([defaultCatalogEntityModel]);
  }
  return defaultModel;
}

// Descriptions of models, cached per model instance
const modelDescriptions = new WeakMap<CatalogModel, string>();

function describeCatalogModel(model: CatalogModel | undefined): string {
  const resolvedModel = model ?? getDefaultModel();
  let description = modelDescriptions.get(resolvedModel);
  if (!description) {
    description = describeModel(resolvedModel);
    modelDescriptions.set(resolvedModel, description);
  }
  return description;
}

function describeModel(model: CatalogModel): string {
  return `${PREAMBLE}${METADATA_SECTION}
${model.getMetadata().annotations.map(describeAnnotation).join('\n')}
${model.getMetadata().labels.map(describeLabel).join('\n')}
${model.getMetadata().tags.map(describeTag).join('\n')}

## Entity Kinds

The model contains the following entity kinds:

${model
  .listKinds()
  .map(k => describeKind(k, model))
  .join('\n')}

## Entity Relations

The model contains the following entity relations:

${model.listRelations().map(describeRelation).join('\n')}
`;
}

function describeKind(
  kind: CatalogModelKindSummary,
  model: CatalogModel,
): string {
  return `### Entity Kind "${kind.names.kind}"

* Singular in text: "${kind.names.singular}"
* Plural in text: "${kind.names.plural}"
* Versions:
${kind.versions
  .map(
    version =>
      `  * apiVersion: "${version.apiVersion}"${
        version.specType ? ` (spec.type: "${version.specType}")` : ''
      }`,
  )
  .join('\n')}

${kind.description}
${describeFieldGroups(resolveFieldGroups(kind, model))}`;
}

type Schema = Record<string, any>;

// A field, rendered as one list item: its path, the facts known about it, and
// its description
type FieldEntry = {
  path: string;
  parts: string[];
  description?: string;
};

type FieldGroup = {
  lines: string[];
  apiVersions: string[];
  specType?: string;
};

// Resolves the fields of every version of a kind, grouping versions (per spec
// type) whose rendered field lines are identical.
function resolveFieldGroups(
  kind: CatalogModelKindSummary,
  model: CatalogModel,
): FieldGroup[] {
  const groups = new Map<string, FieldGroup>();
  for (const version of kind.versions) {
    const resolved = model.getKind({
      kind: kind.names.kind,
      apiVersion: version.apiVersion,
      spec: version.specType ? { type: version.specType } : undefined,
    });
    if (!resolved) {
      continue;
    }
    const entries = collectFields(resolved.jsonSchema, '', 0);
    for (const relationField of resolved.relationFields) {
      const part = describeRelationField(relationField);
      const existing = entries.find(e => e.path === relationField.path);
      if (existing) {
        existing.parts.push(part);
      } else {
        entries.push({ path: relationField.path, parts: [part] });
      }
    }
    if (!entries.length) {
      continue;
    }
    const lines = entries.map(renderField);
    const key = JSON.stringify([lines, version.specType ?? null]);
    const group = groups.get(key);
    if (group) {
      group.apiVersions.push(version.apiVersion);
    } else {
      groups.set(key, {
        lines,
        apiVersions: [version.apiVersion],
        specType: version.specType,
      });
    }
  }
  return [...groups.values()];
}

function describeFieldGroups(groups: FieldGroup[]): string {
  const blocks: string[] = [];
  for (const group of groups) {
    const label = `${group.apiVersions.join(', ')}${
      group.specType ? `; spec.type: "${group.specType}"` : ''
    }`;
    blocks.push(`#### Fields (${label})\n\n${group.lines.join('\n')}\n`);
  }
  return blocks.length ? `\n${blocks.join('\n')}` : '';
}

function renderField(entry: FieldEntry): string {
  return `* "${entry.path}" (${entry.parts.join(', ')})${
    entry.description ? `: ${entry.description}` : ''
  }`;
}

function describeRelationField(
  field: CatalogModelKind['relationFields'][number],
): string {
  const details = [
    field.defaultKind ? `default kind: ${field.defaultKind}` : undefined,
    field.allowedKinds?.length
      ? `allowed kinds: ${field.allowedKinds.join(', ')}`
      : undefined,
  ].filter(Boolean);
  return `relation "${field.relation}"${
    details.length ? ` [${details.join('; ')}]` : ''
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

// Lists the properties of a schema. Properties of array items are listed under
// the path of the array, which is how the catalog addresses them in queries.
function collectFields(
  schema: Schema,
  prefix: string,
  depth: number,
): FieldEntry[] {
  const node = foldAllOf(schema);
  const required = new Set(toArray(node.required));
  const entries: FieldEntry[] = [];
  for (const [name, raw] of Object.entries(
    isObject(node.properties) ? node.properties : {},
  )) {
    if (!prefix && BASE_FIELDS.has(name)) {
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
    if (!tuple && arrayLevels <= 1 && depth + 1 < MAX_FIELD_DEPTH) {
      entries.push(...collectFields(nested, path, depth + 1));
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
): FieldEntry {
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

function describeAnnotation(annotation: CatalogModelAnnotationSummary): string {
  const title = annotation.title ? `: ${annotation.title}` : '';
  return `### Annotation "${annotation.name}"${title}

${annotation.description}
`;
}

function describeLabel(label: CatalogModelLabelSummary): string {
  const title = label.title ? `: ${label.title}` : '';
  return `### Label "${label.name}"${title}

${label.description}
`;
}

function describeTag(tag: CatalogModelTagSummary): string {
  const title = tag.title ? `: ${tag.title}` : '';
  return `### Tag "${tag.name}"${title}

${tag.description}
`;
}

function describeRelation(relation: CatalogModelRelationSummary): string {
  return `### Relation "${relation.forward.type}": ${relation.forward.title}

* Reverse type: "${relation.reverse.type}": ${relation.reverse.title}

${relation.description}
`;
}

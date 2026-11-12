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

type FieldEntry = {
  path: string;
  lines: string[];
};

type FieldGroup = {
  entries: FieldEntry[];
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
      const line = describeRelationField(relationField);
      const existing = entries.find(e => e.path === relationField.path);
      if (existing) {
        existing.lines.push(line);
      } else {
        entries.push({
          path: relationField.path,
          lines: [line],
        });
      }
    }
    if (!entries.length) {
      continue;
    }
    const key = JSON.stringify([
      entries.flatMap(e => e.lines),
      version.specType ?? null,
    ]);
    const group = groups.get(key);
    if (group) {
      group.apiVersions.push(version.apiVersion);
    } else {
      groups.set(key, {
        entries,
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
    const lines = group.entries.flatMap(entry => entry.lines);
    const label = `${group.apiVersions.join(', ')}${
      group.specType ? `; spec.type: "${group.specType}"` : ''
    }`;
    blocks.push(`#### Fields (${label})\n\n${lines.join('\n')}\n`);
  }
  return blocks.length ? `\n${blocks.join('\n')}` : '';
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
  return `* "${field.path}" → relation "${field.relation}"${
    details.length ? ` (${details.join('; ')})` : ''
  }`;
}

// Keywords whose constraints apply only in some cases. They are not expanded;
// the field is marked instead, so that a reader knows the listing is partial.
const CONDITIONAL_KEYWORDS = ['anyOf', 'oneOf', 'if', 'not'];

function isObject(value: unknown): value is Schema {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toArray(value: unknown): unknown[] {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function intersect(a: unknown[], b: unknown[]): unknown[] {
  const keys = new Set(b.map(v => JSON.stringify(v)));
  return a.filter(v => keys.has(JSON.stringify(v)));
}

// Folds inline allOf entries into the schema. Every entry applies, so types
// and allowed values are intersected, required names are joined, and
// properties declared more than once are folded the same way when visited.
function foldAllOf(schema: Schema): Schema {
  if (!Array.isArray(schema.allOf)) {
    return schema;
  }
  const { allOf, ...rest } = schema;
  return allOf.filter(isObject).map(foldAllOf).reduce(combine, rest);
}

function combine(a: Schema, b: Schema): Schema {
  const result: Schema = { ...b, ...a };
  if (a.type !== undefined && b.type !== undefined) {
    result.type = intersect(toArray(a.type), toArray(b.type));
  }
  if (Array.isArray(a.enum) && Array.isArray(b.enum)) {
    result.enum = intersect(a.enum, b.enum);
  }
  if (a.required || b.required) {
    result.required = [
      ...new Set([...toArray(a.required), ...toArray(b.required)]),
    ];
  }
  if (isObject(a.properties) && isObject(b.properties)) {
    result.properties = { ...a.properties, ...b.properties };
    for (const name of Object.keys(a.properties)) {
      if (name in b.properties) {
        result.properties[name] = {
          allOf: [a.properties[name], b.properties[name]],
        };
      }
    }
  }
  if (isObject(a.items) && isObject(b.items)) {
    result.items = { allOf: [a.items, b.items] };
  }
  return result;
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
    if (!isObject(raw) || (!prefix && BASE_FIELDS.has(name))) {
      continue;
    }
    const field = foldAllOf(raw);
    const path = prefix ? `${prefix}.${name}` : name;
    entries.push(describeField(path, field, required.has(name)));
    if (depth + 1 < MAX_FIELD_DEPTH) {
      const nested = isObject(field.items) ? field.items : field;
      entries.push(...collectFields(nested, path, depth + 1));
    }
  }
  return entries;
}

function describeType(schema: Schema): string {
  if (typeof schema.$ref === 'string') {
    // Referenced definitions are not resolved, but the field must still show
    return `reference to "${schema.$ref}"`;
  }
  const types = toArray(schema.type).filter(t => typeof t === 'string');
  if (types.length === 1 && types[0] === 'array' && isObject(schema.items)) {
    return `array of ${describeType(foldAllOf(schema.items))}`;
  }
  return types.length ? types.join(' | ') : 'unknown';
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
  if (Array.isArray(schema.enum)) {
    parts.push(
      schema.enum.length
        ? `one of ${schema.enum.map(v => JSON.stringify(v)).join(', ')}`
        : 'no allowed values',
    );
  } else if ('const' in schema) {
    parts.push(`const ${JSON.stringify(schema.const)}`);
  }
  if (CONDITIONAL_KEYWORDS.some(k => k in schema)) {
    parts.push('has conditional constraints not listed here');
  }
  const description =
    typeof schema.description === 'string' ? `: ${schema.description}` : '';
  return { path, lines: [`* "${path}" (${parts.join(', ')})${description}`] };
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

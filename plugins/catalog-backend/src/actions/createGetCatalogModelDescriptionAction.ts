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
    const entries = collectProperties(resolved.jsonSchema, '', 0);
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

function isObject(value: unknown): value is Schema {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Collects own properties of a schema: top-level `properties` plus those of
// inline (non-$ref) allOf/anyOf/oneOf entries. A property is required if any
// schema that applies unconditionally (the root and its allOf entries) lists
// it, regardless of which of them declares it. Properties of array items are
// not described.
function collectProperties(
  schema: Schema,
  prefix: string,
  depth: number,
): FieldEntry[] {
  const props: Array<[string, Schema]> = [];
  const requiredNames = new Set<string>();
  const visit = (s: unknown, unconditional: boolean) => {
    if (!isObject(s) || '$ref' in s) {
      return;
    }
    if (unconditional && Array.isArray(s.required)) {
      s.required.forEach((name: string) => requiredNames.add(name));
    }
    if (isObject(s.properties)) {
      for (const [name, prop] of Object.entries(s.properties)) {
        if (isObject(prop)) {
          props.push([name, prop]);
        }
      }
    }
    if (Array.isArray(s.allOf)) {
      s.allOf.forEach(sub => visit(sub, unconditional));
    }
    for (const key of ['anyOf', 'oneOf']) {
      if (Array.isArray(s[key])) {
        s[key].forEach((sub: unknown) => visit(sub, false));
      }
    }
  };
  visit(schema, true);

  const entries: FieldEntry[] = [];
  const seen = new Set<string>();
  for (const [name, prop] of props) {
    if (!prefix && BASE_FIELDS.has(name)) {
      continue;
    }
    const path = prefix ? `${prefix}.${name}` : name;
    if (seen.has(path)) {
      continue;
    }
    seen.add(path);
    if (typeof prop.$ref === 'string') {
      // Referenced definitions are not resolved, but the field must still show
      entries.push({
        path,
        lines: [
          `* "${path}" (${
            requiredNames.has(name) ? 'required, ' : ''
          }reference to "${prop.$ref}")`,
        ],
      });
      continue;
    }
    entries.push(describeProperty(path, prop, requiredNames.has(name)));
    if (depth + 1 < MAX_FIELD_DEPTH) {
      entries.push(...collectProperties(prop, path, depth + 1));
    }
  }
  return entries;
}

function describeProperty(
  path: string,
  prop: Schema,
  required: boolean,
): FieldEntry {
  let type: string = Array.isArray(prop.type)
    ? prop.type.join(' | ')
    : prop.type ?? 'unknown';
  if (prop.type === 'array' && isObject(prop.items) && prop.items.type) {
    const itemType = Array.isArray(prop.items.type)
      ? prop.items.type.join(' | ')
      : prop.items.type;
    type = `array of ${itemType}`;
  }
  const parts = [type];
  if (required) {
    parts.push('required');
  }
  if (Array.isArray(prop.enum)) {
    parts.push(
      `one of ${prop.enum.map((v: unknown) => JSON.stringify(v)).join(', ')}`,
    );
  } else if ('const' in prop) {
    parts.push(`const ${JSON.stringify(prop.const)}`);
  }
  const description =
    typeof prop.description === 'string' ? prop.description : undefined;
  return {
    path,
    lines: [
      `* "${path}" (${parts.join(', ')})${
        description ? `: ${description}` : ''
      }`,
    ],
  };
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

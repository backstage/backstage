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

import { InputError } from '@backstage/errors';
import { FilterPredicate } from '@backstage/filter-predicates';
import { JsonObject } from '@backstage/types';
import { get } from 'lodash';
import { fromZodError } from 'zod-validation-error/v3';
import { CatalogModelOp, RelationDefinition } from '../operations';
import { SchemaObject } from 'ajv';
import { validateMetaSchema } from './validateMetaSchema';
import {
  constantOrEnumSchema,
  isJsonObject,
  relationSchema,
  stringOrStringArraySchema,
} from './util';

/**
 * Reads a JSON schema describing an entity shape, and translates it into
 * extension ops.
 */
export function readJsonSchema(schema: unknown): Array<CatalogModelOp> {
  const parsed = validateMetaSchema(schema);
  const rootSchema = findRootSchema(parsed);
  const { kinds, apiVersions, filterPredicate } =
    getFilterPredicate(rootSchema);
  const { description, examples } = getMetaProperties(parsed, rootSchema);
  const relations = getRelations(rootSchema);

  const result: Array<CatalogModelOp> = [];

  for (const kind of kinds) {
    result.push({
      type: 'kind.declare',
      kind,
      apiVersions,
      properties: {
        ...(description ? { description: { markdown: description } } : {}),
        ...(examples ? { examples: examples.map(json => ({ json })) } : {}),
      },
    });
  }

  result.push({
    type: 'entity.jsonschema',
    if: filterPredicate,
    schema: schema,
  });

  for (const relation of relations) {
    result.push({
      type: 'field.relation',
      if: filterPredicate,
      path: relation.path,
      relation: relation.relation,
    });
  }

  return result;
}

/**
 * Given the root schema, extract the apiVersions and kinds that it seems to
 * support, and form a filter predicate for them. This is used to determine
 * when the schema should be applied or not, to an incoming entity.
 */
function getFilterPredicate(schema: SchemaObject): {
  kinds: string[];
  apiVersions: string[] | undefined;
  filterPredicate: FilterPredicate;
} {
  const readConstantOrEnum = (path: string): string[] | undefined => {
    const obj = get(schema, path);
    if (!obj) {
      return undefined;
    }
    const parsed = constantOrEnumSchema.safeParse(obj);
    if (!parsed.success) {
      throw new InputError(
        `Invalid schema "${path}" property, expected an enum or const declaration`,
      );
    }
    return 'enum' in parsed.data ? parsed.data.enum : [parsed.data.const];
  };

  const apiVersions = readConstantOrEnum('properties.apiVersion');
  const kinds = readConstantOrEnum('properties.kind');

  if (!kinds) {
    throw new InputError(
      `Missing required schema "properties.kind" property, must declare what exact kind(s) are supported by this schema`,
    );
  }

  return {
    kinds,
    apiVersions,
    filterPredicate: {
      kind: kinds.length === 1 ? kinds[0] : { $in: kinds },
      ...(apiVersions
        ? {
            apiVersion:
              apiVersions.length === 1 ? apiVersions[0] : { $in: apiVersions },
          }
        : {}),
    },
  };
}

/**
 * Extract meta properties (description, examples) from the schema. These
 * can exist both in the top-level parsed schema and in the located root
 * schema. Both are checked, with the top-level parsed schema taking
 * precedence.
 */
function getMetaProperties(
  parsed: SchemaObject,
  rootSchema: SchemaObject,
): {
  description: string | undefined;
  examples: JsonObject[] | undefined;
} {
  const rawDescription = parsed.description ?? rootSchema.description;
  const description =
    typeof rawDescription === 'string' ? rawDescription : undefined;

  const rawExamples = parsed.examples ?? rootSchema.examples;
  const examples = Array.isArray(rawExamples)
    ? rawExamples.filter(isJsonObject)
    : undefined;

  return {
    description,
    examples: examples?.length ? examples : undefined,
  };
}

/**
 * Given the root schema, extract all of the relation declarations in the
 * spec.
 */
function getRelations(
  schema: SchemaObject,
): Array<{ path: string; relation: RelationDefinition }> {
  const properties = get(schema, 'properties.spec.properties');
  if (!isJsonObject(properties)) {
    return [];
  }

  const relations: Array<{ path: string; relation: RelationDefinition }> = [];

  for (const [key, value] of Object.entries(properties)) {
    if (!isJsonObject(value) || !value.relation) {
      continue;
    }

    const fullPath = `spec.${key}`;
    const relation = relationSchema.safeParse(value.relation);
    if (!relation.success) {
      throw new InputError(
        `Invalid format for "${fullPath}.relation", ${fromZodError(
          relation.error,
        )}`,
      );
    }

    const type = stringOrStringArraySchema.safeParse(value);
    if (!type.success) {
      throw new InputError(
        `Invalid type at "${fullPath}", "relation" can only be attached to a string or string array field`,
      );
    }

    relations.push({
      path: fullPath,
      relation: relation.data,
    });
  }

  return relations;
}

/**
 * Finds the schema for the root of the entity. Some schemas may directly
 * describe an object, while others have an allOf where one of the elements
 * describes the object.
 *
 * @remarks
 *
 * Direct schema:
 *
 * ```
 * {
 *   "type": "object",
 *   "properties": { ... }
 * }
 * ```
 *
 * `allOf` schema:
 *
 * ```
 * {
 *   // ...
 *   "allOf": [
 *     { "$ref": "Entity" },
 *     { "type": "object", "properties": { ... } }
 *   ]
 * }
 */
function findRootSchema(schema: SchemaObject): SchemaObject {
  // Does it have a direct definition?
  if (schema.type === 'object') {
    return schema;
  } else if (schema.type) {
    throw new InputError(
      `Invalid schema type "${schema.type}", expected "object"`,
    );
  }

  if (schema.allOf) {
    if (!Array.isArray(schema.allOf)) {
      throw new InputError(
        `Invalid schema "allOf" property, expected an array of objects`,
      );
    }
    for (const element of schema.allOf) {
      if (!isJsonObject(element)) {
        throw new InputError(
          `Invalid schema "allOf" property, expected an array of objects`,
        );
      }
      if (Object.keys(element).length === 1 && element.$ref === 'Entity') {
        // This is the oldschool `{ "$ref": "Entity" }`; we don't need to
        // take these into account since the envelope validation will happen
        // anyway
        continue;
      }
      if (element.type === 'object') {
        return element;
      }
      throw new InputError(
        `Invalid schema "allOf" property, found element with type "${
          element.type ?? '<missing>'
        }", expected "object"`,
      );
    }
  }

  throw new InputError(
    'No root schema found; expected the schema to either directly describe an entity, or have an allOf where one of the elements directly describes an entity',
  );
}
